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

const ProjectWorked = ({ data, onNext, projects }) => {
  const { nextStep, previousStep } = useWizard();
  const [project, setProject] = useState(projects || []);
  const [enhanceAi, setEnhanceAi] = useState("");

  const sectionRefs = useRef([]);
  const formTopRef = useRef(null);

  useEffect(() => {
    if (projects?.length > 0) {
      setEnhanceAi(projects[0]?.description || "");

      setTimeout(() => {
        if (formTopRef.current) {
          const offset = 100;
          const top = formTopRef.current.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [projects]);

  const handleEnhanceAi = async (index, description) => {
    try {
      const enhancedText = await enhanceText(description);
      setProject((prev) =>
        prev.map((job, i) =>
          i === index ? { ...job, description: enhancedText } : job
        )
      );
    } catch (error) {
      console.error("Error enhancing description:", error);
    }
  };

  const handleChange = (index, name, value) => {
    setProject((prev) =>
      prev.map((form, i) => (i === index ? { ...form, [name]: value } : form))
    );
  };

  const handleAddProjects = () => {
    setProject((prev) => [...prev, {}]);

    setTimeout(() => {
      const lastIndex = project.length;
      const lastRef = sectionRefs.current[lastIndex];
      if (lastRef) {
        lastRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleNext = () => {
    onNext(project);
    nextStep();
  };

  const handleBack = () => {
    previousStep();
  };

  const handleClose = (index) => {
    setProject((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1); 
  };

  return (
    <Box sx={{ width: "auto", minHeight: "100vh" }} ref={formTopRef}>
      <Header handleBack={handleBack} pages={data?.pages} title={data?.title} />

      {project.map((form, index) => (
        <Box
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          sx={{ mb: "20px" }}
        >
          <ButtonIndex label="Project" index={index} handleClose={handleClose} />
          {data?.form?.map((item) => (
            <FormField
              key={item.name}
              item={item}
              form={form}
              index={index}
              handleChange={handleChange}
              handleEnhanceAi={handleEnhanceAi}
            />
          ))}
        </Box>
      ))}

      <AddAnotherButton onClick={handleAddProjects} label={"Project"} />
      <Box sx={{ pt: 2 }}>
        <RalliButton label="Save & Continue" onClick={handleNext} />
      </Box>
    </Box>
  );
};

export default ProjectWorked;
