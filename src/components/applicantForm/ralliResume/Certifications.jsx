"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useWizard } from "react-use-wizard";
import RalliButton from "@/components/button/RalliButton";
import { enhanceText } from "@/helper/aiEnhanceHelper";
import AddAnotherButton from "./AddAnotherButton";
import Header from "./Header";
import ButtonIndex from "./ButtonIndex";
import FormField from "./FormField";

const Certifications = ({
  data,
  onNext,
  certifications,
  states,
  cities,
  setSelectedCertifcateCountry,
  setSelectedCertifcateState,
  setSelectedCity,
  setCities,
  setStates,
}) => {
  const { nextStep, previousStep } = useWizard();
  const [certification, setCertification] = useState(certifications || []);
  const [enhanceAi, setEnhanceAi] = useState("");

  const sectionRefs = useRef([]);
  const formTopRef = useRef(null);

  useEffect(() => {
    if (certifications?.length > 0) {
      setEnhanceAi(certifications[0]?.description || "");
      setTimeout(() => {
        if (formTopRef.current) {
          const offset = 100;
          const top =
            formTopRef.current.getBoundingClientRect().top +
            window.pageYOffset -
            offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [certifications]);

  const handleEnhanceAi = async (index, description) => {
    try {
      const enhancedText = await enhanceText(description);
      setCertification((prev) =>
        prev.map((job, i) =>
          i === index ? { ...job, description: enhancedText } : job
        )
      );
    } catch (error) {
      console.error("Error enhancing description:", error);
    }
  };

  // const handleChange = (index, name, value) => {
  //   setCertification((prev) =>
  //     prev.map((form, i) => (i === index ? { ...form, [name]: value } : form))
  //   );
  // };
  const handleChange = (index, name, value) => {
    console.log(name, "--name");
    console.log(value, "--value");

    setCertification((prev) =>
      prev.map((form, i) => {
        if (i === index) {
          const updatedForm = { ...form, [name]: value };

          if (name === "country") {
            setSelectedCertifcateCountry(value);
            updatedForm.state = "";
            updatedForm.city = "";
    
            setStates([]);
            setCities([]);
          }

          if (name === "state") {
            setSelectedCertifcateState(value);
            updatedForm.city = "";

            setCities([]);
          }

          return updatedForm;
        }
        return form;
      })
    );
  };

  const handleAddCertification = () => {
    setCertification((prev) => [...prev, {}]);

    setTimeout(() => {
      const lastIndex = certification.length;
      const lastRef = sectionRefs.current[lastIndex];
      if (lastRef) {
        lastRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleNext = () => {
    onNext(certification);
    nextStep();
  };

  const handleBack = () => {
    previousStep();
  };

  const handleClose = (index) => {
    setCertification((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1);
  };

  return (
    <Box sx={{ minHeight: "100vh" }} ref={formTopRef}>
      <Header handleBack={handleBack} pages={data?.pages} title={data?.title} />

      {certification?.map((form, index) => (
        <Box
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          sx={{ mb: "20px" }}
        >
          <ButtonIndex
            label="Certificate"
            index={index}
            handleClose={handleClose}
          />
          {data?.form?.map((item) => (
            <FormField
              key={item.name}
              item={item}
              form={form}
              index={index}
              handleChange={handleChange}
              handleEnhanceAi={handleEnhanceAi}
              states={states}
              cities={cities}
              checkedLabel="Currently Enrolled"
            />
          ))}
        </Box>
      ))}

      <AddAnotherButton
        onClick={handleAddCertification}
        label={"Certificate"}
      />
      <RalliButton label="Save & Continue" onClick={handleNext} />
    </Box>
  );
};

export default Certifications;
