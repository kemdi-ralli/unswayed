import * as Yup from "yup";

export const employerBasicInfoValidationSchema = Yup.object().shape({
  phone: Yup.string().required("Phone Number is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  zip_code: Yup.string().required("Zip Code is required"),
  address: Yup.string().optional().nullable(),
  middle_name: Yup.string().optional().nullable(),
});
export const applicantBasicInfoValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "First Name must be at least 2 characters")
    .required("First Name is required"),

  middle_name: Yup.string().optional().nullable(),

  last_name: Yup.string()
    .min(2, "Last Name must be at least 2 characters")
    .required("Last Name is required"),

  phone: Yup.string().required("Phone Number is required"),

  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),

  zip_code: Yup.string().required("Zip Code is required"),

  address: Yup.string().required("Current Address is required"),

  dob: Yup.string().required("Date of Birth is required"),
});
export const educationValidationSchema = Yup.object().shape({
  experience_level: Yup.string().required("Experience is required"),
});
