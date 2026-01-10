"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Chip, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import styles from "./profile.module.css";
import ResumeTab from "../ResumeTab/ResumeTab";
import FollowersTabs from "../talent-network/FollowesFollwingTabs";
import AddIcon from "@mui/icons-material/Add";
import { useSelector } from "react-redux";
import { APPLICANT_EDUCATION } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import Following from "../talent-network/Following";
import RalliModal from "@/components/Modal/RalliModal";
import { Toast } from "@/components/Toast/Toast";
import { EDU_INFO_CRUD } from "@/constant/ralliResume";
import { DeleteForever, Edit } from "@mui/icons-material";
import UserDetail from "./UserDetail";
import { educationValidationSchema } from "@/schemas/addEducationSchema";


const ProfileView = ({
  Profile,
  setProfile,
  setIsFetch,
  onPressFollow = () => {},
  onPressMessage = () => {},
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [educationErrors, setEducationErrors] = useState({});
  const [privacyOn, setPrivacyOn] = useState(true);
  const [educationFields, setEducationFields] = useState({
    institution_name: "",
    degree: "",
    field_of_study: "",
    grade: "",
    start_date: null,
    end_date: null,
    media: null,
    is_continue: false,
  });

  const router = useRouter();
  const pathName = usePathname();
  console.log(pathName.includes("applicant"), "rout");
  const { userData } = useSelector((state) => state.auth);
  useEffect(() => {
    const stored = localStorage.getItem("privacyOn");
    if (stored !== null) {
      setPrivacyOn(stored === "true");
    }
  }, []);

  const isMyProfile = userData?.user?.id === Profile?.id;

  const handleEditButton = () => {
    router.push("/applicant/profile/edit-profile");
  };
  const handleDelete = async (id) => {
    try {
      const response = await apiInstance.delete(`${APPLICANT_EDUCATION}/${id}`);

      if (response?.data?.status === "success") {
        Toast("success", response?.data?.message);
        setProfile((prevProfile) => ({
          ...prevProfile,
          educations: prevProfile?.educations?.filter((edu) => edu.id !== id),
        }));
      } else {
        Toast(
          "error",
          response?.data?.message || "Failed to delete education entry"
        );
      }
    } catch (error) {
      Toast(
        "error",
        error?.response?.data?.message || "Something went wrong while deleting"
      );
    }
  };
  const handleEdit = (item, id) => {
    setEducationFields({
      institution_name: item.institution_name || "",
      degree: item.degree || "",
      field_of_study: item.field_of_study || "",
      grade: item.grade || "",
      start_date: item.start_date || null,
      end_date: item.end_date || null,
      media: item.media || null,
      is_continue: item.is_continue || false,
    });
    setIsEdit(true);
    setModalOpen(true);
    setEditId(id);
  };

  const handleAddEducation = () => {
    setEducationFields({
      institution_name: "",
      degree: "",
      field_of_study: "",
      grade: "",
      start_date: null,
      end_date: null,
      media: null,
      is_continue: false,
    });
    setModalOpen(true);
  };
  const handleBack = () => {
    setModalOpen(false);
    // router.push("/employer/my-posts");
  };
  const handleCloseModal = () => setModalOpen(false);
  const handleSubmitEducation = async () => {
    try {
      await educationValidationSchema.validate(educationFields, {
        abortEarly: false,
      });
      const formData = new FormData();
      Object.keys(educationFields).forEach((key) => {
        formData.append(key, educationFields[key]);
      });

      let response;
      if (isEdit) {
        response = await apiInstance.post(
          `${APPLICANT_EDUCATION}/${editId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await apiInstance.post(APPLICANT_EDUCATION, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response?.data?.status === "success") {
        Toast("success", response?.data?.message);
        setModalOpen(false);
        setIsEdit(false);
        setEditId(null);
        setIsFetch(true);
      } else {
        throw new Error(
          response?.data?.message || "Failed to submit education data"
        );
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });

        setEducationErrors(validationErrors);
        Toast("error", "Please fix the highlighted errors");
      } else {
        Toast(
          "error",
          error?.response?.data?.message || "Error submitting education data"
        );
      }
    }
  };
  const selectedResume = (id) => {};

  // === NEW: Get subscription info from Profile or userData ===
  const getSubscriptionDisplay = () => {
    // Try to get from Profile first (comes from API)
    const subscriptionPlan = Profile?.subscription_plan || userData?.user?.subscription_plan || "Freemium";
    const isOnTrial = Profile?.subscription?.is_on_trial || false;
    const daysRemaining = Profile?.subscription?.days_remaining || 0;
    
    return {
      plan: subscriptionPlan,
      isOnTrial,
      daysRemaining,
    };
  };

  const subscriptionInfo = getSubscriptionDisplay();

  // === NEW: Get color based on subscription type ===
  const getSubscriptionColor = (plan) => {
    if (plan === "Freemium") return { bg: "#f3f4f6", text: "#6b7280" };
    if (plan === "30-days trial") return { bg: "#fef3c7", text: "#d97706" };
    if (plan === "Pro Plan" || plan?.includes("Pro")) return { bg: "#dbeafe", text: "#2563eb" };
    if (plan?.includes("Tier")) return { bg: "#dcfce7", text: "#16a34a" };
    if (plan === "Expired") return { bg: "#fee2e2", text: "#dc2626" };
    return { bg: "#f3f4f6", text: "#374151" };
  };

  const subColors = getSubscriptionColor(subscriptionInfo.plan);

  return (
    <Box className={styles.profileContainer}>
      <Box className={styles.userInfo}>
        <Avatar
          alt="Profile Image"
          src={Profile?.photo ? Profile?.photo : ""}
          sx={{
            width: { xs: 120, sm: 150, md: 191 },
            height: { xs: 120, sm: 150, md: 191 },
          }}
        />
        {/* <UserSyncButton/> */}
        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "22px", md: "26px" },
            fontWeight: 600,
            lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "33px" },
            color: "#111111",
            mt: "15px",
            mb: "10px",
          }}
        >
          {Profile?.first_name +
            " " +
            Profile?.middle_name +
            " " +
            Profile?.last_name}
        </Typography>

        {!isMyProfile ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
              my: 4,
            }}
          >
            {/* {!Profile == }
            <Button
              sx={{
                width: { xs: "70%", sm: "130px", md: "200px" },
                height: "60px",
                borderRadius: "10px",
                backgroundColor: Profile?.isFollowed ? "#fff" : "##189e33ff",
                color: Profile?.isFollowed ? "##189e33ff" : "#fff",
                border: "2px solid",
                borderColor: Profile?.isFollowed ? "##189e33ff" : null,
              }}
              onClick={() => onPressFollow(Profile.id)}
            >
              {Profile?.isFollowed ? "UnFollow" : "Follow"}
            </Button> */}
            <Button
              sx={{
                width: { xs: "70%", sm: "130px", md: "200px" },
                height: "60px",
                borderRadius: "10px",
                backgroundColor: "#00305B",
                color: "#fff",
              }}
              onClick={() => onPressMessage(Profile?.id)}
            >
              Message
            </Button>
          </Box>
        ) : (
          <Button
            sx={{
              fontSize: { xs: "20px", sm: "20px", md: "22px" },
              fontWeight: 600,
              lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "18px" },
              color: "##189e33ff",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleEditButton}
          >
            Edit Profile
          </Button>
        )}
      </Box>
      <Typography
        sx={{
          fontWeight: 600,
          fontSize: { xs: "16px", sm: "18px", md: "22px" },
          lineHeight: "17px",
          letterSpacing: "0%",
          color: "#00305B",
          my: 3,
        }}
      >
        User Details
      </Typography>
      {!isMyProfile ? (
        <>
          <UserDetail
            label="Type"
            value={Profile?.type?.toUpperCase()}
            isAddEdu={false}
          />
          <UserDetail
            label="Location"
            value={
              `${Profile?.country?.name || Profile?.country}, ` +
              `${Profile?.state?.name || Profile?.state}, ` +
              `${Profile?.city?.name || Profile?.city}`
            }
            isAddEdu={false}
          />
        </>
      ) : (
        <>
          <UserDetail label="Email" value={Profile?.email} isAddEdu={false} />
          <UserDetail label="Phone" value={Profile?.phone} isAddEdu={false} />
          <UserDetail
            label="Experience"
            value={Profile?.experience_level}
            isAddEdu={false}
          />
          <UserDetail
            label="Location"
            value={
              `${Profile?.country?.name || Profile?.country}, ` +
              `${Profile?.state?.name || Profile?.state}, ` +
              `${Profile?.city?.name || Profile?.city}`
            }
            isAddEdu={false}
          />
          <UserDetail
            label="Location"
            value={Profile?.address}
            isAddEdu={false}
          />
          <UserDetail
            label="Ethnicity"
            value={Profile?.ethnicity?.name}
            isAddEdu={false}
          />
          <UserDetail
            label="Skills"
            value={
              Array.isArray(Profile?.skills) ? Profile.skills.join(", ") : ""
            }
          />
        </>
      )}

      {pathName.includes("applicant") && (
        <Box className={styles.EducationDetailContainer}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <Typography>Education</Typography>
            <AddIcon onClick={handleAddEducation} />
          </Box>
          {Profile?.educations?.map((el, index) => (
            <Box key={index} className={styles.EducationDetailContainer}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  gap: 1,
                }}
              >
                <DeleteForever
                  onClick={() => handleDelete(el.id)}
                  sx={{ cursor: "pointer" }}
                />
                <Edit
                  onClick={() => handleEdit(el, el.id)}
                  sx={{ cursor: "pointer" }}
                />
              </Box>
              <UserDetail label="Degree" value={el?.degree} isAddEdu={true} />
              <UserDetail
                label="Field of Study"
                value={el?.field_of_study}
                isAddEdu={true}
              />
              <UserDetail
                label="Start Date"
                value={el?.start_date}
                isAddEdu={true}
              />
              <UserDetail
                label="End Date"
                value={el?.end_date}
                isAddEdu={true}
              />
              <UserDetail label="Grade" value={el?.grade} isAddEdu={true} />
              <UserDetail
                label="Graduate"
                value={el?.is_continue ? "Yes" : "No"}
                isAddEdu={true}
              />
            </Box>
          ))}
        </Box>
      )}

      <Typography
        sx={{
          fontSize: { xs: "16px", sm: "16px", md: "18px" },
          fontWeight: 600,
          lineHeight: { xs: "25px", sm: "30px", md: "24px" },
          color: "#00305B",
          mb: "5px",
        }}
      >
        About
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "10px", sm: "14px", md: "16px" },
          lineHeight: { xs: "19px", sm: "22px", md: "25px" },
          fontWeight: 500,
          color: "#222222",
          boxShadow: "0px 0px 3px #00000040",
          padding: "18px 20px",
          borderRadius: "10px",
        }}
      >
        {Profile?.about ? Profile?.about : "No About Found For This Profile"}
      </Typography>

      {/* === UPDATED: Dynamic Subscription Plan Display === */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#FFF",
          border: "none",
          outline: "none",
          width: "100%",
          mb: "20px",
          mt: "20px",
          boxShadow: "0px 0px 3px #00000040",
          padding: "18px 20px",
          borderRadius: "10px",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "10px", sm: "14px", md: "16px" },
            lineHeight: { xs: "19px", sm: "22px", md: "25px" },
            fontWeight: 500,
            color: "#222222",
            "@media (max-width: 340px)": {
              fontSize: "9px",
              lineHeight: "19px",
            },
          }}
        >
          Subscription Plan:
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={subscriptionInfo.plan}
            size="small"
            sx={{
              backgroundColor: subColors.bg,
              color: subColors.text,
              fontWeight: 600,
              fontSize: { xs: "10px", sm: "12px", md: "14px" },
            }}
          />
          {subscriptionInfo.isOnTrial && subscriptionInfo.daysRemaining > 0 && (
            <Typography
              sx={{
                fontSize: { xs: "9px", sm: "11px", md: "12px" },
                color: "#d97706",
                fontWeight: 500,
              }}
            >
              ({subscriptionInfo.daysRemaining} days left)
            </Typography>
          )}
        </Box>
      </Box>

      {/* === NEW: Upgrade button for own profile === */}
      {isMyProfile && (subscriptionInfo.plan === "Freemium" || subscriptionInfo.plan === "30-days trial" || subscriptionInfo.plan === "Expired") && (
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => router.push("/pricing")}
            sx={{
              backgroundColor: "#189e33ff",
              color: "#fff",
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#147c2cff",
              },
            }}
          >
            {subscriptionInfo.plan === "Expired" ? "Renew Subscription" : "Upgrade Plan"}
          </Button>
        </Box>
      )}

      {isMyProfile && (
        <Box sx={{ mt: 3 }}>
          <Typography
            sx={{
              fontSize: { xs: "16px", sm: "16px", md: "18px" },
              fontWeight: 600,
              lineHeight: { xs: "25px", sm: "30px", md: "24px" },
              color: "#00305B",
              justifyContent: "flex-start",
            }}
          >
            Resume
          </Typography>
          <ResumeTab selectedResume={selectedResume} resumeId={""} />
        </Box>
      )}

      {!isMyProfile ? (
        Profile?.followings?.length <= 0 ? (
          <>
            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "16px", md: "18px" },
                fontWeight: 600,
                lineHeight: { xs: "25px", sm: "30px", md: "24px" },
                color: "#00305B",
                mb: "5px",
                mt: "30px",
              }}
            >
              Followings
            </Typography>
            <Typography className={styles.about}>
              No Followings Found For This Profile
            </Typography>
          </>
        ) : (
          <>
            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "16px", md: "18px" },
                fontWeight: 600,
                lineHeight: { xs: "25px", sm: "30px", md: "24px" },
                color: "#00305B",
                mb: "5px",
                mt: "30px",
              }}
            >
              Followings
            </Typography>
            <Following data={Profile?.followings} />
          </>
        )
      ) : (
        <FollowersTabs
          followers={Profile?.followers}
          following={Profile?.followings}
        />
      )}
      <RalliModal
        onClick={handleSubmitEducation}
        open={isModalOpen}
        onClose={handleCloseModal}
        buttonLabel={`${isEdit ? "Update" : "Add"} `}
        data={EDU_INFO_CRUD}
        educationErrors={educationErrors}
        setEducationErrors={setEducationErrors}
        educationFields={educationFields}
        setEducationFields={setEducationFields}
        handleBack={handleBack}
      />
    </Box>
  );
};

export default ProfileView;