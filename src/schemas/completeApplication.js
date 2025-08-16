import * as yup from "yup";

export const completeApplicationCheckboxValidationSchema = yup.object().shape({
    is_adult: yup.string().oneOf(["yes", "no"]).required("Select a value"),
    authorized_to_work: yup.string().oneOf(["yes", "no"]).required("Select a value"),
    have_visa: yup.string().oneOf(["yes", "no"]).required("Select a value"),
    meet_qualifications: yup.string().oneOf(["yes", "no"]).required("Select a value"),
    meet_educations: yup.string().oneOf(["yes", "no"]).required("Select a value"),
    have_disability: yup.string().oneOf(["yes", "no", "no_answer"]).required("Select a value"),
    is_veteran: yup.string().oneOf(["yes", "no", "no_answer"]).required("Select a value"),
    // resume: yup.mixed().required("Select a resume"),
  });