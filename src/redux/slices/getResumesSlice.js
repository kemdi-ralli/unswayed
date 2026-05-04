import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  APPLICANT_GET_RESUMES,
  APPLICANT_DELETE_RESUMES,
  ATTACHED_CV,
  APPLICANT_REPLACE_RESUME,
  APPLICANT_RENAME_RESUME,
  APPLICANT_UPDATE_RESUME_TITLE,
  APPLICANT_AFFINDA_UPLOAD,
  APPLICANT_AFFINDA_GENERATE,
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

      const response = await apiInstance.post(ATTACHED_CV, formData);

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
        formData
      );

      return response.data.data?.resume;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error replacing resume"
      );
    }
  }
);

export const renameResume = createAsyncThunk(
  "resumes/renameResume",
  async ({ id, title }, { rejectWithValue }) => {
    try {
      // Use new update-title endpoint
      const response = await apiInstance.patch(
        `${APPLICANT_UPDATE_RESUME_TITLE}/${id}`,
        { title }
      );

      return response.data.data?.resume;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error renaming resume"
      );
    }
  }
);

export const affindaUploadResume = createAsyncThunk(
  "resumes/affindaUploadResume",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiInstance.post(APPLICANT_AFFINDA_UPLOAD, formData);

      return response.data.data?.resume;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error processing resume with AI"
      );
    }
  }
);

// Affinda-generate: parses the uploaded file and persists a new build-type resume.
// Backend polls Affinda (up to 60 s) — we must allow ≥ 90 s for the request.
// The modal owns its own loading state; this thunk deliberately avoids touching
// state.loading so the global Backdrop in AddResume.jsx is not triggered.
export const affindaGenerateResume = createAsyncThunk(
  "resumes/affindaGenerateResume",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await apiInstance.post(APPLICANT_AFFINDA_GENERATE, formData, {
        timeout: 90000, // 90 s — Affinda processing can take up to 60 s
      });

      return response.data.data?.resume;
    } catch (error) {
      // Differentiate 422 (extraction failure) from all other errors so the
      // modal can show the API's message verbatim for 422 only.
      const status = error.response?.status;
      const message = error.response?.data?.message;
      return rejectWithValue({
        status,
        message:
          message ||
          (status === 422
            ? "Failed to extract resume data."
            : "Something went wrong. Please try again later."),
      });
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
      .addCase(affindaUploadResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(affindaUploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = [action.payload, ...state.resumes];
      })
      .addCase(affindaUploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // affindaGenerateResume — no loading flag changes; modal handles its own state
      .addCase(affindaGenerateResume.fulfilled, (state, action) => {
        state.resumes = [action.payload, ...state.resumes];
      })
      .addCase(affindaGenerateResume.rejected, (state, action) => {
        state.error = action.payload?.message || null;
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
      })
      .addCase(renameResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(renameResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = state.resumes.map((resume) =>
          resume.id === action.payload.id ? action.payload : resume
        );
      })
      .addCase(renameResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default resumeSlice.reducer;
