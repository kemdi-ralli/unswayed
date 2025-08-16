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

const AddRecentJobs = ({
  data,
  onNext,
  recentJobs,
  countries,
  states,
  cities,
  totalExperience,
  setSelectedCountry,
  setSelectedState,
  setSelectedCity,
  setCities,
  setStates
}) => {
  const { nextStep, previousStep } = useWizard();
  const [recentJob, setRecentJob] = useState(recentJobs || []);
  const [enhanceAi, setEnhanceAi] = useState("");

  const sectionRefs = useRef([]);
  const formTopRef = useRef(null);
  useEffect(() => {
    if (recentJobs?.length > 0) {
      setEnhanceAi(recentJobs[0]?.description || "");

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
  }, [recentJobs]);

  const handleEnhanceAi = async (index, description) => {
    try {
      const enhancedText = await enhanceText(description);
      setRecentJob((prev) =>
        prev.map((job, i) =>
          i === index ? { ...job, description: enhancedText } : job
        )
      );
    } catch (error) {
      console.error("Error enhancing description:", error);
    }
  };

  // const handleChange = (index, name, value) => {
  //   console.log(name, "--name");
  //   console.log(value, "--valeu");
  //   if (name === "country") {
  //     setSelectedCountry(value);
  //   }

  //   if (name === "state") {
  //     setSelectedState(value);
  //   }
  //   setRecentJob((prev) =>
  //     prev.map((form, i) => (i === index ? { ...form, [name]: value } : form))
  //   );
  // };
  const handleChange = (index, name, value) => {
    console.log(name, "--name");
    console.log(value, "--value");

    setRecentJob((prev) =>
      prev.map((form, i) => {
        if (i === index) {
          const updatedForm = { ...form, [name]: value };

          if (name === "country") {
            setSelectedCountry(value);
            updatedForm.state = "";
            updatedForm.city = "";
            // ✅ Clear cities and states
            setStates([]);
            setCities([]);
          }

          if (name === "state") {
            setSelectedState(value);
            updatedForm.city = "";
            // ✅ Clear cities
            setCities([]);
          }

          return updatedForm;
        }
        return form;
      })
    );
  };

  const handleAddJob = () => {
    setRecentJob((prev) => [...prev, {}]);

    setTimeout(() => {
      const lastIndex = recentJob.length;
      const lastRef = sectionRefs.current[lastIndex];
      if (lastRef) {
        lastRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleNext = () => {
    onNext(recentJob);
    nextStep();
  };

  const handleBack = () => {
    previousStep();
  };

  const handleClose = (index) => {
    setRecentJob((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1);
  };

  return (
    <Box sx={{ minHeight: "100vh" }} ref={formTopRef}>
      <Header handleBack={handleBack} pages={data?.pages} title={data?.title} />

      {recentJob?.map((form, index) => (
        <Box
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          sx={{ mb: "20px" }}
        >
          <ButtonIndex
            label="Experience"
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
              countries={countries}
              cities={cities}
              checkedLabel="Currently Employed"
              totalExperience={totalExperience}
            />
          ))}
        </Box>
      ))}

      <AddAnotherButton onClick={handleAddJob} label={"Experience"} />
      <RalliButton label="Save & Continue" onClick={handleNext} />
    </Box>
  );
};

export default AddRecentJobs;
