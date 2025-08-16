import * as Yup from "yup";

const currentYear = new Date().getFullYear();

export const CompanyRegistrationSchema = Yup.object().shape({
  company_name: Yup.string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name cannot exceed 100 characters")
    .required("Company name is required"),

  company_size: Yup.number()
    .typeError("Company size must be a number")
    .positive("Company size must be a positive number")
    .integer("Company size must be an integer")
    .required("Company size is required"),

  industry: Yup.string()
    .min(2, "Industry must be at least 2 characters")
    .max(50, "Industry cannot exceed 50 characters")
    .required("Industry is required"),

  company_type: Yup.string()
    .min(2, "Company type must be at least 2 characters")
    .max(50, "Company type cannot exceed 50 characters")
    .required("Company type is required"),

  founded: Yup.string()
    .typeError("Founded must be a number")
    .matches(/^\d{4}$/, "Founded year must be a valid 4-digit year")
    .test("min", "Founded year must be at least 1900", value => {
      const year = Number(value);
      return year >= 1900;
    })
    .test("max", "Founded year cannot be in the future", value => {
      const year = Number(value);
      return year <= currentYear;
    })
    .required("Founded year is required"),

  website: Yup.string()
    .matches(
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
      "Enter a valid website URL"
    )
    .required("Website is required"),

  about: Yup.string()
    .min(10, "About section must be at least 10 characters")
    .max(1000, "About section cannot exceed 1000 characters")
    .required("About section is required"),
});
