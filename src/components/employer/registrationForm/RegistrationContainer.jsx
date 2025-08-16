"use client";
import React, { useState } from "react";
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
import { EMPLOYER_REGISTRATION } from "@/services/apiService/apiEndPoints";

const RegistrationContainer = () => {
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

  const handleFinalSubmit = async () => {
    const fullFormData = {
      ...formData.basicInfo,
      ...formData.educationInfo,
      ...formData.registrationInfo,
    };
    console.log("Payload being sent:", fullFormData);


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

      console.log("API Response:", response.data);
      if (response?.data?.status === "success") {
        alert(response?.data?.message);
        router.push("/employer/form/emailVerification");
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <Wizard>
      <BasicInfo
        data={BASIC_REGISTRATION}
        formData={formData.basicInfo}
        onFieldChange={(field, value) =>
          handleFieldChange("basicInfo", field, value)
        }
      />
      <EducationInfo
        data={COMPANY_REGISTRATION}
        formData={formData.educationInfo}
        onFieldChange={(field, value) =>
          handleFieldChange("educationInfo", field, value)
        }
      />
      <RegistrationInfo
        data={FINAL_REGISTRATION}
        formData={formData.registrationInfo}
        onFieldChange={(field, value) =>
          handleFieldChange("registrationInfo", field, value)
        }
        onSubmit={handleFinalSubmit}
      />
    </Wizard>
  );
};

export default RegistrationContainer;
