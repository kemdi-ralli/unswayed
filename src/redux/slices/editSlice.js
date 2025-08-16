import { createSlice } from "@reduxjs/toolkit";

const editSlice = createSlice({
  name: "editMode",
  initialState: {
    isEditing: false,
  },
  reducers: {
    setEditMode: (state, action) => {
      state.isEditing = action.payload;
    },
  },
});

export const { setEditMode } = editSlice.actions;
export default editSlice.reducer;
