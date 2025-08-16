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

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["notificationTye","auth", "appliedJobs", "applicantAttachedCv", "getSetting"],
};

export default persistReducer(persistConfig, rootReducer);
