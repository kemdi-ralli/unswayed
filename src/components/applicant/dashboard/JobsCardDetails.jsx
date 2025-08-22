import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import FlagIcon from "@mui/icons-material/Flag";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import JobTypeTab from "./JobTypeTab";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { encode } from "@/helper/GeneralHelpers";
import { useRouter } from "next/navigation";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { EMPLOYER_CRUD_JOBS } from "@/services/apiService/apiEndPoints";

const JobsCardDetails = ({ data, ApplyNow, OnSave }) => {
  const { userData } = useSelector((state) => state.auth);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter();

  const onApplicationClick = () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      var encodeId = encode(data?.id);
      router.push(`/employer/dashboard/${encodeId}`);
    }
    return;
  };

  const onEdit = () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      var encodeId = encode(data?.id);
      router.push(`/employer/my-posts/form/${encodeId}`);
    }
    return;
  };

  const onDelete = () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      setIsConfirmModalOpen(true);
    }
    return;
  };

  const onDeleteConfirm = async () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      const response = await apiInstance.delete(
        `${EMPLOYER_CRUD_JOBS}/${data?.id}`
      );
      if (response?.data?.status === "success") {
        router.push(`/employer/my-posts`);
      }
    }
    return;
  };

  const onDeleteCancle = () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      setIsConfirmModalOpen(false);
    }
    return;
  };

  const onEmployerClick = () => {
    const encodedId = encode(data?.employer?.id);
    router.push(`/profile/${encodedId}`);
  };

  return (
    <>
      <Box sx={styles.applyNowSection}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={styles.heading}>{data?.title}</Typography>
          {data?.isMyjob && (
            <Typography
              sx={styles.applicationCount}
              onClick={onApplicationClick}
            >
              {data?.applications_count} Application
            </Typography>
          )}
        </Box>

        {userData?.user?.type === "applicant" && (
          <Box sx={{ py: "10px", display: "flex", gap: 2 }}>
            <Button sx={styles.companyName} onClick={onEmployerClick}>
              {data?.employer?.username}
              <ArrowOutwardIcon sx={styles.arrowIcon} />
            </Button>
            <Button
              onClick={() => ApplyNow(data)}
              sx={styles.applyButton}
              disabled={
                data?.is_applied ||
                data?.is_closed ||
                dayjs(data?.deadline).isBefore(dayjs())
              }
            >
              Apply Now
            </Button>
            <Button
              onClick={() => OnSave(data?.id)}
              sx={{
                ...styles.applyButton,
                backgroundColor: data?.is_saved ? "#00305B" : "#189e33ff",
              }}
            >
              {data?.is_saved ? "Unsave Job" : "Save Job"}
            </Button>
          </Box>
        )}

        {userData?.user?.type === "employer" && data?.isMyjob && (
          <Box sx={{ py: "10px", display: "flex", gap: 2 }}>
            <Button sx={styles.applyButton} onClick={onEdit}>
              Edit
            </Button>
            <Button sx={styles.applyButton} onClick={onDelete}>
              Delete
            </Button>
          </Box>
        )}

        {data?.is_applied && userData?.user?.type !== "employer" && (
          <Typography sx={styles.actionText}>
            You Have Applied On This Job
          </Typography>
        )}
        {data?.is_closed && userData?.user?.type !== "employer" && (
          <Typography sx={styles.actionText}>Position FullFilled</Typography>
        )}
        {dayjs(data?.deadline).isBefore(dayjs()) &&
          userData.user.type !== "employer" && (
            <Typography sx={styles.actionText}>
              No Longer Accepting Applications
            </Typography>
          )}
      </Box>

      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Job Details</Typography>

        <Box sx={styles.detailRow}>
          <WorkIcon sx={styles.icon} />
          <Typography>{data?.category?.name}</Typography>
        </Box>

        <Box sx={styles.detailRow}>
          <FlagIcon sx={styles.icon} />
          <Typography>{data?.country?.name}</Typography>
        </Box>

        <Box sx={styles.detailRow}>
          <HomeIcon sx={styles.icon} />
          <Typography>{data?.address}</Typography>
        </Box>

        <Box sx={styles.detailRow}>
          <LocationCityIcon sx={styles.icon} />
          <Typography>{data?.city?.name}</Typography>
        </Box>

        <Box sx={styles.detailRow}>
          <AccessTimeIcon sx={styles.icon} />
          <Typography>
            Deadline: {dayjs(data?.deadline).format("DD MMM, YYYY")}
          </Typography>
        </Box>

        <Box sx={styles.detailRow}>
          <HourglassFullIcon sx={styles.icon} />
          <Typography>Experience: {data?.experience} years</Typography>
        </Box>

        <Box sx={styles.detailRow}>
          <HomeWorkIcon sx={styles.icon} />
          <Typography>Job Type: {data?.job_type?.name}</Typography>
        </Box>

        <Box sx={styles.detailRow}>
          <MonetizationOnIcon sx={styles.icon} />
          <Typography>Salary: {data?.salary}</Typography>
        </Box>
      </Box>

      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Description</Typography>
        <Typography sx={styles.description}>{data?.description}</Typography>
      </Box>

      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Required Skills</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {data?.skills?.map((skill, index) => (
            <JobTypeTab key={index} label={skill?.name} />
          ))}
        </Box>
      </Box>

      {userData.user.type === "employer" && data?.isMyjob && (
        <ConfirmModal
          open={isConfirmModalOpen}
          title="Are you sure you want to delete this job?"
          onClose={onDeleteCancle}
          onConfirm={onDeleteConfirm}
          onCancle={onDeleteCancle}
        />
      )}
    </>
  );
};

const styles = {
  applyNowSection: {
    my: 2,
    borderRadius: "10px",
    px: "25px",
    py: 3,
    boxShadow: "0px 1px 5px #00000040",
  },
  heading: {
    fontSize: "20px",
    fontWeight: 600,
  },
  applicationCount: {
    color: "#189e33ff",
    fontWeight: 500,
    cursor: "pointer",
  },
  companyName: {
    color: "#00305B",
    fontWeight: 500,
    textTransform: "none",
  },
  arrowIcon: {
    fontSize: "18px",
    marginLeft: "5px",
  },
  applyButton: {
    backgroundColor: "#189e33ff",
    color: "#fff",
    fontWeight: 600,
    textTransform: "none",
    "&:hover": { backgroundColor: "#126b24ff" },
  },
  actionText: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#189e33ff",
    mt: 1,
  },
  detailsSection: {
    my: 3,
    borderRadius: "10px",
    px: "25px",
    py: 3,
    boxShadow: "0px 1px 5px #00000040",
  },
  sectionHeading: {
    fontSize: "18px",
    fontWeight: 600,
    mb: 2,
  },
  detailRow: {
    display: "flex",
    alignItems: "center",
    mb: 1,
  },
  icon: {
    fontSize: "20px",
    marginRight: "10px",
    color: "#00305B",
  },
  description: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#555",
  },
};

export default JobsCardDetails;
