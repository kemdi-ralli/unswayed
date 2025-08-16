"use client";
import React from "react";

import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import Container from "@/components/common/Container";
import AllowJobSearchNotificationSwitch from "@/components/applicant/settings/changeNotficationType/AllowJobSearchNotificationSwitch";

const Page = () => {
  return (
      <Container>
        <BackButtonWithTitle label="Notification Settings"/>
        <AllowJobSearchNotificationSwitch />
      </Container>
  );
};
export default Page;
