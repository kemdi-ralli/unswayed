import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isNotification: false,
  isChat: false,
};

const NotificationSlice = createSlice({
    name: 'type',
    initialState,
    reducers: {
      setType: (state, action) => {
        const { isNotification, isChat, type } = action.payload;
  
        if (typeof isNotification === 'boolean') {
          state.isNotification = isNotification;
        }
  
        if (typeof isChat === 'boolean') {
          state.isChat = isChat;
        }
  
        if (type === 'notification') {
          state.isNotification = true;
        }
  
        if (type === 'chat') {
          state.isChat = true;
        }
      },
    },
  });
  

export const { setType } = NotificationSlice.actions;
export default NotificationSlice.reducer;
