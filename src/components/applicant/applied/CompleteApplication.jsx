"use client";
import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import AppliedJobs from "../dashboard/AppliedJobs";
import RalliButton from "@/components/button/RalliButton";
import { BorderLinearProgress } from "@/helper/progressbar";
import FormCheckbox from "./FormCheckbox";
import { useSelector } from "react-redux";
import RalliModal from "@/components/Modal/RalliModal";
import { useRouter } from "next/navigation";
import SelectDropdown from "@/components/applicantForm/SelectDropdown";
import TremsOfUse from "@/components/common/tremsAndConditionModal/TremsOfUse";
import BackbuttonWithTitle from "./BackbuttonWithTitle";

const CompleteApplication = ({
  data,
  getAppliedData,
  checkboxStates,
  handleCheckboxChange,
  handleSubmit,
  disability,
  dropdownStates,
  handleDropdownChange,
  formikErrors,
  isDisable,
  agreeTerms,
  setAgreeTerms,
}) => {
  console.log(data, "dataaaa");
  const [inputData, setInputData] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const router = useRouter();
  const handleCloseModal = () => {
    setModalOpen(false);
    router.push("/applicant/career-areas");
  };
  const handleCancel = () => {
    router.push("/applicant/career-areas");
  };

  const handleModal = () => {
    handleCloseModal();
  };
  const getApplied = useSelector((state) => state?.appliedJobs?.appliedData);
  const getUserData = useSelector((state) => state?.auth?.userData);
  const collectData = [
    {
      title: getUserData?.user?.ucn,
      name: "UCN",
    },
    {
      title: getApplied?.title,
      name: "Position Title",
    },
    {
      title: getApplied?.requisition_number,
      name: "Requisition Number",
    },
    {
      title: getApplied?.job_types?.map((item) => item?.name).join(", "),
      name: "Employment Type",
    },
    {
      title: getApplied?.job_locations?.map((item) => item?.name).join(", "),
      name: "Work Location",
    },
    {
      title: getUserData?.user?.gender?.name,
      name: "Gender",
    },
    {
      title: getUserData?.user?.ethnicity?.name,
      name: "Ethnicity",
    },
  ];

  const handleInputChange = (name, value) => {
    setInputData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#FFFFFF",
            pr: "25px",
          }}
        >
          <BackbuttonWithTitle title={data?.title} />
          <Box sx={{ pb: 4 }}>
            <BorderLinearProgress variant="determinate" value={100} />
          </Box>

          {collectData?.map((item) => (
            <Box key={item.name} sx={{ mb: "20px" }}>
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "16px" },
                  fontWeight: 500,
                  lineHeight: {
                    xs: "25px",
                    sm: "30px",
                    md: "24px",
                    lg: "18px",
                  },
                  color: "#222222",
                  mb: "5px",
                }}
              >
                {item?.name}
              </Typography>
              <Typography
                sx={{
                  width: "100%",
                  display: "block",
                  padding: "18px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: "18px",
                  color: "#222222",
                  backgroundColor: "#FFFFFF",
                  boxShadow: "0px 1px 5px #00000040",
                }}
              >
                {item?.title || "N/A"}
              </Typography>
            </Box>
          ))}
          {/* <CompleteDropdown
                        names={data?.employmentType}
                        label="Employment Type"
                        selectedValue={dropdownStates.employmentType}
                        onChange={(value) => handleDropdownChange('employmentType', value)}
                    /> */}
          <FormCheckbox
            required
            selectedOption={checkboxStates.is_adult}
            handleCheckboxChange={(option) =>
              handleCheckboxChange("is_adult", option)
            }
            label={"Are You 18 Years or Older?"}
          />
          {formikErrors.is_adult && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.is_adult}
            </Typography>
          )}
          <FormCheckbox
            required
            selectedOption={checkboxStates.authorized_to_work}
            handleCheckboxChange={(option) =>
              handleCheckboxChange("authorized_to_work", option)
            }
            label={`Are You a US Citizen Authorized to Work in the ${getAppliedData?.country?.name}?`}
          />
          {formikErrors.authorized_to_work && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.authorized_to_work}
            </Typography>
          )}
          <FormCheckbox
            required
            selectedOption={checkboxStates.have_visa}
            handleCheckboxChange={(option) =>
              handleCheckboxChange("have_visa", option)
            }
            label={
              "Do you have a work Visa or will you require one in the future?"
            }
          />
          {formikErrors.have_visa && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.have_visa}
            </Typography>
          )}
          <FormCheckbox
            required
            selectedOption={checkboxStates.meet_qualifications}
            handleCheckboxChange={(option) =>
              handleCheckboxChange("meet_qualifications", option)
            }
            label={"Do You Meet the Must Have Qualifications?"}
          />
          {formikErrors.meet_qualifications && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.meet_qualifications}
            </Typography>
          )}
          <FormCheckbox
            required
            selectedOption={checkboxStates.meet_educations}
            handleCheckboxChange={(option) =>
              handleCheckboxChange("meet_educations", option)
            }
            label={"Do You Meet the Education Requirements?"}
          />
          {formikErrors.meet_educations && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.meet_educations}
            </Typography>
          )}
          <FormCheckbox
            required
            selectedOption={checkboxStates.have_disability}
            handleCheckboxChange={(option) =>
              handleCheckboxChange("have_disability", option)
            }
            label={"Do You Have a Disability?"}
            NoAnswer={true}
            tooltip={
              <>
                <strong>Why Are We Asking This?</strong>
                <p>
                  🔹 We are committed as an online recruiting platform to
                  fostering an inclusive and accessible workplace. We aim to
                  promote inclusivity and diversity in hiring practices.
                  Tracking and monitoring diversity and inclusive metrics helps
                  us better understand the needs of applicants and employers. We
                  invite you to voluntarily self-identify if you have a
                  disability. Information provided will not be used to
                  discriminate against applicants and will not be disclosed to
                  employers without applicants’ consent.
                </p>
                <strong>What Is Considered A Disability?</strong>
                <p>
                  🔹 A disability is a physical or mental condition which limits
                  one or more major activities. This is not an exhaustive list
                  as disabilities may vary widely:
                </p>
                <p>· Allergies and chemical sensitivities</p>
                <p>· Alzheimer’s disease or dementia</p>
                <p>
                  · Anxiety disorders (e.g., generalized anxiety, social
                  anxiety, panic disorders)
                </p>
                <p>· Arthritis</p>
                <p>· Attention deficit hyperactivity disorder (ADHD)</p>
                <p>· Autism spectrum disorder (ASD)</p>
                <p>· Bipolar disorder</p>
                <p>· Blindness or low vision</p>
                <p>· Cancer</p>
                <p>· Chronic fatigue syndrome (CFS)</p>
                <p>· Chronic Illnesses</p>
                <p>· Chronic migraines</p>
                <p>· Chronic pain disorders</p>
                <p>· Crohn’s disease</p>
                <p>· Cystic fibrosis</p>
                <p>· Deafness or hearing impairment</p>
                <p>· Depression</p>
                <p>· Developmental Disabilities</p>
                <p>· Diabetes</p>
                <p>· Down syndrome</p>
                <p>· Dyslexia or other learning disabilities</p>
                <p>· Ehlers-Danlos syndrome (EDS)</p>
                <p>· Endometriosis</p>
                <p>· Epilepsy</p>
                <p>· Fetal alcohol syndrome</p>
                <p>· Fibromyalgia</p>
                <p>· Fragile X syndrome</p>
                <p>· Heart disease</p>
                <p>· HIV/AIDS</p>
                <p>· Intellectual disabilities</p>
                <p>· Invisible Disabilities</p>
                <p>· Irritable bowel syndrome (IBS)</p>
                <p>· Lupus</p>
                <p>· Mental Health Conditions</p>
                <p>
                  · Mobility impairments (e.g., paralysis, amputation, cerebral
                  palsy)
                </p>
                <p>· Multiple sclerosis (MS)</p>
                <p>· Muscular dystrophy</p>
                <p>· Neurological Disorders</p>
                <p>· Obsessive-compulsive disorder (OCD)</p>
                <p>· Parkinson’s disease</p>
                <p>· Post-traumatic stress disorder (PTSD)</p>
                <p>· Physical Disabilities</p>
                <p>· Schizophrenia</p>
                <p>· Sensory Disabilities</p>
                <p>· Sleep disorders (e.g., narcolepsy)</p>
                <p>· Speech and language disorders</p>
                <p>· Spinal cord injuries</p>
                <p>· Stuttering</p>
                <p>· Tinnitus</p>
                <p>· Tourette syndrome</p>
                <p>· Traumatic brain injuries (TBI)</p>
                <p>· Vertigo or balance disorders</p>
              </>
            }
          />
          {checkboxStates.have_disability === "yes" && (
            <SelectDropdown
              disability={disability}
              dropdownStates={dropdownStates}
              handleDropdownChange={handleDropdownChange}
            />
          )}
          {formikErrors.have_disability && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.have_disability}
            </Typography>
          )}
          <FormCheckbox
            required
            selectedOption={checkboxStates.is_veteran}
            handleCheckboxChange={(option) =>
              handleCheckboxChange("is_veteran", option)
            }
            label={"Are you a Veteran?"}
            NoAnswer={true}
            tooltip={
              <>
                <strong>Please check all that apply:</strong>
                <p>🔹 I am a Protected Veteran in the drop down.</p>
                <p>🔹 I am a veteran of the U.S. Armed Forces</p>
                <p>🔹 I am a disabled veteran.</p>
                <p>
                  🔹 I am a recently separated veteran (within the last 3
                  years).
                </p>
                <p>🔹 I am an active-duty wartime or campaign badge veteran.</p>
                <p>🔹 I am a veteran with a service-connected disability.</p>
                <p>🔹 I am not a veteran.</p>
                <strong>
                  Voluntary Self-Identification of Veteran Status.
                </strong>
                <p>
                  🔹 We are committed as an online recruiting platform to
                  supporting and honoring veterans by providing equal
                  opportunities to apply for employment opportunities. As part
                  of our commitment, we invite you to voluntarily self-identify
                  your veteran status to help us better serve you and improve
                  hiring practices utilizing our platform. Information provided
                  will not be used to discriminate against applicants and will
                  not be disclosed to employers without applicants’ consent.
                  This information is confidential and used only for tracking
                  and monitoring to improve resources for veterans.
                </p>
                <strong>What is a Veteran?</strong>
                <p>
                  🔹 A veteran is a person who served their country, regardless
                  of whether they participated in active combat or served during
                  peacetime. Veterans include individuals who served in various
                  branches of the military, such as the Army, Navy, Air Force,
                  Marines, Coast Guard, or Space Force in the United States. The
                  term veteran applies to those who were discharged, released,
                  or have completed their service and were discharged under
                  conditions other than dishonorable.
                </p>
              </>
            }
          />
          {formikErrors.is_veteran && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              {formikErrors.is_veteran}
            </Typography>
          )}
          {isDisable && (
            <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
              You are not eligible for this position
            </Typography>
          )}
          <Box
            sx={{
              pt: 4,
            }}
          >
            <RalliButton
              disableValue={isDisable}
              label="Submit Application"
              onClick={handleSubmit}
            />
          </Box>
          <Box
            sx={{
              py: 2,
              pb: 2,
            }}
          >
            <RalliButton label="Cancel" onClick={handleCancel} bg="#00305B" />
          </Box>
          <TremsOfUse
            error={formikErrors.terms}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
          />
        </Grid>
        <RalliModal
          onClick={handleModal}
          open={isModalOpen}
          onClose={handleCloseModal}
          para={
            "Thank you! Your application has been successfully submitted. We’ll review it shortly and keep you updated on the next steps"
          }
          imageSrc={"/assets/images/confirmation.png"}
          buttonLabel="Done"
        />
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#FAF9F8",
          }}
        >
          <AppliedJobs data={getAppliedData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompleteApplication;
