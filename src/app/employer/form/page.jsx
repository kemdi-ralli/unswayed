"use client";
import React, { useEffect, useState } from "react";
import { Wizard } from "react-use-wizard";
import { useRouter } from "next/navigation";

import BasicInfo from "@/components/applicantForm/BasicInfo";
import EducationInfo from "@/components/applicantForm/EducationInfo";
import RegistrationInfo from "@/components/applicantForm/RegistrationInfo";
import {
  BASIC_REGISTRATION,
  COMPANY_REGISTRATION,
  FINAL_REGISTRATION,
} from "@/constant/employer/registrationForm";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  CITIES,
  COUNTRIES,
  EMPLOYER_REGISTRATION,
  STATES,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import Cookie from "js-cookie";
import EmployerRegistrationInfo from "@/components/employer/employerForm/EmployerRegistrationInfo";

const Page = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [errors, setErrors] = useState();
  const [apiErrors, setApiErrors] = useState({});
  const [dropdownStates, setDropdownStates] = useState({
    country: "",
    state: "",
    city: "",
  });
 const [agreeTerms, setAgreeTerms] = useState(false);
  const handleDropdownChange = (key, value) => {
    setDropdownStates((prevState) => {
      let updatedState = { ...prevState, [key]: value };

      if (key === "country") {
        updatedState = {
          ...updatedState,
          state: "",
          city: ""
        };
        setStates([]);
        setCities([]);
      }

      if (key === "state") {
        updatedState = {
          ...updatedState,
          city: ""
        };
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
  const [formData, setFormData] = useState({
    basicInfo: {},
    educationInfo: {},
    registrationInfo: {},
  });

  const router = useRouter();

  const handleFieldChange = (step, fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: {
        ...prevData[step],
        [fieldName]: value,
      },
    }));
  };
  useEffect(() => {
    const getCountries = async () => {
      try {
        const response = await apiInstance?.get(COUNTRIES);
        setCountries(response?.data?.data?.countries || []);
      } catch (error) {
        setErrors(error?.response?.data?.message || "Failed to load countries");
      }
    };
    getCountries();
  }, []);

  useEffect(() => {
    if (dropdownStates?.country) {
      const getStates = async (countryId) => {
        const US_STATES = [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ];

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
        try {
          const response = await apiInstance?.get(`${STATES}/${countryId}`);
          if (countryId === 233) {
            const allStates = [
              ...US_STATES,
              ...US_INHABITED_TERRITORIES,
              ...US_UNINHABITED_TERRITORIES,
            ].map((name) => ({ id: name, name }));
            setStates(allStates);
            return;
          }
          setStates(response?.data?.data?.states || []);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load states");
        }
      };
      getStates(dropdownStates?.country);
    }
  }, [dropdownStates?.country]);

  useEffect(() => {
    if (dropdownStates?.state) {
      const getCities = async (stateId) => {
        try {
          const response = await apiInstance?.get(`${CITIES}/${stateId}`);
          setCities(response?.data?.data?.cities || []);
        } catch (error) {
          setErrors(error?.response?.data?.message || "Failed to load cities");
        }
      };
      getCities(dropdownStates?.state);
    }
  }, [dropdownStates?.state]);

  const handleFinalSubmit = async () => {
    const fullFormData = {
      ...formData.basicInfo,
      ...formData.educationInfo,
      ...formData.registrationInfo,
    };

    try {
      const formDataToSubmit = new FormData();
      Object.entries(fullFormData).forEach(([key, value]) => {
        if (value) formDataToSubmit.append(key, value);
      });

      const response = await apiInstance.post(
        EMPLOYER_REGISTRATION,
        formDataToSubmit,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response?.data?.status === "success") {
        Cookie.set("token", response?.data?.data?.token);
        Cookie.set("isVerified", response?.data?.data?.is_verified);
        Cookie.set("userType", "employer");
        Toast("success", response?.data?.message);
        router.push("/employer/form/emailVerification");
      }
    } catch (error) {
      const errors = error.response?.data?.errors || {};
      setApiErrors(errors);
      Object.values(errors).forEach((msg) => {
        Toast("error", msg);
      });
    };
  }

    return (
      <Wizard>
        <EmployerRegistrationInfo
          data={FINAL_REGISTRATION}
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
          data={BASIC_REGISTRATION}
          formData={formData.basicInfo}
          onFieldChange={(field, value) =>
            handleFieldChange("basicInfo", field, value)
          }
          countries={countries}
          states={states}
          cities={cities}
          dropdownStates={dropdownStates}
          handleDropdownChange={handleDropdownChange}
          errors={apiErrors}
        />
        <EducationInfo
          data={COMPANY_REGISTRATION}
          formData={formData.educationInfo}
          onFieldChange={(field, value) =>
            handleFieldChange("educationInfo", field, value)
          }
          onSubmit={handleFinalSubmit}
        />
      </Wizard>
    );
  };

  export default Page;
