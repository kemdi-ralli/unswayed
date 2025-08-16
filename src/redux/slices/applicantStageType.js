import { createSlice } from "@reduxjs/toolkit";

const applicantStageType = createSlice({
  name: 'applicantStage',
  initialState: {
    stageType: {}
  },
  reducers: {
    setType: (state, action) => {
      state.stageType = action.payload;
    },
  },
});


export const { setType } = applicantStageType.actions;

export default applicantStageType.reducer;
