import apiInstance from "@/services/apiService/apiServiceInstance";
import { ENHANCE } from "@/services/apiService/apiEndPoints";

export const enhanceText = async (text) => {
  try {
    const formData = new FormData();
    formData.append("text", text);

    const response = await apiInstance.post(ENHANCE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200 || response.status === 201) {
      return response?.data?.data?.enhanced_text;
    } else {
      throw new Error("Failed to enhance text");
    }
  } catch (error) {
    console.error("Error enhancing text:", error);
    throw error;
  }
};
