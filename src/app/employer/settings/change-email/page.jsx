"use client";
import React from "react";

import { CHANGE_EMAIL } from "@/constant/applicant/profile";

import ChangeEmail from "@/components/applicant/settings/changeEmail/changeEmail";
import Container from "@/components/common/Container";
import { Wizard } from "react-use-wizard";
import VerifyNumber from "@/components/applicant/settings/addNumber/VerifyNumber";

const Page = () => {
  return (
    <Container>
      <Wizard>
        <ChangeEmail data={CHANGE_EMAIL} />
        <VerifyNumber type={"email"} />
      </Wizard>
    </Container>
  );
};

export default Page;
