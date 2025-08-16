import * as yup from "yup";
export const employerProfileSchema = yup.object().shape({
  company_name: yup.string().required("Company name is required"),
  company_size: yup.string().required("Company size is required"),
  industry: yup.string().required("Industry is required"),
  company_type: yup.string().required("Company type is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  website: yup.string().required("Website is required"),
  founded: yup.string().required("Founded year is required"),
  zip_code: yup
    .string()
    // .matches(/^\d{5}$/, "Zip Code must be a valid 5-digit number")
    .required("Zip code is required"),
  about: yup
    .string()
    .min(10, "About section must be at least 10 characters")
    .required("About is required"),
});

export const applicantProfileSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  dob: yup.string().required("Date Of Birth is required"),
  gender: yup.string().required("Gender is required"),
  country: yup.string().required("Country is required"),
  state: yup.string().required("State is required"),
  city: yup.string().required("City is required"),
  ethnicity: yup.string().required("Ethnicity is required"),
  zip_code: yup
    .string()
    // .matches(/^\d{5}$/, "Zip Code must be a valid 5-digit number")
    .required("Zip code is required"),
  about: yup
    .string()
    .min(10, "About section must be at least 10 characters")
    .required("About is required"),
});
