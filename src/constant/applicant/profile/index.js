export const PROFILE_DETAILS = {
  userProfile: "/assets/images/profile/profile.png",
  userName: "James Anderson",
  contactDetails: [
    {
      title: "Email",
      name: "email",
      placeholder: "Info@Example.com",
    },
    {
      title: "Phone",
      name: "phone",
      placeholder: "(123)-456-7890",
    },
    {
      title: "Degree/Certifications",
      name: "degree",
      placeholder: "lorem lipsum/ year/ institute/ year of completion/ grade",
    },
    {
      title: "Other Education",
      name: "otherEducation",
      placeholder: "other edu",
    },
    {
      title: "Skills",
      name: "skills",
      placeholder: "skills",
    },
  ],
  about:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};
export const EDIT_PROFILE_DETAILS = {
  userProfile: "",
  userName: "",
  contactDetails: [
    {
      title: "First Name",
      name: "first_name",
      placeholder: "first name",
      required: true,
    },
    {
      title: "Middle Initial",
      name: "middle_name",
      placeholder: "middle name",
    },
    {
      title: "Last Name",
      name: "last_name",
      placeholder: "last name",
      required: true,
    },
    {
      title: "Username",
      name: "username",
      placeholder: "first name",
    },
    {
      title: "Date Of Birth",
      name: "dob",
      placeHolder: "2000-03-10",
      required: true,
    },
    {
      title: "Gender",
      name: "gender",
      placeholder: "gender",
      required: true,
    },
    {
      title: "Country",
      name: "country",
      placeholder: "country",
      required: true,
    },
    {
      title: "State",
      name: "state",
      placeholder: "state",
      required: true,
    },
    {
      title: "City",
      name: "city",
      placeholder: "city",
      required: true,
    },
    {
      title: "Zip Code",
      name: "zip_code",
      placeholder: "123456",
      required: true,
    },
    {
      title: "Ethnicity",
      name: "ethnicity",
      placeholder: "ethnicity",
      required: true,
    },
    {
      title: "Location",
      name: "address",
      placeholder: "4017 summer street",
    },
    {
      title: "Skills",
      name: "skills",
      placeholder: "skills",
    },
    {
      title: "Experience",
      name: "experience_level",
      placeHolder: "senior",
      required: true,
    },
    {
      title: "About",
      name: "about",
      placeholder: "about",
      required: true,
    },
  ],
  about:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};

export const CHANGE_PASSWORD = [
  {
    label: "Current Password",
    name: "currentPass",
    placeholder: "************************************",
  },
  {
    label: "New Password",
    name: "newPass",
    placeholder: "************************************",
  },
  {
    label: "Confirm Your Password",
    name: "confirmPass",
    placeholder: "************************************",
  },
];

export const PROFILE_SETTINGS = [
  {
    title: "Notification Settings",
    placeHolder: "Manage Alert For The Jobs",
    name: "notification",
    buttonLable: "Manage Setting",
    link: "settings/change-notification",
  },
  {
    title: "Email",
    placeHolder: "info@Example.com",
    name: "email",
    buttonLable: "Change Email",
    link: "settings/change-email",
  },
  {
    title: "Password",
    placeHolder: "Update Password",
    name: "password",
    buttonLable: "Change Password",
    link: "/applicant/settings/change-password",
  },
  {
    title: "Phone Number",
    placeHolder: "none",
    name: "phone",
    buttonLable: "Change Phone",
    link: "settings/add-phone",
  },
  {
    title: "Profile",
    placeHolder: "profile one",
    name: "profile",
    buttonLable: "Edit Profile",
    link: "/applicant/profile/edit-profile",
  },
  {
    title: "Manage Privacy Policy",
    placeHolder: "You Can Manage What To Show",
    name: "manage_privacy",
    buttonLable: "Manage Privacy",
    link: "/applicant/settings/manage-privacy",
  },
  {
    title: "De-Activate Account",
    placeHolder: "Are You Sure You Want To Deactivate Your Account?",
    name: "deactivate",
    buttonLable: "Confirm",
  },
  {
    title: "Privacy Settings",
    placeHolder: "Hide and Show your contact details and following list display",
    name: "privacy",
    buttonLable: "Manage Privacy",
    link: "/applicant/settings/privacy"
  },
  // {
  //   title: "Cancel Account",
  //   placeHolder: "Cancel Your Account Permanently",
  //   name: "cancel",
  //   buttonLable: "Confirm",
  //   link: "",
  // },
  {
    title: "Pause Account",
    placeHolder: "Are You Sure Want To Pause Account?",
    name: "pause",
    buttonLable: "Edit Profile",
    link: "",
  },
  {
    title: "Sign Out",
    placeHolder: "Do You Want To Sign Out Of Your Account?",
    name: "signout",
    buttonLable: "Sign Out",
    link: "/applicant/login",
  },
];

export const CHANGE_EMAIL = [
  {
    label: "new email address",
    name: "newEamail",
    placeholder: "example@company.com",
    required: true
  },
  {
    label: "current password",
    name: "currentPassword",
    placeholder: "***********",
        required: true
  },
];
export const ADD_NUMBER = [
  {
    label: "Add Phone number",
    name: "phone",
    placeholder: "United State (1)",
  },
  {
    label: "Password",
    name: "currentPassword",
    placeholder: "000-111-222-3",
  },
];

export const ADD_NUMBER_VERIFICATIONS = {
  logo: "/assets/images/bootsplash_logo.png",
  title: "Email Verification",
  form: [
    {
      name: "verification",
      names: "Verification Code*",
      placeHolder: "123456789",
    },
  ],
};
