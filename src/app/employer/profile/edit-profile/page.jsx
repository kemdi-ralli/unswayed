"use client";
import React, { useEffect, useState } from "react";
import { EDIT_EMPLOYER_PROFILE } from "@/constant/employer/profile";

import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import EditEmployerProfile from "@/components/employer/profile/EditEmployerProfile";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  EMPLOYER_GET_PROFILE,
  EMPLOYER_UPDATE_PROFILE,
  UPDATE_EMPLOYER_PROFILE_PIC,
} from "@/services/apiService/apiEndPoints";
import Cookie from "js-cookie";
import {
  getCities,
  getCountries,
  getStates,
} from "@/helper/MasterGetApiHelper";
import { Toast } from "@/components/Toast/Toast";
import { employerProfileSchema } from "@/schemas/editProfileSchema";
import { login } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";

const Page = () => {
  const [employerGetProfile, setEmployerGetProfile] = useState(null);
  const [employerProfileDetail, setEmployerProfileDetail] = useState(
    EDIT_EMPLOYER_PROFILE
  );
  const [profilePicPreview, setProfilePicPreview] = useState(
    employerGetProfile?.photo
  );
  const [isProfilePicChange, setIsProfilePicChange] = useState(null);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [formikErrors, setFormikErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch()

  const fetchEmployerGetProfile = async () => {
    const response = await apiInstance.get(EMPLOYER_GET_PROFILE);
    if (response.status === 200 || response.status === 201) {
      setEmployerGetProfile(response?.data?.data?.user);
    } else {
      console.log("Failed to Get Your Profile");
    }
  };
  useEffect(() => {
    fetchEmployerGetProfile();
  }, []);

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      Toast("error", "Failed to load countries.");
    }
  };
  const fetchStates = async (countryId) => {
    try {
      const data = await getStates(countryId);
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
      Toast("error", "Failed to load states.");
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const data = await getCities(stateId);
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      Toast("error", "Failed to load cities.");
    }
  };
  const handleDropdownChange = async (key, value) => {
    if (key === "country") {
      setEmployerProfileDetail((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails.map((item) => {
          if (item.name === "state" || item.name === "city") {
            return { ...item, value: null };
          }
          if (item.name === key) {
            return { ...item, value };
          }
          return item;
        });
        return { ...prevDetails, contactDetails: updatedContactDetails };
      });
      await fetchStates(value);
    } else if (key === "state") {
      setEmployerProfileDetail((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails.map((item) => {
          if (item.name === "city") {
            return { ...item, value: null };
          }
          if (item.name === key) {
            return { ...item, value };
          }
          return item;
        });
        return { ...prevDetails, contactDetails: updatedContactDetails };
      });

      await fetchCities(value);
    } else {
      setEmployerProfileDetail((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails.map((item) => {
          if (item.name === key) {
            return { ...item, value };
          }
          return item;
        });
        return { ...prevDetails, contactDetails: updatedContactDetails };
      });
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePicPreview(imageUrl);
      setIsProfilePicChange(file);
    }
  };

  const handleApiProfilePicChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        console.error("No file selected");
        return;
      }
      const reader = new FileReader();

      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("photo", file);

      const response = await apiInstance.post(
        UPDATE_EMPLOYER_PROFILE_PIC,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        Toast("success", response.data.message);
      }
      console.log("Upload response:", response);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };
  const validateForm = async () => {
    try {
      const formData = {};
      employerProfileDetail.contactDetails.forEach((item) => {
        formData[item.name] = item.value;
      });

      await employerProfileSchema.validate(formData, { abortEarly: false });

      setFormikErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      if (validationErrors.inner) {
        validationErrors.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
      }
      setFormikErrors(newErrors);
      return false;
    }
  };
  const updateDetails = async () => {
    if (isProfilePicChange) {
      await handleApiProfilePicChange({
        target: { files: [isProfilePicChange] },
      });
      setIsProfilePicChange(null);
    }
    const isValid = await validateForm();
    if (!isValid) return;
    try {
      const updatedData = {
        username: employerProfileDetail?.userName,
        photo: employerProfileDetail?.userProfile,
        contactDetails: {},
      };
      employerProfileDetail?.contactDetails?.forEach((item) => {
        updatedData.contactDetails[item?.name] = item?.value;
      });
      setLoading(true);
      const response = await apiInstance.patch(
        `${EMPLOYER_UPDATE_PROFILE}/${employerGetProfile?.id}`,
        updatedData?.contactDetails
      );
      dispatch(login(response?.data?.data));
      Cookie.set("is_completed", response?.data?.data?.user?.is_completed);
      if (response?.status === 200 || response?.status === 201) {
        Toast("success", response?.data?.message);
        setLoading(false);
      }
    } catch (err) {
      Toast("error", err?.message);
      console.log(err?.message);
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (employerGetProfile) {
      setEmployerProfileDetail((prev) => ({
        ...prev,
        userProfile: employerGetProfile?.photo || prev.userProfile,
        userName: employerGetProfile?.username || prev.userName,
        contactDetails: prev.contactDetails.map((item) => {
          if (item.name === "username")
            item.value = employerGetProfile?.username;
          if (item.name === "company_name")
            item.value = `${employerGetProfile?.first_name} ${employerGetProfile?.middle_name} ${employerGetProfile?.last_name}`;
          if (item.name === "country")
            item.value = employerGetProfile?.country?.id;
          if (item.name === "state") item.value = employerGetProfile?.state?.id;
          if (item.name === "city") item.value = employerGetProfile?.city?.id;
          if (item.name === "zip_code")
            item.value = employerGetProfile?.zip_code;
          if (item.name === "address") item.value = employerGetProfile?.address;
          if (item.name === "about") item.value = employerGetProfile?.about;
          if (item.name === "company_size")
            item.value = employerGetProfile?.company_size;
          if (item.name === "industry")
            item.value = employerGetProfile?.industry;
          if (item.name === "website") item.value = employerGetProfile?.website;
          if (item.name === "company_type")
            item.value = employerGetProfile?.company_type;
          if (item.name === "founded") item.value = employerGetProfile?.founded;
          return item;
        }),
      }));

      if (employerGetProfile?.country?.id && !states.length) {
        fetchStates(employerGetProfile.country.id);
      }
      if (employerGetProfile?.state?.id && !cities.length) {
        fetchCities(employerGetProfile.state.id);
      }
    }
  }, [employerGetProfile]);

  return (
    <Container>
      <BackButtonWithTitle label="Employer Profile" />
      <EditEmployerProfile
        data={employerProfileDetail}
        setEmployerProfileDetail={setEmployerProfileDetail}
        employerProfileDetail={employerProfileDetail}
        countries={countries}
        states={states}
        cities={cities}
        handleDropdownChange={handleDropdownChange}
        profilePicPreview={profilePicPreview}
        handleProfilePicChange={handleProfilePicChange}
        updateDetails={updateDetails}
        formikErrors={formikErrors}
        loading={loading}
      />
    </Container>
  );
};

export default Page;
