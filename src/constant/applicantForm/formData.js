export const BASIC_INFO = {
    logo: '/assets/images/logo-single.png',
    title : 'Basic Information',
    form : [
        {
            label: 'First Name',
            name:'first_name',
            placeHolder: 'First Name',
            required: true,
        },
        {
            label: 'Middle Initial',
            name:'middle_name',
            placeHolder: 'Middle Initial (Optional)'
        },
        {
            label: 'Last Name',
            name:'last_name',
            placeHolder: 'Your Name',
            required: true,
        },
        {
            label: 'Gender',
            name:'gender',
            placeHolder: 'Gender'
        },
        {
            label: 'Date Of Birth',
            name:'dob',
            placeHolder: 'Under 18, Not Allowed On Site',
            required: true,
            
        },
        {
            label: 'Race/Ethnicity',
            name:'ethnicity',
            placeHolder: ''
        },
        {
            label: 'Phone Number',
            name:'phone',
            placeHolder: '(123)-465-7990',
            required: true,
        },
        {
            label: 'Country',
            name:'country',
            placeHolder: 'Country',
            required: true,
        },
        {
            label: 'Current Address',
            name:'address',
            placeHolder: 'Your address',
            required: true,
        },
        {
            label: 'State',
            name:'state',
            placeHolder: 'State',
            required: true,
        },
        {
            label: 'City',
            name:'city',
            placeHolder: 'City',
            required: true,
        },
        
        
        {
            label: 'Zip Code',
            name:'zip_code',
            placeHolder: 'Zip code',
            required: true,
        },
        
        // {
        //     label: 'About',
        //     name:'about',
        //     placeHolder: 'About'
        // },

    ]
}
export const EDU_INFO = {
    logo: '/assets/images/bootsplash_logo.png',
    title : 'Education Information',
    form : [
        {
            label: 'Degree/Certifications Name',
            name:'degree',
            placeHolder:'Bachelors'
        },
        {
            label: 'Field of Study',
            name:'field_of_study',
            placeHolder:'Computer Science'
        },
        {
            label: 'School',
            name: 'institution_name',
            placeHolder: 'Enter Your School Name'
        },
        {
            label: 'Start Date',
            name: 'start_date',
            placeHolder: '01/2010'
        },
        {
            label: 'End Date',
            name: 'end_date',
            placeHolder: '01/2015'
        },
        {
            label: 'Grade/GPA',
            name: 'grade',
            placeHolder: 'A'
        },
        // {
        //     label: 'Degree/Certifications',
        //     name: 'media',
        //     placeHolder: 'Upload Degree/Certifications'
        // },
        {
            label: 'Skills',
            name: 'skills',
            placeHolder: 'Press Enter To Add Skills'
        },
        {
            label: 'Experience',
            name:'experience_level',
            placeHolder: 'senior'
        },
    ]
}
export const REGISTRATION_INFO = {
    logo: '/assets/images/logo-single.png',
    title : 'Registration',
    form : [
        {
            label: 'Email',
            name:'email',
            type:'email',
            placeHolder: 'info@example.com',
            required: true,
        },
        {
            label: 'Username',
            name:'username',
            placeHolder: 'Alber John',
            required: true,
        },
        {
            label: 'Password',
            name:'password',
            placeHolder: '**********'
        },
        {
            label: 'Confirm Password',
            name:'password_confirmation',
            placeHolder: '**********',
            required: true,
        },
    ]
}
export const EMAIL_VERIFICATIONS = {
    logo: '/assets/images/bootsplash_logo.png',
    title : 'Email Verification',
    description: 'Please Check Your Email (Junk/SPAM) For The OTP Verification Code.',
    form : [
        {
            name:'verification',
            names: 'Verification Code',
            placeHolder: 'Enter your OTP',
            required: true,
            
        }
    ]
}
export const EMAIL_CORRECTION = {
    logo: '/assets/images/bootsplash_logo.png',
    title : 'Correction Email',
    form : [
        {
            name: 'email',
            names: 'Enter New Email',
            placeHolder: 'Enter New Email',
            required: true,

        }
    ]
}