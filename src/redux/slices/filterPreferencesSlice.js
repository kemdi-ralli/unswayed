import { createSlice } from "@reduxjs/toolkit";

export const DEFAULT_FILTER_STATE = {
  country: "",
  state: [],
  city: "",
  job_category: [],
  job_location: "",
  job_type: "",
  job_shift: "",
  experience_level: "",
  skills: [],
  salary: "",
  salary_max: "",
  job_kind: "all",
  currencyLabel: "",
};

const filterPreferencesSlice = createSlice({
  name: "filterPreferences",
  initialState: {
    filters: DEFAULT_FILTER_STATE,
    isLoading: false,
    isSaving: false,
  },
  reducers: {
    setFilters(state, action) {
      state.filters = { ...DEFAULT_FILTER_STATE, ...action.payload };
    },
    setFilterLoading(state, action) {
      state.isLoading = action.payload;
    },
    setFilterSaving(state, action) {
      state.isSaving = action.payload;
    },
    resetFilters(state) {
      state.filters = DEFAULT_FILTER_STATE;
    },
  },
});

export const { setFilters, setFilterLoading, setFilterSaving, resetFilters } =
  filterPreferencesSlice.actions;
export default filterPreferencesSlice.reducer;
