// Applicant endpoints

export const VERIFY = "verify-otp";
export const RESEND = "resend-otp";
export const LOGOUT = "logout";

// Applicant endpoints
export const APPLICANT_LOGIN = "applicant/login";
export const APPLICANT_REGISTRATION = "/applicant/register";
export const APPLICANT_CHECK_EMAIL = "applicant/check-email";
export const APPLICANT_CHECK_USERNAME = "applicant/check-username";
export const APPLICANT_CHECK_PHONE = "applicant/check-phone";

// USER ENDPOINT
export const GET_PROFILE = "applicant/profile";
export const FOLLOW_USER = "user-follow";
export const GET_NETWORK = `networks`;
export const GET_TALENT_NETWORK = `recommendation`;
export const SEARCH_TALENT_NETWORK = `search`;
export const USER_PROFILE = `profile`;
export const CHANGE_PHONE_NUMBER = `settings/change-phone`;
export const CHANGE_EMAIL = `settings/change-email`;
export const CHANGE_PASSWORD = `change-password`;
export const GET_NOTIFICATIONS = `notifications`;
export const MARK_READ_NOTIFICATION = `notification`;
export const VERIFICATION_SETTING_OTP = `settings/verify-otp`;
export const GET_CHATS = `chats`;
export const GET_MESSAGES = `chats`;
export const GET_POPULAR_COMPANIES = "employer/popular";
export const GET_SHORT_PROFILE = "employerProfile";
export const SEND_RESET_OTP = "send-reset-otp";
export const VERIFY_RESET_OTP = "verify-reset-otp";
export const RESET_PASSWORD = "reset-password";
export const ENHANCE = "enhance";
export const APPLICANT_SOCIAL_LOGIN = "/applicant/social-login";
export const ANOTHER_EMAIL = "/correct-email";

// Applicant endpoints

export const CAREER_JOBS = "applicant/career-jobs";
export const EXTERNAL_JOBS = "applicant/external-jobs";
export const CAREER_JOBS_DETAILS = "job-detail";
export const ATTACHED_CV = "applicant/resume/upload";
export const COUNTRIES = "/countries";
export const STATES = "/states";
export const CITIES = "/cities";
export const CITIES_STATES_NAME = "/cities-by-state-name"
export const COUNTRY_STATES_NAME = "/states-by-country-name"
export const GENDERS = "/genders";
export const JOB_CATEGORIES = "/job_categories";
export const JOB_TYPES = "/job_types";
export const JOB_LOCATIONS = "/job_locations";
export const JOB_SHIFTS = "/job_shifts";
export const JOB_SHIFTS_TIMMING = "/job_shift_timings";
export const MY_APPLICATIONS = "/applicant/my-applications";
export const APPLICATION_TRACKING = "/applicant/application-tracking";
export const MY_ACTIVITIES = "/applicant/my-activities";
export const APPLICANT_GET_RESUMES = "/applicant/resume/resumes";
export const APPLICANT_DELETE_RESUMES = "/applicant/resume/delete";
export const APPLICANT_REPLACE_RESUME = "/applicant/resume/update";
export const APPLICANT_RENAME_RESUME = "/applicant/resume/rename";
export const APPLICANT_UPDATE_RESUME_TITLE = "/applicant/resume/update-title";
export const APPLICANT_APPLY_JOB = "/applicant/job";
export const DISABILITIES = "/disabilities";
export const SAVE_JOB = "/applicant/job-save";
export const GET_SAVE_JOB = "/applicant/saved-jobs";
export const APPLICANT_BUILD_RESUME = "/applicant/resume/build";
export const APPLICANT_REBUILD_RESUME = "/applicant/resume/rebuild";
export const APPLICANT_AFFINDA_UPLOAD = "/applicant/resume/affinda-upload";
export const APPLICANT_EXTRACT_AUTO_COMPLETE = "/applicant/resume/extract-auto-complete";
export const ADD_REVIEW = "/applicant/add-review";
export const UPDATE_PROFILE = "/applicant/update-profile";
export const GET_JOB_ALERT = "/applicant/job-alerts";
export const SET_JOB_ALERT = "/applicant/job-alerts";
export const DELETE_JOB_ALERT = "/applicant/job-alerts";
export const GET_SETTINGS = "/settings";
export const CHANGE_SETTING = "/settings/change-setting";
export const UPDATE_PROFILE_PIC = "/applicant/change-profile-pic";
export const ETHNICITIES = "/ethnicities";
export const APPLICANT_EDUCATION = "/applicant/education";

// Employer EndPoints
export const EMPLOYER_REGISTRATION = "/employer/register";
export const EMPLOYER_LOGIN = "employer/login";
export const EMPLOYER_CHECK_EMAIL = "employer/check-email";
export const EMPLOYER_CHECK_USERNAME = "employer/check-username";
export const EMPLOYER_CHECK_PHONE = "employer/check-phone";
export const EMPLOYER_GET_PROFILE = "employer/profile";
export const EMPLOYER_GET_REVIEWS = "employer/reviews";
export const EMPLOYER_CRUD_JOBS = "employer/jobs";
export const GET_NETWORKS_JOBS = "employer/network-jobs";
export const GET_JOB_DETAIL = "job-detail";
export const DASHBOARD_APPLICATIONS = "employer/job-applications";
export const EMPLOYER_APPLICATION_ACTION = "employer/job-application";
export const GET_APPLICATION_DETAIL = "application-details";
export const EMPLOYER_UPDATE_PROFILE = "/employer/update-profile";
export const UPDATE_EMPLOYER_PROFILE_PIC = "/employer/change-profile-pic";
export const NOT_INTERESTED = "/post/mark-not-interesting" 
export const REPORT_POST = "/post/report-post" 
export const EMPLOYER_SOCIAL_LOGIN = "/employer/social-login";
export const EMPLOYER_GOOGLE_STATUS = "/employer/google/status";
export const EMPLOYER_GOOGLE_AUTH_URL = "/employer/google/auth-url";
export const EMPLOYER_GOOGLE_CALLBACK = "/employer/google/callback";
export const EMPLOYER_GOOGLE_DISCONNECT = "/employer/google/disconnect";
export const EMPLOYER_GOOGLE_GENERATE_MEET_LINK = "/employer/google/generate-meet-link";
export const DEACTIVATE_ACCOUNT = "/settings/deactivate-account";
export const REACTIVATE_ACCOUNT = "/settings/reactivate-account";

// Blog (public list/detail; auth for like and comments CUD)
export const BLOGS = "blogs";
export const BLOG_LIKE = "blogs/like";
export const blogDetail = (id) => `blogs/${id}`;
export const blogComments = (id) => `blogs/${id}/comments`;
export const blogCommentUpdate = (id) => `blogs/comments/${id}`;
export const blogCommentDelete = (id) => `blogs/comments/${id}`;

export const GET_FEEDBACK = "feedback";
export const CREATE_FEEDBACK = "feedback";

export const FILTER_PREFERENCES = "/applicant/filter-preferences";
