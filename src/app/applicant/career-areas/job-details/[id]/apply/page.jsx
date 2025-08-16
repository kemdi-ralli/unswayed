"use client";
import React from "react";
import AppliedJobContainer from "@/components/applicant/applied/AppliedJobContainer";
import Container from "@/components/common/Container";

const page = ({ params }) => {
  const id = params?.id 
  return (
      <Container sx={{ flex: 1 }}>
        <AppliedJobContainer id={id}/>
      </Container>
  );
};

export default page;
