import { createSlice } from "@reduxjs/toolkit";


const applicantCv = createSlice({
    name:'cv',
    initialState: {
        attachedCvs: {}
    },
    reducers: {
        setCvs: (state, action) =>{
            state.attachedCvs = action.payload;
        }
    }
})

export const { setCvs } = applicantCv.actions;

export default applicantCv.reducer;