import { Toast } from "@/components/Toast/Toast";
import { EMPLOYER_APPLICATION_ACTION } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

export const employerApplicationAction = async (applicationId, objData) => {
  try {
    const response = await apiInstance.patch(`${EMPLOYER_APPLICATION_ACTION}/${applicationId}/action`, objData);
    Toast("success", response?.data?.message);
    return response;
  } catch (error) {
    Toast("error", error?.response?.data?.message);
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