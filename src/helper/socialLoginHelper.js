import { Toast } from "@/components/Toast/Toast";
import { login } from "@/redux/slices/authSlice";
import { APPLICANT_SOCIAL_LOGIN, EMPLOYER_SOCIAL_LOGIN } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import Cookie from "js-cookie";

export const socialLogedIn = async (router, dispatch, provider, accessToken) => {
  try {
    const formData = new FormData();
    formData.append("provider", provider);
    formData.append("accessToken", accessToken);

    const response = await apiInstance.post(APPLICANT_SOCIAL_LOGIN, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const socialData = response?.data?.data;

    dispatch(login(socialData));

    Cookie.set("token", socialData?.token);
    Cookie.set("is_completed", socialData?.is_completed);
    Cookie.set("userType", socialData?.user?.type);
    if (socialData?.is_completed === false) {
      router.push("/applicant/profile/edit-profile");
    }else {
      router.push("/applicant/career-areas");
    }
    if (response.status === 200 || response.status === 201) {
      Toast('success', response?.data?.message)
    }
  } catch (error) {
    console.error("Error:", error);
    console.log("r:",  error?.response?.data?.message);
    Toast('error', error?.response?.data?.message)

    throw error;
  }
};
export const employerSocialLogedIn = async (router, dispatch, provider, accessToken) => {
  try {
    const formData = new FormData();
    formData.append("provider", provider);
    formData.append("accessToken", accessToken);

    const response = await apiInstance.post(EMPLOYER_SOCIAL_LOGIN, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const socialData = response?.data?.data;
    console.log(socialData, "socialData");

    dispatch(login(socialData));

    Cookie.set("token", socialData?.token);
    Cookie.set("is_completed", socialData?.is_completed);
    Cookie.set("userType", socialData?.user?.type);
    if (socialData?.is_completed === false) {
      router.push("/employer/profile/edit-profile");
    }else {
      router.push("/employer/home");
    }
    if (response.status === 200 || response.status === 201) {
      Toast('success', response?.data?.message)
    }
  } catch (error) {
    console.error("Error:", error);
    Toast('error', error?.response?.data?.message)
    throw error;
  }
};
