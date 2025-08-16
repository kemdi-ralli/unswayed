'use client'
import React from "react";
import MarkAsNotifications from "@/components/applicant/markNotification/MarkAsNotifications";
import Container from "@/components/common/Container";
import { MARK_AS_NOTIFICATIONS } from "@/constant/applicant/markAsNotifications";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";

const Page = () => {
  return (
      <Container>
        <BackButtonWithTitle label='Notifications'/>
        <MarkAsNotifications data={MARK_AS_NOTIFICATIONS}/>
      </Container>
  );
};

export default Page;
