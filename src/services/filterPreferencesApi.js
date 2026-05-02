import apiInstance from "./apiService/apiServiceInstance";
import { FILTER_PREFERENCES } from "./apiService/apiEndPoints";

export async function getFilterPreferences() {
  const res = await apiInstance.get(FILTER_PREFERENCES);
  return res?.data?.data?.filter_data ?? null;
}

export async function saveFilterPreferences(filterData) {
  await apiInstance.put(FILTER_PREFERENCES, { filter_data: filterData });
}

export async function clearFilterPreferences() {
  await apiInstance.delete(FILTER_PREFERENCES);
}
