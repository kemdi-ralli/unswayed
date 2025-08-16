import * as Yup from "yup";

export const employerBasicInfoValidationSchema = Yup.object().shape({
  phone: Yup.string()
    // .matches(
    //   /^\(\d{3}\)-\d{3}-\d{4}$/,
    //   "Phone number must be in format (123)-456-7890"
    // )
    .required("Phone Number is required"),

  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),

  zip_code: Yup.string()
    // .matches(/^\d{4,10}$/, "Zip Code must be between 4 to 10 digits")
    .required("Zip Code is required"),
});
export const applicantBasicInfoValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "First Name must be at least 2 characters")
    .required("First Name is required"),

  last_name: Yup.string()
    .min(2, "Last Name must be at least 2 characters")
    .required("Last Name is required"),

  phone: Yup.string()
    // .matches(
    //   /^\(\d{3}\)-\d{3}-\d{4}$/,
    //   "Phone number must be in format (123)-456-7890"
    // )
    .required("Phone Number is required"),

  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),

  zip_code: Yup.string()
    // .matches(/^\d{4,10}$/, "Zip Code must be between 4 to 10 digits")
    .required("Zip Code is required"),

  dob: Yup.string().required("Date of Birth is required"),
  // .test("valid-date", "Invalid date format", (value) => {
  //   return value && dayjs(value, "YYYY-MM-DD", true).isValid();
  // })
  // .test("age", "You must be at least 18 years old", (value) => {
  //   return value && dayjs().diff(dayjs(value, "YYYY-MM-DD"), "year") >= 18;
  // }),
});
export const educationValidationSchema = Yup.object().shape({
  experience_level: Yup.string().required("Experience is required"),
});
