import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import applicantFormReducer from "./slices/applicantRegistrationFormSlice";
import authSlice from "./slices/authSlice";
import applicantAppliedJob from "./slices/applicantAppliedSpecificJob";
import attachedCv from "./slices/applicantCv";
import applicantType from "./slices/applicantStageType";
import allResume from "./slices/getResumesSlice";
import NotificationSlice from "./slices/NotificationSettingSlice";
import editMode from "./slices/editSlice";
import deactivateMessage from "./slices/deactivateMessageSlice"
import notifyType from "./slices/NotificationSlice"

const rootReducer = combineReducers({
  form: applicantFormReducer,
  auth: authSlice,
  appliedJobs: applicantAppliedJob,
  applicantAttachedCv: attachedCv,
  applicantLetterType: applicantType,
  getResume: allResume,
  getSetting: NotificationSlice,
  getEdit: editMode,
  deactivateAccount: deactivateMessage,
  notificationTye: notifyType
});

// Persist only small slices to keep rehydration fast (large slices like appliedJobs/applicantAttachedCv are refetched per page).
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "getSetting", "notificationTye"],
};

export default persistReducer(persistConfig, rootReducer);
