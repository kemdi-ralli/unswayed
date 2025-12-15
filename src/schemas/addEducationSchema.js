import * as Yup from "yup";

export const educationValidationSchema = Yup.object().shape({
    institution_name: Yup.string().required("School name is required"),
    degree: Yup.string().required("Degree is required"),
    field_of_study: Yup.string().required("Field of Study is required"),
    grade: Yup.string().required("Grade is required"),
    start_date: Yup.string().required("Start date is required"),
    end_date: Yup.string().required("End date is required"),
  });