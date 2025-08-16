import * as Yup from "yup";

export const reportValidationSchema = Yup.object().shape({
  report_type: Yup.string().required("Please select a type to report this post."),
});
