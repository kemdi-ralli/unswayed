import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState: {
    notification: false,
  },
  reducers: {
    notificationSetting: (state, action) => {
      console.log(action.payload);
      state.notification = action.payload;
    },
  },
});

export const { notificationSetting } = NotificationSlice.actions;
export default NotificationSlice.reducer;
