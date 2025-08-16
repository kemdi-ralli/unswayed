import * as Yup from "yup";
export const changePhoneSchema = Yup.object().shape({
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9+\-\s()]+$/, "Invalid phone number format"),
    password: Yup.string()
      .required("Current password is required")
  });
  
  export const otpSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
  });