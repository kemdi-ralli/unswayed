'use client'
import React from "react";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import Container from "@/components/common/Container";
import JobApplications from "@/components/employer/dashboard/JobApplications";

const Page = () => {
  return (
      <Container>
        <BackButtonWithTitle label="Dashboard"/>
        <JobApplications/>
      </Container>
  );
};

export default Page;
