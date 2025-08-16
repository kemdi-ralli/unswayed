import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  successMessage: "",
  showMessage: false,
};

const deactivateMessage = createSlice({
  name: "message",
  initialState,
  reducers: {
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload.message;
      state.showMessage = action.payload.showMessage;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = "";
      state.showMessage = false;
    },
  },
});

export const { setSuccessMessage, clearSuccessMessage } = deactivateMessage.actions;
export default deactivateMessage.reducer;
