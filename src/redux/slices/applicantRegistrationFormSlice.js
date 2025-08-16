import { createSlice } from '@reduxjs/toolkit';

const applicantRegistrationFormSlice = createSlice({
  name: 'applicantForm',
  initialState: {
    formData: {
      basicInfo: {},
      educationInfo: {},
      registrationInfo: {},
    },
  },
  reducers: {
    finalFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
});

export const { finalFormData } = applicantRegistrationFormSlice.actions;

export default applicantRegistrationFormSlice.reducer;
