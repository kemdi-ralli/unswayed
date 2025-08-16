import * as Yup from 'yup';

const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const emailValidation = Yup.string()
  .required('Email is required')
  .matches(emailRegExp, 'Invalid email address');