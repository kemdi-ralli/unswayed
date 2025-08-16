import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  APPLICANT_GET_RESUMES,
  APPLICANT_DELETE_RESUMES,
  ATTACHED_CV,
  APPLICANT_REPLACE_RESUME,
} from "@/services/apiService/apiEndPoints";

export const getResumes = createAsyncThunk("resumes/getResumes", async () => {
  const response = await apiInstance.get(APPLICANT_GET_RESUMES);
  return response.data.data.resumes || [];
});

export const deleteResume = createAsyncThunk(
  "resumes/deleteResume",
  async (id) => {
    await apiInstance.delete(`${APPLICANT_DELETE_RESUMES}/${id}`);
    return id;
  }
);

export const attachResume = createAsyncThunk(
  "resumes/attachResume",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiInstance.post(ATTACHED_CV, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data.data?.resume;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error attaching resume"
      );
    }
  }
);

export const replaceResume = createAsyncThunk(
  "resumes/replaceResume",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiInstance.post(
        `${APPLICANT_REPLACE_RESUME}/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data.data?.resume;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error replacing resume"
      );
    }
  }
);

const resumeSlice = createSlice({
  name: "resumes",
  initialState: {
    resumes: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter(
          (resume) => resume.id !== action.payload
        );
      })
      .addCase(attachResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(attachResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = [action.payload, ...state.resumes];
      })      
      .addCase(attachResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(replaceResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(replaceResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = state.resumes.map((resume) =>
          resume.id === action.payload.id ? action.payload : resume
        );
      })
      .addCase(replaceResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resumeSlice.reducer;
