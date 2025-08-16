"use client";
import React from "react";
import Container from "@/components/common/Container";
import CreateJobsForm from "@/components/employer/createJob/CreateJobsForm";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import { CREATE_JOB_FORM } from "@/constant/employer/createJob";

const page = () => {

  return (
      <Container>
      <BackButtonWithTitle label='Create Job'/>
        <CreateJobsForm  data={CREATE_JOB_FORM}/>
      </Container>
  );
};

export default page;
