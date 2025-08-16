"use client";
import React, { useEffect, useState } from "react";
import Container from "@/components/common/Container";
import AddNumberWrapper from "@/components/applicant/settings/addNumber/AddNumberWrapper";
import { EMPLOYER_GET_PROFILE } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";

const Page = () => {
  const [profile, setProfile] = useState(null);
  const fetchProfile = async () => {
    try {
      const response = await apiInstance.get(EMPLOYER_GET_PROFILE);
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
  return (
      <Container>
        <AddNumberWrapper profile={profile}/>
      </Container>
  );
};

export default Page;
