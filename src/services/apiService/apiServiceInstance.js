import axios from "axios";
import Cookies from "js-cookie";

// const BASE_URL = "http://10.10.1.2:8000/api/";
const BASE_URL = "https://ralli.logodesignagency.co/api/";

const apiInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json, ",
  },
});

apiInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized access - perhaps redirect to login?");
    }
    return Promise.reject(error);
  }
);

export default apiInstance;
