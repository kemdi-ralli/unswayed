export const EDU_INFO_CRUD = {
  form: [
    {
      name: "institution_name",
      title: "School Name",
      placeHolder: "Oxford University",
      type: "field",
    },
    {
      name: "degree",
      title: "Degree",
      placeHolder: "Bachelors",
      type: "field",
      required: true,
    },
    {
      name: "field_of_study",
      title: "Field Of Study",
      placeHolder: "Computer Science",
      type: "field",
    },
    {
      name: "grade",
      title: "Grade",
      placeHolder: "A/B/C",
      type: "field",
    },
    {
      name: "start_date",
      title: "Start Date",
      placeHolder: "From Date",
    },
    {
      name: "end_date",
      title: "End Date",
      placeHolder: "End Date",
    },
    {
      name: "media",
      title: "Degree/Certifications",
      placeHolder: "Upload Degree/Certifications",
    },
    {
      name: "is_continue",
      // title: "Time Period",
      placeHolder: "time period",
    },
  ],
};
export const EDU_INFO_BY_RALLI = {
  pages: "Build Your Resume (1 Of 5)",
  title: "Do You Want To Add Any Education Details",

  form: [
    {
      name: "institution_name",
      title: "School Name",
      placeHolder: "Oxford University",
      type: "field",
    },
    {
      name: "degree",
      title: "Degree",
      placeHolder: "Bachelors",
      type: "field",
    },
    {
      name: "field_of_study",
      title: "Field Of Study",
      placeHolder: "Computer Science",
      type: "field",
    },
    {
      name: "grade",
      title: "Grade/GPA",
      placeHolder: "A/B/C",
      type: "field",
    },
    {
      name: "start_date",
      title: "Start Date",
      placeHolder: "From Date",
    },
    {
      name: "end_date",
      title: "End Date",
      placeHolder: "End Date",
    },
    {
      name: "is_continue",
      // title: "Time Period",
      placeHolder: "time period",
    },
  ],
};
export const ADD_A_RECENT = {
  pages: "Build Your Resume (2 Of 5)",
  title: "Do You Want To Add A Recent Job?",

  form: [
    {
      name: "company",
      title: "Company",
      placeHolder: "Company Name",
      type: "field",
    },
    {
      name: "title",
      title: "Job Title",
      placeHolder: "Title Of Your Job",
      type: "field",
    },
    {
      name: "type",
      title: "Job Type",
      placeHolder: "Full Time",
      type: "field",
    },
    {
      name: "years_of_experience",
      title: "Years of experience",
      placeHolder: "experience",
      type: "dropdown",
    },
    {
      name: "start_date",
      title: "Start Date",
      placeHolder: "From Date",
      type: "date-picker",
    },
    {
      name: "end_date",
      title: "End Date",
      placeHolder: "End Date",
    },
    {
      name: "country",
      title: "Country",
      placeHolder: "Country",
      type: "field",
    },
    {
      name: "state",
      title: "State",
      placeHolder: "State",
      type: "field",
    },
    {
      name: "city",
      title: "City",
      placeHolder: "City",
      type: "field",
    },
    {
      name: "is_continue",
      // title: "Currently Employed",
      placeHolder: "time period",
    },
    {
      name: "description",
      title: "Description",
      placeHolder: "Describe What You Do",
      type: "field",
    },
  ],
};
export const ADD_A_CERTIFICATIONS = {
  pages: "Build Your Resume (3 Of 5)",
  title: "Do You Want To Add Certification?",

  form: [
    {
      name: "institution_name",
      title: "School Name",
      placeHolder: "School Name",
      type: "field",
    },
    {
      name: "title",
      title: "Certificate Title",
      placeHolder: "Certifcation Name",
      type: "field",
    },
    {
      name: "country",
      title: "Country",
      placeHolder: "Country",
      type: "field",
    },
    {
      name: "state",
      title: "State",
      placeHolder: "State",
      type: "field",
    },
    {
      name: "city",
      title: "City",
      placeHolder: "City",
      type: "field",
    },
    {
      name: "start_date",
      title: "Start Date",
      placeHolder: "From Date",
    },
    {
      name: "end_date",
      title: "End Date",
      placeHolder: "End Date",
    },
    {
      name: "is_continue",
      // title: "Currently Enrolled",
      placeHolder: "Currently Enrolled",
    },

    {
      name: "description",
      title: "Description",
      placeHolder: "What Did You Learn?",
      type: "field",
    },
  ],
};
export const PROJECT_WORKED = {
  pages: "Build Your Resume (4 Of 5)",
  title: "What Poject You Have Worked On ?",

  form: [
    {
      name: "name",
      title: "Project Name",
      placeHolder: "Enter Name",
      type: "text",
    },
    {
      name: "description",
      title: "Description",
      placeHolder: "Define Your Project",
    },
  ],
};
export const SEARCHABLE_RALLI = {
  pages: "Build Your Resume (4 Of 4)",
  title: "want to allow employers to you on ralli??",

  boxData: [
    {
      title: "searchable on Ralli",
      para: "Lorem Ipsum is simply dummy text of printing & typesetting industry. Lorem Ipsum has been the industry sxzc standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled. Lorem Ipsum is simply dummy text of printing & typesetting industry. Lorem Ipsum has been the industry sxzc standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled lorem lipsum dolor sir amir dummy text.",
    },
    {
      title: "not searchable on Ralli",
      para: "Lorem Ipsum is simply dummy text of printing & typesetting industry. Lorem Ipsum has been the industry sxzc standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled. Lorem Ipsum is simply dummy text of printing & typesetting industry. Lorem Ipsum has been the industry sxzc standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled lorem lipsum dolor sir amir dummy text.",
    },
  ],
};
export const ADD_SKILLS = {
  pages: "Build Your Resume (5 Of 5)",
  title: "Feel Free to add these skills to get started.",
  para: "We Recommend Adding At Least 6 Skills",

  skillsBox: {
    title: "do you want to add any of these skills?",
    items: [
      {
        placeHolder: "Customer Service",
      },
      {
        placeHolder: "Organization Skills",
      },
      {
        placeHolder: "Microsoft Office",
      },
      {
        placeHolder: "Cashier",
      },
      {
        placeHolder: "UI/UX Designing",
      },
      {
        placeHolder: "Marketing",
      },
      {
        placeHolder: "Caregiving ",
      },
      {
        placeHolder: "Data Analytics",
      },
      {
        placeHolder: "Data",
      },
      {
        placeHolder: "Leadership",
      },
      {
        placeHolder: "Maintenance",
      },
      {
        placeHolder: "Driving",
      },
      {
        placeHolder: "Healthcare",
      },
      {
        placeHolder: "Contracts",
      },
      {
        placeHolder: "Legal",
      },
      {
        placeHolder: "Automotive",
      },
      {
        placeHolder: "Aviation",
      },
      {
        placeHolder: "Technical",
      },
      {
        placeHolder: "Negotiation",
      },
      {
        placeHolder: "Vendor Management",
      },
      {
        placeHolder: "Service",
      },
      {
        placeHolder: "Programming",
      },
      {
        placeHolder: "Sales",
      },
      {
        placeHolder: "Productions",
      },
      {
        placeHolder: "Building",
      },
      {
        placeHolder: "Performance",
      },
      {
        placeHolder: "Teaching",
      },
      {
        placeHolder: "Accounting",
      },
      {
        placeHolder: "Logistics",
      },
      {
        placeHolder: "Compliance",
      },
      {
        placeHolder: "Litigation",
      },
      {
        placeHolder: "Graphic Design ",
      },
    ],
  },
};
