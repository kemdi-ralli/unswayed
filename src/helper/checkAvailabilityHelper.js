/**
 * Calls backend availability endpoints (GET with query params).
 * Backend returns 200 with { "exists": true } or { "exists": false }.
 * Used to block "Next" and show errors when email/username/phone already exist.
 */
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  APPLICANT_CHECK_EMAIL,
  APPLICANT_CHECK_USERNAME,
  APPLICANT_CHECK_PHONE,
  EMPLOYER_CHECK_EMAIL,
  EMPLOYER_CHECK_USERNAME,
  EMPLOYER_CHECK_PHONE,
} from "@/services/apiService/apiEndPoints";

const ENDPOINTS = {
  applicant: { email: APPLICANT_CHECK_EMAIL, username: APPLICANT_CHECK_USERNAME, phone: APPLICANT_CHECK_PHONE },
  employer: { email: EMPLOYER_CHECK_EMAIL, username: EMPLOYER_CHECK_USERNAME, phone: EMPLOYER_CHECK_PHONE },
};

/**
 * @param {"applicant" | "employer"} userType
 * @param {{ email?: string, username?: string, phone?: string }} fields
 * @returns {Promise<{ email?: { available: boolean, message?: string }, username?: { available: boolean, message?: string }, phone?: { available: boolean, message?: string } }>}
 */
export async function checkAvailability(userType, fields) {
  const base = ENDPOINTS[userType];
  if (!base) throw new Error("Invalid userType");

  const result = {};

  const checkOne = async (key, value, path) => {
    const v = typeof value === "string" ? value.trim() : "";
    if (!v) return;
    try {
      const param = key === "phone" ? "phone" : key;
      const { data } = await apiInstance.get(path, { params: { [param]: v } });
      const exists = data?.exists === true;
      result[key] = { available: !exists, message: exists ? (key === "email" ? "This email is already registered." : key === "username" ? "This username is already taken." : "This phone number is already registered.") : undefined };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not verify availability.";
      result[key] = { available: false, message: msg };
    }
  };

  if (fields.email) await checkOne("email", fields.email, base.email);
  if (fields.username) await checkOne("username", fields.username, base.username);
  if (fields.phone) await checkOne("phone", fields.phone, base.phone);

  return result;
}
