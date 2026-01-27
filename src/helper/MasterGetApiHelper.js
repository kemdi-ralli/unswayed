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
    // Handle multiple possible response structures
    const countries = response?.data?.data?.countries || 
                     response?.data?.countries || 
                     response?.data || 
                     [];
    console.log("Countries response structure:", { 
      hasDataData: !!response?.data?.data, 
      hasData: !!response?.data,
      count: Array.isArray(countries) ? countries.length : 0 
    });
    return Array.isArray(countries) ? countries : [];
  } catch (error) {
    console.error("getCountries error:", error?.response?.data || error);
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
    // Handle multiple possible response structures
    const genders = response?.data?.data?.genders || 
                   response?.data?.genders || 
                   response?.data || 
                   [];
    console.log("Genders response structure:", { 
      hasDataData: !!response?.data?.data, 
      hasData: !!response?.data,
      count: Array.isArray(genders) ? genders.length : 0 
    });
    return Array.isArray(genders) ? genders : [];
  } catch (error) {
    console.error("getGenders error:", error?.response?.data || error);
    throw error?.response?.data?.message || "Failed to load genders";
  }
};

export const getStates = async (countryId) => {
  try {
    const response = await apiInstance.get(`${STATES}/${countryId}`);
    // Handle multiple possible response structures
    const states = response?.data?.data?.states || 
                  response?.data?.states || 
                  response?.data || 
                  [];
    console.log("States response structure:", { 
      countryId,
      hasDataData: !!response?.data?.data, 
      hasData: !!response?.data,
      count: Array.isArray(states) ? states.length : 0 
    });
    return Array.isArray(states) ? states : [];
  } catch (error) {
    console.error("getStates error:", { 
      countryId, 
      error: error?.response?.data || error 
    });
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
