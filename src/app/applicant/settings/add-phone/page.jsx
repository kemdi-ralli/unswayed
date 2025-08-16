"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import {
  ADD_NUMBER,
  ADD_NUMBER_VERIFICATIONS,
} from "@/constant/applicant/profile";
import AddNumberWrapper from "@/components/applicant/settings/addNumber/AddNumberWrapper";
import { GET_PROFILE } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

const Page = () => {
  const [formData, setFormData] = useState();
  const [profile, setProfile] = useState(null);
  const fetchProfile = async () => {
    try {
      const response = await apiInstance.get(GET_PROFILE);
      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.data.user);
      } else {
        console.log("Failed to Get Your Profile");
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  const handleNextStepData = (step, data) => {
    setFormData((prevData) => ({
      ...prevData,
      [step]: data,
    }));
  };
  return (
      <Container>
        <AddNumberWrapper profile={profile}/>
      </Container>
  );
};

export default Page;
