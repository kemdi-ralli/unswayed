"use client";
import { useState } from "react";
import RalliResumeContainer from "@/components/applicantForm/ralliResume/RalliResumeContainer";
import Container from "@/components/common/Container";
import { setCvs } from "@/redux/slices/applicantCv";

const Page = () => {
  const [formData, setFormData] = useState();
  const handleNextStepData = (step, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: data,
    }));
  };
  return (
      <Container sx={{ flex: 1 }}>
          <RalliResumeContainer handleNextStepData={handleNextStepData}/>
      </Container>
  );
};

export default Page;
