export const APPLICANT_LOGIN_DATA = {
  loginType: "Applicant Login",
  logo: "/assets/images/Ralli_Dark_Logo.png",
  title: "A Place to share knowledge and better understand the world",
  // paragraph: 'By Continuing You Indicate That You Agree To RALLI <span style="font-size: 16px; line-height: 22px; font-weight: 400; color: blue;">Terms Of Service </span> And <span style="font-size: 16px; line-height: 22px; font-weight: 400; color: blue;">Privacy Policy</span>.',
  paragraph: `By Continuing You Indicate That You Agree To RALLI 
<a href="/terms-and-conditions" style="color: blue; text-decoration: underline;">Terms Of Service</a> 
And 
<a href="/privacy-and-policy" style="color: blue; text-decoration: underline;">Privacy Policy</a>.`,
  loginWidth: [
    //     {
    //     img: '/assets/images/google.png',
    //     label: 'Continue With Google',
    //     path: 'www.google.com'

    // }, {
    //     img: '/assets/images/facebook.png',
    //     label: 'Continue With Facebook',
    //     path: 'www.facebook.com'

    // },
    {
      img: "/assets/images/createaccount.png",
      label: "Create Account",
      path: "/applicant/form",
    },
  ],
  subTitle: "Login",
  inputType: [
    {
      label: "Email",
      placeholder: "Info@Xyzgmail.com",
    },
    {
      label: "Password",
      placeholder: "Your password",
    },
  ],
  forgetPasswordLable: "Forget Password?",
  buttonLable: "Login",
  continueWith: {
    label: "Continue With Employer",
    link: "/employer/login",
  },
};
export const EMPLOYER_LOGIN_DATA = {
  loginType: "Employer Login",
  logo: "/assets/images/Ralli_Dark_Logo.png",
  title: "A Place to share knowledge and better understand the world",
  paragraph: `By Continuing You Indicate That You Agree To RALLI 
<a href="/terms-and-conditions" style="color: blue; text-decoration: underline;">Terms Of Service</a> 
And 
<a href="/privacy-and-policy" style="color: blue; text-decoration: underline;">Privacy Policy</a>.`,

  loginWidth: [
    //     {
    //     img: '/assets/images/google.png',
    //     label: 'Continue With Google',
    //     path: 'www.google.com'

    // }, {
    //     img: '/assets/images/facebook.png',
    //     label: 'Continue With Facebook',
    //     path: 'www.facebook.com'

    // },
    {
      img: "/assets/images/createaccount.png",
      label: "Create Account",
      path: "/employer/form",
    },
  ],
  subTitle: "Login",
  inputType: [
    {
      label: "Email",
      placeholder: "Info@Xyzgmail.com",
    },
    {
      label: "Password",
      placeholder: "Your password",
    },
  ],
  forgetPasswordLable: "Forget Password?",
  buttonLable: "Login",
  continueWith: {
    label: "Continue With Applicant",
    link: "/applicant/login",
  },
};
