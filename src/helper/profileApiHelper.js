import { GET_PROFILE } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";


export const fetchProfile = async () => {
  try {
    const response = await apiInstance.get(GET_PROFILE);
    if (response.status === 200 || response.status === 201) {
      return response.data.data.user;
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    return null;
  }
};
