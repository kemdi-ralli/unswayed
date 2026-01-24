import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  CAREER_JOBS,
  CITIES,
  CITIES_STATES_NAME,
  COUNTRIES,
  ETHNICITIES,
  GENDERS,
  JOB_CATEGORIES,
  JOB_LOCATIONS,
  JOB_SHIFTS,
  JOB_TYPES,
  STATES,
} from "@/services/apiService/apiEndPoints";

// US inhabited territories that have cities
const US_INHABITED_TERRITORIES = [
  "American Samoa",
  "Guam",
  "Northern Mariana Islands",
  "Puerto Rico",
  "U.S. Virgin Islands",
];

export const getJobCategories = async () => {
  try {
    const response = await apiInstance.get(JOB_CATEGORIES);
    return response?.data?.data?.job_categories || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load job categories";
  }
};

export const getJobLocations = async () => {
  try {
    const response = await apiInstance.get(JOB_LOCATIONS);
    return response?.data?.data?.job_locations || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load job locations";
  }
};

export const getJobShifts = async () => {
  try {
    const response = await apiInstance.get(JOB_SHIFTS);
    return response?.data?.data?.job_shifts || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load job shifts";
  }
};

export const getJobTypes = async () => {
  try {
    const response = await apiInstance.get(JOB_TYPES);
    return response?.data?.data?.job_types || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load job types";
  }
};

export const getCountries = async () => {
  try {
    const response = await apiInstance.get(COUNTRIES);
    return response?.data?.data?.countries || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load countries";
  }
};
export const getEthnicity = async () => {
  try {
    const response = await apiInstance.get(ETHNICITIES);
    return response?.data?.data?.Ethnicities || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load countries";
  }
};
export const getGenders = async () => {
  try {
    const response = await apiInstance.get(GENDERS);
    return response?.data?.data?.genders || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load countries";
  }
};

export const getStates = async (countryId) => {
  try {
    const response = await apiInstance.get(`${STATES}/${countryId}`);
    return response?.data?.data?.states || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load states";
  }
};

export const getCities = async (stateId) => {
  try {
    // Check if stateId is a US inhabited territory (string name)
    if (typeof stateId === 'string' && US_INHABITED_TERRITORIES.includes(stateId)) {
      // Use name-based endpoint for territories
      const response = await apiInstance.get(`${CITIES_STATES_NAME}/${stateId}`);
      return response?.data?.data?.cities || [];
    }
    
    // Use ID-based endpoint for regular states
    const response = await apiInstance.get(`${CITIES}/${stateId}`);
    return response?.data?.data?.cities || [];
  } catch (error) {
    throw error?.response?.data?.message || "Failed to load cities";
  }
};

// export const getJobs = async () => {
//   try {
//     const response = await apiInstance.get(CAREER_JOBS);
//     return response?.data?.data?.jobs || [];
//   } catch (error) {
//     throw error?.response?.data?.message || "Failed to load jobs";
//   }
// };
