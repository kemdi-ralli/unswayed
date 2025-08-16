import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    userData: {},
  },
  reducers: {
    login: (state, action) => {
      state.userData = action.payload;
    },
    clearUserDataLogout: (state) => {
      state.userData = {};
    },
  },
});

export const { login, clearUserDataLogout } = authSlice.actions;
export default authSlice.reducer;
