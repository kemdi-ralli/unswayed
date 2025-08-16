"use client";
import { useState } from "react";
import RalliResumeContainer from "@/components/applicantForm/ralliResume/RalliResumeContainer";
import Container from "@/components/common/Container";

const Page = ({params}) => {
  const id = params?.id
  const [formData, setFormData] = useState();
  const handleNextStepData = (step, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: data,
    }));
  };
  return (
      <Container sx={{ flex: 1 }}>
          <RalliResumeContainer handleNextStepData={handleNextStepData} id={id}/>
      </Container>
  );
};

export default Page;
