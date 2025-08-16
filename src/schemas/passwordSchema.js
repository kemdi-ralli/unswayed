import * as Yup from "yup";

export const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    // .min(8, "Password must be at least 8 characters")
    .matches(
     /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
      "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character."
    ),

  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password", { context: true }), null], "Passwords must match")
    .required("Confirm Password is required"),
});


export const otpValidation = Yup.string()
.required("OTP is required")
.matches(/^\d+$/, "OTP must be a number")
.min(4, "OTP must be at least 4 digits")
.max(6, "OTP must be at most 6 digits");


export const currentPasswordSchema = Yup.object().shape({
  current_password: Yup.string().required("Current password is required"),
  password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/,
      "Password must include at least one uppercase letter, one number, and one special character"
    ),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});