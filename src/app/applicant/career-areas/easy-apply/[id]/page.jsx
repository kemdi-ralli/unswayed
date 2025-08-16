"use client";
import React, { useEffect } from "react";
import Container from "@/components/common/Container";
import AppliedJobContainer from "@/components/applicant/applied/AppliedJobContainer";
import { getResumes } from "@/redux/slices/getResumesSlice";
import { useDispatch } from "react-redux";

const EasyApply = ({ params }) => {
  const id = params?.id;
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getResumes());
  }, []);
  
  return (
      <Container>
        <AppliedJobContainer id={id}/>
      </Container>
  );
};
export default EasyApply;
