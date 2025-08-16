"use client";
import React from "react";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import Container from "@/components/common/Container";
import JobApplications from "@/components/employer/dashboard/JobApplications";
import { decode } from "@/helper/GeneralHelpers";

const Page = ({ params }) => {
  const jobId = decode(params.id);

  return (
      <Container>
        <BackButtonWithTitle label="Dashboard"/>
        <JobApplications jobId={jobId}/>
      </Container>
  );
};

export default Page;
