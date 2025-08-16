import apiInstance from "@/services/apiService/apiServiceInstance";

export const fetchBlogs = async () => {
  try {
    const response = await apiInstance.get("/blogs");
    if (response?.status === 200 || response?.status === 201) {
      return response?.data?.data?.blogs;
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};
