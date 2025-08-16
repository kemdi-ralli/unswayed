"use client";
import React from "react";
import DashboardTabs from "@/components/applicant/dashboard/DashboardTabs";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import Container from "@/components/common/Container";

const page = () => {
  return (
      <Container>
        <BackButtonWithTitle label="Dashboard"/>
        <DashboardTabs />
      </Container>
  );
};

export default page;
