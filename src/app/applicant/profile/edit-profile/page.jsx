"use client";
import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import EditProfile from "@/components/applicant/profile/EditProfile";
import { EDIT_PROFILE_DETAILS } from "@/constant/applicant/profile";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  GET_PROFILE,
  UPDATE_PROFILE,
  UPDATE_PROFILE_PIC,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import {
  getCities,
  getCountries,
  getStates,
  getGenders,
  getEthnicity,
} from "@/helper/MasterGetApiHelper";
import { applicantProfileSchema } from "@/schemas/editProfileSchema";
import { login } from "@/redux/slices/authSlice";
import { useDispatch } from "react-redux";
import Cookie from "js-cookie";

const Page = () => {
  const [Profile, setProfile] = useState(null);
  const [profileDetails, setProfileDetails] = useState(EDIT_PROFILE_DETAILS);
  const [profilePicPreview, setProfilePicPreview] = useState(Profile?.photo);
  const [isProfilePicChange, setIsProfilePicChange] = useState(null);
  const [profileChanged, setProfileChanged] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);
  const [genders, setGenders] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [ethnicity, setEthnicity] = useState([]);
  const [formikErrors, setFormikErrors] = useState({});
  const [experienceLevel, setExperienceLevel] = useState([
    { name: "Entry", id: "jr" },
    { name: "Intermediate", id: "III" },
    { name: "Experienced", id: "IV" },
    { name: "Advanced", id: "sr" },
  ]);
  const dispatch = useDispatch();
  const fetchProfile = async () => {
    const response = await apiInstance.get(GET_PROFILE);
    if (response.status === 200 || response.status === 201) {
      setProfile(response.data.data.user);
    } else {
      console.log("Failed to Get Your Profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [profileChanged]);

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

      const response = await apiInstance.post(UPDATE_PROFILE_PIC, formData, {
        headers: {
        },
      });
      if (response.status === 200 || response.status === 201) {
        Toast("success", response.data.message);
        setProfileChanged(response?.data);
      }
      console.log("Upload response:", response.data);
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  const handleDropdownChange = async (key, value) => {
    if (key === "country") {
      setProfileDetails((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails?.map(
          (item) => {
            if (item.name === "state" || item.name === "city") {
              return { ...item, value: null };
            }
            if (item.name === key) {
              return { ...item, value };
            }
            return item;
          }
        );
        return { ...prevDetails, contactDetails: updatedContactDetails };
      });
      await fetchStates(value);
    } else if (key === "state") {
      setProfileDetails((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails?.map(
          (item) => {
            if (item.name === "city") {
              return { ...item, value: null };
            }
            if (item.name === key) {
              return { ...item, value };
            }
            return item;
          }
        );
        return { ...prevDetails, contactDetails: updatedContactDetails };
      });

      await fetchCities(value);
    } else {
      setProfileDetails((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails?.map(
          (item) => {
            if (item.name === key) {
              return { ...item, value };
            }
            return item;
          }
        );
        return { ...prevDetails, contactDetails: updatedContactDetails };
      });
    }
  };

  const validateForm = async () => {
    try {
      const formData = {};
      profileDetails?.contactDetails.forEach((item) => {
        formData[item.name] = item.value;
      });

      await applicantProfileSchema.validate(formData, { abortEarly: false });

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
  const updateProfile = async () => {
    setError(null);
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
        username: profileDetails.userName,
        photo: profileDetails.userProfile,
        contactDetails: {},
      };
      profileDetails?.contactDetails?.forEach((item) => {
        updatedData.contactDetails[item.name] = item?.value;
      });
      setLoading(true);
      const response = await apiInstance.patch(
        `${UPDATE_PROFILE}/${Profile?.id}`,
        updatedData?.contactDetails
      );
      console.log(response.data.data.user, "edit data response");
      dispatch(login(response?.data?.data));
      Cookie.set("is_completed", response?.data?.data?.user?.is_completed);
      if (response?.status === 200) {
        Toast("success", response?.data?.message);
        setLoading(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      Toast(
        "error",
        error.message || "An error occurred while updating your profile."
      );
      setError("An error occurred while updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCountries = async () => {
    try {
      const data = await getCountries();
      setCountries(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      Toast("error", "Failed to load countries.");
    }
  };
  const fetchEthnicity = async () => {
    try {
      const data = await getEthnicity();
      setEthnicity(data);
    } catch (error) {
      console.error("Error fetching countries:", error);
      Toast("error", "Failed to load countries.");
    }
  };

  const fetchGenders = async () => {
    try {
      const data = await getGenders();
      setGenders(data);
    } catch (error) {
      console.error("Error fetching genders:", error);
      Toast("error", "Failed to load genders.");
    }
  };

  const fetchStates = async (countryId) => {
  const US_INHABITED_TERRITORIES = [
    "American Samoa",
    "Guam",
    "Northern Mariana Islands",
    "Puerto Rico",
    "U.S. Virgin Islands",
  ];

  const US_UNINHABITED_TERRITORIES = [
    "Baker Island",
    "Howland Island",
    "Jarvis Island",
    "Johnston Atoll",
    "Kingman Reef",
    "Midway Atoll",
    "Navassa Island",
    "Palmyra Atoll",
    "Wake Island",
  ];

  try {
    let data = await getStates(countryId);

    // Handle US territories for country 233
    if (countryId === 233) {
      const territoryNames = [...US_INHABITED_TERRITORIES, ...US_UNINHABITED_TERRITORIES];
      const mainStates = (data || []).filter(
        state => !territoryNames.includes(state.name)
      );
      
      const territories = [
        ...US_INHABITED_TERRITORIES,
        ...US_UNINHABITED_TERRITORIES,
      ].map((name) => ({ id: name, name }));
      
      data = [...mainStates, ...territories];
    }

    setStates(data);
  } catch (error) {
    console.error("Error fetching states:", error);
    Toast("error", "Failed to load states.");
    setStates([]);
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

  useEffect(() => {
    fetchCountries();
    fetchGenders();
    fetchEthnicity();
  }, []);

  useEffect(() => {
    if (Profile) {
      setProfileDetails((prev) => ({
        ...prev,
        userProfile: Profile?.photo || prev.userProfile,
        userName: Profile?.username || prev.userName,
        contactDetails: prev.contactDetails?.map((item) => {
          if (item.name === "username") item.value = Profile?.username;
          if (item.name === "first_name") item.value = Profile?.first_name;
          if (item.name === "middle_name") item.value = Profile?.middle_name;
          if (item.name === "last_name") item.value = Profile?.last_name;
          if (item.name === "age") item.value = Profile?.age;
          if (item.name === "gender") item.value = Profile?.gender?.id;
          if (item.name === "country") item.value = Profile?.country?.id;
          if (item.name === "state") item.value = Profile?.state?.id;
          if (item.name === "city") item.value = Profile?.city?.id;
          if (item.name === "zip_code") item.value = Profile?.zip_code;
          if (item.name === "ethnicity") item.value = Profile?.ethnicity?.id;
          if (item.name === "dob") item.value = Profile?.dob;
          if (item.name === "address") item.value = Profile?.address;
          if (item.name === "about") item.value = Profile?.about;
          if (item.name === "skills") item.value = Profile?.skills || [];
          if (item.name === "experience_level")
            item.value = Profile?.experience_level;
          return item;
        }),
      }));

      if (Profile?.country?.id && !states.length) {
        fetchStates(Profile.country.id);
      }
      if (Profile?.state?.id && !cities.length) {
        fetchCities(Profile.state.id);
      }
    }
  }, [Profile]);
  const handleAddressSelect = (addressDetails) => {
    // Auto-fill zip code when address is selected
    if (addressDetails.zipCode) {
      setProfileDetails((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails.map((item) => {
          if (item.name === "zip_code") {
            return { ...item, value: addressDetails.zipCode };
          }
          return item;
        });
        return { ...prevDetails, contactDetails: updatedContactDetails };
      });
    }
  };

  return (
    <EditProfile
      profileDetails={profileDetails}
      setProfileDetails={setProfileDetails}
      countries={countries}
      ethnicity={ethnicity}
      states={states}
      cities={cities}
      genders={genders}
      handleDropdownChange={handleDropdownChange}
      handleProfilePicChange={handleProfilePicChange}
      profilePicPreview={profilePicPreview}
      onSave={updateProfile}
      loading={loading}
      error={error}
      formikErrors={formikErrors}
      experienceLevel={experienceLevel}
      data={Profile}
      onAddressSelect={handleAddressSelect}
    />
  );
};

export default Page;
