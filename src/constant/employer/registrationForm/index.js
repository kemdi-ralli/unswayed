export const BASIC_REGISTRATION = {
  logo: "/assets/images/bootsplash_logo.png",
  title: "Company Registration",
  form: [
    {
      label: "Phone Number",
      name: "phone",
      placeHolder: "+1",
      required: true,
    },
    {
      label: "Country",
      name: "country",
      type: "dropdown",
      required: true,
    },
    {
      label: "Location",
      name: "address",
      placeHolder: "Your Location (Optional)",
    },
    {
      label: "State",
      name: "state",
      type: "dropdown",
      required: true,
    },
    {
      label: "City",
      name: "city",
      type: "dropdown",
      required: true,
    },
    {
      label: "Zip Code",
      name: "zip_code",
      placeHolder: "Your Zip Code",
      required: true,
    },
  ],
};

export const COMPANY_REGISTRATION = {
  logo: "/assets/images/bootsplash_logo.png",
  title: "Company Information",
  form: [
    {
      label: "Company Name",
      name: "company_name",
      placeHolder: "Company Name",
      type: "text",
      required: true,
    },
    {
      label: "Company Size",
      name: "company_size",
      type: "number",
      placeHolder: "Number of Employees",
      type: "number",
      required: true,
    },
    {
      label: "Industry",
      name: "industry",
      placeHolder: "Industry Type",
      type: "text",
      required: true,
    },
    {
      label: "Company Type",
      name: "company_type",
      placeHolder: "Company Type",
      type: "text",
      required: true,
    },
    {
      label: "Founded",
      name: "founded",
      placeHolder: "Enter Founded Year",
      type: "number",
      required: true,
    },
    {
      label: "Website",
      name: "website",
      placeHolder: "Website URL",
      type: "text",
      required: true,
    },
    {
      label: "About",
      name: "about",
      placeHolder: "Describe Your Company",
      type: "text",
      required: true,
    },
  ],
};
export const FINAL_REGISTRATION = {
  logo: "/assets/images/bootsplash_logo.png",
  title: "Company Registration",
  form: [
    {
      label: "Email Address",
      name: "email",
      type: "email",
      placeHolder: "Enter Email",
      required: true,
    },
    {
      label: "Username",
      name: "username",
      placeHolder: "Enter Username",
      required: true,
    },
    {
      label: "Password",
      name: "password",
      placeHolder: "**********",
      required: true,
    },
    {
      label: "Confirm Password",
      name: "password_confirmation",
      placeHolder: "**********",
      required: true,
    },
  ],
};

export const EMPLOYER_EMAIL_VERIFICATIONS = {
  logo: "/assets/images/bootsplash_logo.png",
  title: "Email Verification",
  description:
    "Please Check Your Email (Junk/SPAM) For The OTP Verification Code.",
  form: [
    {
      name: "verification",
      names: "Verification Code",
      placeHolder: "Enter your OTP",
    },
  ],
};
