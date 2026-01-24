import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  BLOGS,
  BLOG_CATEGORIES,
  BLOG_LIKE,
  BLOG_COMMENT,
  BLOG_SHARE_STAT,
  BLOG_SHARE_CHAT,
} from "@/services/apiService/apiEndPoints";

export const fetchBlogs = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.category && params.category !== "all") queryParams.append("category", params.category);
    if (params.my_blogs) queryParams.append("my_blogs", "1");
    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);

    const url = `${BLOGS}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await apiInstance.get(url);
    if (response?.status === 200 || response?.status === 201) {
      const blogs = response?.data?.data?.blogs || response?.data?.blogs || response?.data || [];
      return Array.isArray(blogs) ? blogs : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

export const fetchBlogCategories = async () => {
  try {
    const response = await apiInstance.get(BLOG_CATEGORIES);
    if (response?.status === 200 || response?.status === 201) {
      return response?.data?.data?.categories || response?.data?.categories || [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
};

export const fetchBlogDetails = async (id) => {
  try {
    const response = await apiInstance.get(`${BLOGS}/${id}`);
    if (response?.status === 200 || response?.status === 201) {
      return response?.data?.data?.blog || response?.data?.blog;
    }
  } catch (error) {
    console.error(`Error fetching blog ${id} details:`, error);
    throw error;
  }
};

export const createBlog = async (formData) => {
  try {
    const response = await apiInstance.post(BLOGS, formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating blog:", error);
    throw error;
  }
};

export const updateBlog = async (id, formData) => {
  try {
    // PHP requires POST + _method=PUT for multipart updates
    if (!(formData instanceof FormData)) {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      formData = data;
    }
    formData.append("_method", "PUT");

    const response = await apiInstance.post(`${BLOGS}/${id}`, formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return response;
  } catch (error) {
    console.error("Error updating blog:", error);
    throw error;
  }
};

export const deleteBlog = async (id) => {
  try {
    const response = await apiInstance.delete(`${BLOGS}/${id}`);
    return response;
  } catch (error) {
    console.error("Error deleting blog:", error);
    throw error;
  }
};

export const likeBlog = async (blogId) => {
  try {
    const response = await apiInstance.post(`${BLOG_LIKE}/${blogId}`);
    return response;
  } catch (error) {
    console.error("Error liking blog:", error);
    throw error;
  }
};

export const commentBlog = async (blogId, comment, parentId = null) => {
  try {
    const response = await apiInstance.post(`${BLOG_COMMENT}/${blogId}`, {
      comment,
      parent_id: parentId,
    });
    return response;
  } catch (error) {
    console.error("Error commenting on blog:", error);
    throw error;
  }
};

export const trackBlogShare = async (blogId) => {
  try {
    const response = await apiInstance.post(`${BLOG_SHARE_STAT}/${blogId}`);
    return response;
  } catch (error) {
    console.error("Error tracking share stat:", error);
    throw error;
  }
};

export const shareBlogInChat = async (blogId, receivers) => {
  try {
    const response = await apiInstance.post(`${BLOG_SHARE_CHAT}/${blogId}`, {
      receivers,
    });
    return response;
  } catch (error) {
    console.error("Error sharing blog in chat:", error);
    throw error;
  }
};
