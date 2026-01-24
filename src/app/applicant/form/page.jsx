"use client";

import React, { useEffect, useState } from "react";
import { Wizard } from "react-use-wizard";
import { useRouter } from "next/navigation";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  APPLICANT_REGISTRATION,
  CITIES,
  CITIES_STATES_NAME,
  COUNTRIES,
  ETHNICITIES,
  GENDERS,
  STATES,
} from "@/services/apiService/apiEndPoints";
import {
  BASIC_INFO,
  EDU_INFO,
  REGISTRATION_INFO,
} from "@/constant/applicantForm/formData";
import BasicInfo from "@/components/applicantForm/BasicInfo";
import ApplicantEducationInfo from "@/components/applicantForm/ApplicantEducationInfo";
import RegistrationInfo from "@/components/applicantForm/RegistrationInfo";
import { Toast } from "@/components/Toast/Toast";
import Cookie from "js-cookie";

const ApplicantForm = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [genders, setGenders] = useState([]);
  const [ethnicities, setEthnicities] = useState([]);
  const [apiErrors, setApiErrors] = useState({});
  const [errors, setErrors] = useState();
  const [isLoadingStates, setIsLoadingStates] = useState(false); // ADD THIS LINE

  const [experienceLevel, setExperienceLevel] = useState([
    { name: "Entry", id: "Entry" },
    { name: "Intermediate", id: "Intermediate" },
    { name: "Experienced", id: "Experienced" },
    { name: "Advanced", id: "Advanced" },
  ]);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [dropdownStates, setDropdownStates] = useState({
    country: "",
    state: "",
    city: "",
    gender: "",
    ethnicities: "",
    experienceLevel: "",
  });

  const [formData, setFormData] = useState({
    basicInfo: {},
    educationInfo: {
      educations: [
        {
          degree: "",
          field_of_study: "",
          institution_name: "",
          grade: "",
          start_date: "",
          end_date: "",
          media: "",
        },
      ],
      skills: [],
      experience_level: "",
    },
    registrationInfo: {},
  });

  const router = useRouter();

  /** Handle dropdowns (country/state/city chaining) */
  const handleDropdownChange = (key, value) => {
    setDropdownStates((prevState) => {
      let updatedState = { ...prevState, [key]: value };

      if (key === "country") {
        updatedState = { ...updatedState, state: "", city: "" };
        setStates([]);
        setCities([]);
      }

      if (key === "state") {
        updatedState = { ...updatedState, city: "" };
        setCities([]);
      }

      return updatedState;
    });

    setFormData((prevData) => ({
      ...prevData,
      basicInfo: {
        ...prevData.basicInfo,
        [key]: value,
      },
    }));
  };

  /** Generic field handler for each wizard step */
  const handleFieldChange = (step, fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [fieldName]: value,
      },
    }));
  };

  /** Fetch Countries */
  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await apiInstance.get(COUNTRIES);
        setCountries(response?.data?.data?.countries || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load countries");
      }
    };
    getCountries();
  }, []);

  /** Fetch Ethnicities */
  useEffect(() => {
    const getEthnicities = async () => {
      try {
        const response = await apiInstance.get(ETHNICITIES);
        setEthnicities(response?.data?.data?.Ethnicities || []);
      } catch (error) {
        setErrors(
          error?.response?.data?.message || "Failed to load ethnicities"
        );
      }
    };
    getEthnicities();
  }, []);

  /** Fetch States */
  useEffect(() => {
    const US_INHABITED_TERRITORIES = [
      "American Samoa",
      "Guam",
      "Northern Mariana Islands",
      "Puerto Rico",
      "U.S. Virgin Islands",
    ];

    const US_UNINHABITED_TERRITORIES = [
      "Baker Island",
      "Howland Island",
      "Jarvis Island",
      "Johnston Atoll",
      "Kingman Reef",
      "Midway Atoll",
      "Navassa Island",
      "Palmyra Atoll",
      "Wake Island",
    ];

    if (dropdownStates.country) {
      const getStates = async (countryId) => {
        setIsLoadingStates(true);
        try {
          const response = await apiInstance.get(`${STATES}/${countryId}`);
          let fetchedStates = response?.data?.data?.states || [];

          if (countryId === 233) {
            // Filter out territories from the main states list
            const territoryNames = [...US_INHABITED_TERRITORIES, ...US_UNINHABITED_TERRITORIES];
            const mainStates = fetchedStates.filter(
              state => !territoryNames.includes(state.name)
            );
            
            // Add territories at the end
            const territories = [
              ...US_INHABITED_TERRITORIES,
              ...US_UNINHABITED_TERRITORIES,
            ].map((name) => ({ id: name, name }));
            
            fetchedStates = [...mainStates, ...territories];
          }

          setStates(fetchedStates);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load states");
          setStates([]);
        } finally {
          setIsLoadingStates(false);
        }
      };
      
      getStates(dropdownStates.country);
    } else {
      setStates([]);
      setIsLoadingStates(false);
    }
  }, [dropdownStates.country]);

  /** Fetch Cities */
  useEffect(() => {
    if (dropdownStates.state) {
      const getCities = async (stateId) => {
        try {
          // Check if stateId is a US inhabited territory (string name)
          const isTerritory = typeof stateId === 'string' && US_INHABITED_TERRITORIES.includes(stateId);
          
          const response = isTerritory 
            ? await apiInstance.get(`${CITIES_STATES_NAME}/${stateId}`)
            : await apiInstance.get(`${CITIES}/${stateId}`);
            
          setCities(response?.data?.data?.cities || []);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load cities");
          setCities([]);
        }
      };
      getCities(dropdownStates.state);
    } else {
      setCities([]);
    }
  }, [dropdownStates.state]);

  /** Fetch Genders */
  useEffect(() => {
    const getGenders = async () => {
      try {
        const response = await apiInstance.get(GENDERS);
        setGenders(response?.data?.data?.genders || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load genders");
      }
    };
    getGenders();
  }, []);

  /** Handle final submit */
  const handleFinalSubmit = async () => {
    const { basicInfo, educationInfo, registrationInfo } = formData;

    const formattedEducationData = educationInfo.educations.map(
      (education) => ({
        degree: education.degree,
        field_of_study: education.field_of_study,
        institution_name: education.institution_name,
        grade: education.grade,
        start_date: education.start_date,
        end_date: education.end_date,
        media: education.media,
      })
    );

    const finalDataToSubmit = {
      ...basicInfo,
      ...registrationInfo,
      educations: formattedEducationData,
      skills: Array.isArray(educationInfo.skills)
        ? educationInfo.skills
        : educationInfo.skills?.split(" "),
      experience_level: educationInfo.experience_level || "",
    };

    console.log(finalDataToSubmit, "finaldata applicant");

    try {
      const formDataToSubmit = new FormData();

      // Append basic fields
      Object.entries(finalDataToSubmit).forEach(([key, value]) => {
        if (!Array.isArray(value)) {
          formDataToSubmit.append(key, value);
        }
      });

      // Append education data
      finalDataToSubmit.educations.forEach((education, index) => {
        Object.entries(education).forEach(([field, value]) => {
          if (field === "media" && value instanceof File) {
            formDataToSubmit.append(`educations[${index}][${field}]`, value);
          } else {
            formDataToSubmit.append(`educations[${index}][${field}]`, value);
          }
        });
      });

      // Append skills
      finalDataToSubmit.skills.forEach((skill, index) => {
        formDataToSubmit.append(`skills[${index}]`, skill);
      });

      const response = await apiInstance.post(
        APPLICANT_REGISTRATION,
        formDataToSubmit,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === "success") {
        Cookie.set("token", response.data.data.token);
        Cookie.set("isVerified", response.data.data.is_verified);
        Cookie.set("userType", "applicant");
        router.push("/applicant/form/emailVerification");
        Toast("success", response.data.message);
      }
    } catch (error) {
      const errors = error.response?.data?.errors || {};
      setApiErrors(errors);
      Object.values(errors).forEach((msg) => {
        Toast("error", msg);
      });
    }
  };

  const handleChangeExperience = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      educationInfo: {
        ...prevData.educationInfo,
        [name]: value,
      },
    }));
  };

  return (
    <Wizard>
      <RegistrationInfo
        data={REGISTRATION_INFO}
        formData={formData.registrationInfo}
        onFieldChange={(field, value) =>
          handleFieldChange("registrationInfo", field, value)
        }
        onSubmit={handleFinalSubmit}
        errors={apiErrors}
        agreeTerms={agreeTerms}
        setAgreeTerms={setAgreeTerms}
      />

      <BasicInfo
        data={BASIC_INFO}
        formData={formData.basicInfo}
        onFieldChange={(field, value) =>
          handleFieldChange("basicInfo", field, value)
        }
        countries={countries}
        states={states}
        cities={cities}
        genders={genders}
        ethnicities={ethnicities}
        dropdownStates={dropdownStates}
        handleDropdownChange={handleDropdownChange}
        errors={apiErrors}
      />

      <ApplicantEducationInfo
        data={EDU_INFO}
        formData={formData.educationInfo}
        experienceLevel={experienceLevel}
        onFieldChange={(field, value) =>
          handleFieldChange("educationInfo", field, value)
        }
        handleChangeExperience={handleChangeExperience}
        onSubmit={handleFinalSubmit}
        errors={apiErrors}
      />
    </Wizard>
  );
};

export default ApplicantForm;