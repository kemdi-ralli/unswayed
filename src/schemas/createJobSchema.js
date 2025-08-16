import * as yup from "yup";

export const createJobValidationSchema = yup.object().shape({
  title: yup.string().required("Job Title is required"),
  no_of_positions: yup
    .string()
    .required("Number of Positions is required")
    .min(1, "Number of Positions is required"),
  deadline: yup.date().required("Deadline is required"),
  job_categories: yup.array().min(1, "Select at least one category"),
  job_types: yup.array().min(1, "Select at least one job type"),
  job_locations: yup.array().min(1, "Select at least one location"),
  job_shifts: yup.array().min(1, "Select at least one shift"),
  job_shift_timing: yup.string().required("Shift timing is required"),
  experience_level: yup.string().required("Experience is required"),
  country: yup.number().required("Country is required"),
  states: yup.array().min(1, "Select at least one state"),
  cities: yup.array().min(1, "Select at least one city"),
  skills: yup.array().min(1, "Enter at least one skill"),
  //   salary: yup.string().required("Salary is required"),
  //   salary_period: yup.string().required("Salary period is required"),
  //   salary_currency: yup.string().required("Currency is required"),
  requirements: yup.string().required("Job Requirements are required"),
  company_about: yup.string().required("Company information is required"),
  //   company_benefits: yup.string().required("Benefits are required"),
  description: yup.string().required("Job description is required"),
});