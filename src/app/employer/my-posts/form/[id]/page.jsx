"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import CreateJobsForm from "@/components/employer/createJob/CreateJobsForm";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import { CREATE_JOB_FORM } from "@/constant/employer/createJob";
import { decode } from "@/helper/GeneralHelpers";
import { GET_JOB_DETAIL } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

const Page = ({ params }) => {
  const jobId = decode(params.id);
  const [jobDetail, setJobDetail] = useState(null);

  const fetchJobDetail = async () => {
    const response = await apiInstance.get(`${GET_JOB_DETAIL}/${jobId}`);
    if (response?.data?.status === 'success') {
      const job = response?.data?.data?.job;
      if(job){
        setJobDetail(job);
      }else{
        setJobDetail(null);
      }
    }
  };

  useEffect(() => {
    if(jobId){
      fetchJobDetail();
    }
  },[jobId]);

  return (
      <Container>
      <BackButtonWithTitle label='Edit Job'/>
        <CreateJobsForm  data={CREATE_JOB_FORM} isEdit={true} jobEditDetail={jobDetail}/>
      </Container>
  );
};

export default Page;
