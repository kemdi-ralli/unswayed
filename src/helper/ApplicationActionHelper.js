import { Toast } from "@/components/Toast/Toast";
import { EMPLOYER_APPLICATION_ACTION } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

/** Build a plain object from FormData or other payload for JSON body */
const toJsonBody = (objData) => {
  if (objData == null) return {};
  if (objData instanceof FormData) {
    const obj = {};
    for (const [key, value] of objData.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  return typeof objData === "object" && !Array.isArray(objData) ? objData : {};
};

export const employerApplicationAction = async (applicationId, objData) => {
  try {
    const body = toJsonBody(objData);
    const response = await apiInstance.patch(
      `${EMPLOYER_APPLICATION_ACTION}/${applicationId}/action`,
      body
    );
    Toast("success", response?.data?.message);
    return response;
  } catch (error) {
    const msg = error?.response?.data?.message ?? error?.message ?? "Action failed";
    Toast("error", msg);
    return error?.response;
  }
};

export const applicantInterviewResponse = async (interviewId, objData) => {
  try {
    const response = await apiInstance?.post(`/applicant/job-application/${interviewId}/interview-response`, objData);
    Toast("success", response?.data?.message);
    return response;
  } catch (error) {
    Toast("error", error?.response?.data?.message);
    return error?.response;
  }
};

export const applicantOfferResponse = async (offerId, objData) => {
  try {
    const response = await apiInstance?.post(`/applicant/job-application/${offerId}/offer-response`, objData);
    Toast("success", response?.data?.message);
    return response;
  } catch (error) {
    Toast("error", error?.response?.data?.message);
    return error?.response;
  }
};