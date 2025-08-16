"use client";
import React from "react";
import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import { decode } from "@/helper/GeneralHelpers";
import ApplicationDetail from "@/components/dashboard/ApplicationDetail";

const Page = ({ params }) => {
  const applicationId = decode(params.id);
  return (
      <Container>
        <BackButtonWithTitle label="Application"/>
        <ApplicationDetail applicationId={applicationId} />
      </Container>
  );
};

export default Page;
