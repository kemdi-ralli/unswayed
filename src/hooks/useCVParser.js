import { useState } from "react";

/**
 * Safely extract a string from Affinda-like values
 * Handles strings, arrays, and { value: "" } objects.
 */
const safeString = (v) => {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) {
    const first = v[0];
    if (!first) return "";
    if (typeof first === "string") return first.trim();
    if (typeof first === "object")
      return (
        first.value ||
        first.email ||
        first.text ||
        first.name ||
        JSON.stringify(first)
      ).trim();
    return String(first);
  }
  if (typeof v === "object") {
    return (
      v.value ||
      v.email ||
      v.text ||
      v.name ||
      v.number ||
      JSON.stringify(v)
    ).trim();
  }
  return String(v).trim();
};

export default function useCVParser() {
  const [parsedCV, setParsedCV] = useState(null);

  const applyParsedCVData = (parsed) => {
    setParsedCV(parsed);
  };

  /**
   * Extract & normalize personal info from parsed CV
   */
  const extractPersonalInfo = () => {
    if (!parsedCV) return {};

    const name = parsedCV?.name || {};
    const contact = parsedCV?.contact || {};
    const location =
      parsedCV?.location ||
      contact?.address ||
      parsedCV?.personal_information?.address ||
      "";

    const rawPhone =
      contact?.phone ||
      parsedCV?.phone ||
      parsedCV?.personal_information?.phone ||
      "";
    const phone = safeString(rawPhone);

    // Split phone number into country code and local number
    let countryCode = "";
    let phoneNumber = "";
    if (phone.startsWith("+")) {
      const match = phone.match(/^(\+\d{1,3})(.*)$/);
      if (match) {
        countryCode = match[1];
        phoneNumber = match[2]?.trim() || "";
      }
    }

    return {
      first_name: safeString(
        name?.first ||
          parsedCV?.first_name ||
          parsedCV?.personal_information?.first_name
      ),
      last_name: safeString(
        name?.last ||
          parsedCV?.last_name ||
          parsedCV?.personal_information?.last_name
      ),
      email: safeString(
        contact?.email || parsedCV?.email || parsedCV?.properties?.email
      ),
      phone,
      countryCode,
      phoneNumber,
      address: safeString(location),
      city: safeString(contact?.city || parsedCV?.city),
      country: safeString(contact?.country || parsedCV?.country),
    };
  };

  /**
   * Extract education history as clean strings
   */
  const extractEducation = () => {
    const educationList = parsedCV?.education || [];
    if (!Array.isArray(educationList)) return [];

    return educationList.map((edu) => ({
      institution_name: safeString(edu?.organization),
      degree: safeString(
        edu?.accreditation?.educationLevel || edu?.degree || edu?.title
      ),
      field_of_study: safeString(
        edu?.accreditation?.inputStr || edu?.field_of_study || edu?.major
      ),
      grade: safeString(edu?.grade),
      start_date: safeString(edu?.dates?.start || edu?.start_date),
      end_date: safeString(edu?.dates?.end || edu?.end_date),
    }));
  };

  /**
   * Extract work experience
   */
  const extractExperience = () => {
    const experienceList = parsedCV?.workExperience || [];
    if (!Array.isArray(experienceList)) return [];

    return experienceList.map((exp) => ({
      company: safeString(exp?.organization || exp?.company),
      position: safeString(exp?.jobTitle || exp?.title),
      summary: safeString(exp?.jobDescription || exp?.summary),
      start_date: safeString(exp?.dates?.start || exp?.start_date),
      end_date: safeString(exp?.dates?.end || exp?.end_date),
    }));
  };

  /**
   * Extract skills as array of strings
   */
  const extractSkills = () => {
    const skillsList = parsedCV?.skills || [];
    if (!Array.isArray(skillsList)) return [];
    return skillsList
      .map((skill) => safeString(skill?.name || skill))
      .filter(Boolean);
  };

  return {
    parsedCV,
    applyParsedCVData,
    extractPersonalInfo,
    extractEducation,
    extractExperience,
    extractSkills,
  };
}
