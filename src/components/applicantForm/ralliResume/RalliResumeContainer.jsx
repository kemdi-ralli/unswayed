"use client";
import React, { useEffect, useState } from "react";
import {
  ADD_A_CERTIFICATIONS,
  ADD_A_RECENT,
  ADD_SKILLS,
  EDU_INFO_BY_RALLI,
  PROJECT_WORKED,
} from "@/constant/ralliResume";
import { Wizard } from "react-use-wizard";
import EducationRalliInfo from "./EducationRalliInfo";
import AddRecentJobs from "./AddRecentJobs";
import AddSkills from "./AddSkills";
import ProjectWorked from "./ProjectWorked";
import Certifications from "./Certifications";

import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  APPLICANT_BUILD_RESUME,
  APPLICANT_REBUILD_RESUME,
  CITIES,
  CITIES_STATES_NAME,
  COUNTRIES,
  COUNTRY_STATES_NAME,
  STATES,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setEditMode } from "@/redux/slices/editSlice";
import { fetchProfile } from "@/helper/profileApiHelper";

const RalliResumeContainer = ({ id }) => {
  const [profile, setProfile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wizardData, setWizardData] = useState({
    educationDetails: [{}],
    recentJobs: [{}],
    certifications: [{}],
    projects: [{}],
    skills: [],
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [selectedCertifcateCountry, setSelectedCertifcateCountry] =
    useState(null);
  const [selectedCertifcateState, setSelectedCertifcateState] = useState(null);
  const [selectedCertifcateCity, setSelectedCertifcateCity] = useState(null);

  const [dropdownStates, setDropdownStates] = useState({
    state: "",
    city: "",
  });

  const [totalExperience, setTotalExperience] = useState([
    { id: 1, name: "1 year" },
    { id: 2, name: "2 years" },
    { id: 3, name: "3 years" },
    { id: 4, name: "4 years" },
    { id: 5, name: "5 years" },
    { id: 6, name: "6 years" },
    { id: 7, name: "7 years" },
    { id: 8, name: "8 years" },
    { id: 9, name: "9 years" },
    { id: 10, name: "10+ years" },
  ]);

  const getEditResumes = useSelector(
    (state) => state?.applicantAttachedCv?.attachedCvs
  );
  console.log(getEditResumes, "GET REUMSEUM EDIT");
  const isEditing = useSelector((state) => state?.getEdit?.isEditing);
  const handleDataUpdate = (key, newData) => {
    setWizardData((prev) => ({ ...prev, [key]: newData }));
  };
  const router = useRouter();
  const dispatch = useDispatch();

  console.log(selectedCountry, "seleltnc count");
  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await apiInstance?.get(COUNTRIES);
        setCountries(response?.data?.data?.countries || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load countries");
      }
    };
    getStates();
  }, []);
  useEffect(() => {
    const getStates = async () => {
      try {
        const response = await apiInstance?.get(
          `${COUNTRY_STATES_NAME}/${selectedCountry}`
        );
        setStates(response?.data?.data?.states || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load countries");
      }
    };
    getStates();
  }, [selectedCountry]);

  useEffect(() => {
    const getCities = async () => {
      try {
        const response = await apiInstance?.get(
          `${CITIES_STATES_NAME}/${selectedState}`
        );
        setCities(response?.data?.data?.cities || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load countries");
      }
    };
    getCities();
  }, [selectedState]);
  const handleDropdownChange = (key, value) => {
    setDropdownStates((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  useEffect(() => {
    const loadProfile = async () => {
      const userProfile = await fetchProfile();
      setProfile(userProfile);
      if (!getEditResumes) {
        setWizardData((prev) => ({
          ...prev,
          educationDetails: userProfile?.educations?.map((edu) => ({
            grade: edu.grade,
            degree: edu.degree,
            end_date: edu.end_date,
            start_date: edu.start_date,
            field_of_study: edu.field_of_study,
            institution_name: edu.institution_name,
            is_continue: edu.is_continue ?? null,
          })) || [{}],
        }));
      }
    };

    loadProfile();
  }, []);

  const isEmptyObject = (obj) => {
    return (
      typeof obj === "object" &&
      obj !== null &&
      Object.values(obj).every(
        (val) =>
          val === "" ||
          val === null ||
          val === undefined ||
          (typeof val === "object" && Object.keys(val).length === 0)
      )
    );
  };

  // const ConvertArray = (data) => {
  //   const cleanedData = {};

  //   let allFieldsEmpty = true;

  //   for (const [key, value] of Object.entries(data)) {
  //     if (Array.isArray(value)) {
  //       const filteredArray = value.filter((item) => {
  //         if (typeof item === "object") return !isEmptyObject(item);
  //         return !!item;
  //       });

  //       cleanedData[key] = filteredArray;

  //       if (filteredArray.length > 0) {
  //         allFieldsEmpty = false;
  //       }
  //     } else {
  //       cleanedData[key] = value;
  //     }
  //   }

  //   return { cleanedData, allFieldsEmpty };
  // };
  const ConvertArray = (data) => {
    const cleanedData = {};
    let allFieldsEmpty = true;

    for (const [key, value] of Object.entries(data)) {
      if (Array.isArray(value)) {
        const filteredArray = value
          .map((item) => {
            if (typeof item === "object" && item !== null) {
              const newItem = { ...item };

              const isValidDate = (date) =>
                typeof date === "string" && /^\d{2}\/\d{4}$/.test(date);

              if (!isValidDate(newItem.start_date)) newItem.start_date = "";
              if (!isValidDate(newItem.end_date)) newItem.end_date = "";

              newItem.state = newItem.state || "";
              newItem.city = newItem.city || "";

              return newItem;
            }
            return item;
          })
          .filter((item) => !isEmptyObject(item));

        cleanedData[key] = filteredArray;

        if (filteredArray.length > 0) {
          allFieldsEmpty = false;
        }
      } else {
        cleanedData[key] = value;
      }
    }

    return { cleanedData, allFieldsEmpty };
  };

  const handleSubmit = async (finalData) => {
    const { cleanedData, allFieldsEmpty } = ConvertArray(finalData);

    if (allFieldsEmpty) {
      Toast("error", "Please add some details to build your Ralli resume.");
      return;
    }

    setIsSubmitting(true);

    try {
      let response;

      if (isEditing) {
        response = await apiInstance.post(
          `${APPLICANT_REBUILD_RESUME}/${getEditResumes?.id}`,
          cleanedData
        );
      } else {
        response = await apiInstance.post(APPLICANT_BUILD_RESUME, cleanedData);
      }

      if (response?.data?.status === "success") {
        Toast("success", response?.data?.message);
        dispatch(setEditMode(false));
        router.push(`/applicant/career-areas/job-details/${id}/apply`);
      }

      console.log("Resume successfully built:", response.data);
    } catch (error) {
      console.error("Error building resume:", error);
      Toast("error", error?.response?.data?.message || "Failed to apply");
      dispatch(setEditMode(false));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (getEditResumes?.meta_data) {
      console.log(getEditResumes?.meta_data, "metaaa data");
      setWizardData({
        educationDetails: getEditResumes?.meta_data?.education?.map((edu) => ({
          grade: edu.grade,
          degree: edu.degree,
          end_date: edu.end_date,
          start_date: edu.start_date,
          field_of_study: edu.field_of_study,
          institution_name: edu.institution_name,
          is_continue: edu.is_continue ?? null,
        })) || [{}],

        recentJobs: getEditResumes?.meta_data?.experiences?.map((exp) => ({
          city: exp.city,
          type: exp.type,
          state: exp.state,
          title: exp.title,
          company: exp.company,
          end_date: exp.end_date,
          years_of_experience: exp.years_of_experience,
          location: exp.location,
          start_date: exp.start_date,
          description: exp.description,
        })) || [{}],

        certifications: getEditResumes?.meta_data?.certifications?.map(
          (cert) => ({
            city: cert.city,
            state: cert.state,
            title: cert.title,
            end_date: cert.end_date,
            location: cert.location,
            start_date: cert.start_date,
            description: cert.description,
            institution_name: cert.institution_name,
          })
        ) || [{}],

        projects: getEditResumes?.meta_data?.projects?.map((proj) => ({
          name: proj.name,
          description: proj.description,
        })) || [{}],

        skills: getEditResumes?.meta_data?.skills || [],
      });
    }
  }, [getEditResumes]);

  return (
    <Wizard>
      <EducationRalliInfo
        data={EDU_INFO_BY_RALLI}
        onNext={(data) => handleDataUpdate("educationDetails", data)}
        educationDetails={wizardData.educationDetails}
      />
      <AddRecentJobs
        data={ADD_A_RECENT}
        onNext={(data) => handleDataUpdate("recentJobs", data)}
        recentJobs={wizardData.recentJobs}
        setSelectedCountry={setSelectedCountry}
        setSelectedState={setSelectedState}
        setSelectedCity={setSelectedCity}
        countries={countries}
        states={states}
        cities={cities}
        setStates={setStates}
        setCities={setCities}
        totalExperience={totalExperience}
      />
      <Certifications
        data={ADD_A_CERTIFICATIONS}
        onNext={(data) => handleDataUpdate("certifications", data)}
        certifications={wizardData.certifications}
        setSelectedCertifcateCountry={setSelectedCertifcateCountry}
        setSelectedCertifcateCity={setSelectedCertifcateCity}
        setSelectedCertifcateState={setSelectedCertifcateState}
        countries={countries}
        states={states}
        cities={cities}
        setStates={setStates}
        setCities={setCities}
      />
      <ProjectWorked
        data={PROJECT_WORKED}
        onNext={(data) => handleDataUpdate("projects", data)}
        projects={wizardData.projects}
      />
      <AddSkills
        data={ADD_SKILLS}
        onNext={(data) => handleDataUpdate("skills", data)}
        skill={wizardData.skills}
        handleSubmit={handleSubmit}
        wizardData={wizardData}
        isEditing={isEditing}
        loading={isSubmitting}
      />
    </Wizard>
  );
};

export default RalliResumeContainer;
