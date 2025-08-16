import { createSlice } from "@reduxjs/toolkit";

const applicantAppliedSpecificJob = createSlice({
  name: 'applicantAppliedJob',
  initialState: {
    appliedData: ''
  },
  reducers: {
    setAppliedData: (state, action) => {
      state.appliedData = action.payload;
    },
  },
});


export const { setAppliedData } = applicantAppliedSpecificJob.actions;

export default applicantAppliedSpecificJob.reducer;
