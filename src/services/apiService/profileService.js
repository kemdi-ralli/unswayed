// src/services/profileService.js
import apiInstance from "@/services/apiService/apiServiceInstance";
import { EMPLOYER_GET_PROFILE } from "@/services/apiService/apiEndPoints";

export async function fetchProfile() {
  try {
    const response = await apiInstance.get(EMPLOYER_GET_PROFILE);
    return response?.data?.data?.user || {};
  } catch (err) {
    console.error("Error fetching profile:", err);
    return {};
  }
}
