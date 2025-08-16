import * as yup from "yup";
import { emailValidation } from "./validations";

export const ApplicantSignUpSchema = yup.object({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters"),

  email: emailValidation,

  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must include at least one uppercase letter")
    .matches(/[0-9]/, "Password must include at least one number")
    .matches(/[!@#$%^&*]/, "Password must include at least one special character"),

    password_confirmation: yup
    .string()
    .oneOf(
      [yup.ref("password", { context: true }), null],
      "Passwords must match"
    )
    .required("Confirm Password is required"),
});
