"use client";
import React from "react";
import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import AddReviews from "@/components/common/AddReview/AddReviews";
import { ADD_A_REVIEWS } from "@/constant/employer/profile";
import { decode } from "@/helper/GeneralHelpers";

const Page = ({ params }) => {
  const employerId = decode(params?.id);
  return (
      <Container>
        <BackButtonWithTitle label="Add A Reviews"/>
        <AddReviews data={ADD_A_REVIEWS} id={employerId} />
      </Container>
  );
};

export default Page;
