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

const JobsCardDetails = ({ data, ApplyNow }) => {
  const { userData } = useSelector((state) => state.auth);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const router = useRouter();
  console.log(data, "data s");
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
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems:"center"}}>
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
        {/* <Box sx={{ display: "flex", alignItems: "center", py: 1 }}>
          <LocationOnRoundedIcon sx={{ width: "18px" }} />
          <Typography sx={styles.locationHeading}>Location</Typography>
          <Typography sx={styles.text}>
            {`${data?.country?.name || data?.country},`}
          </Typography>
          {data?.states?.map((item, index) => (
            <Typography
              key={item?.id || index}
              sx={{
                fontSize: "13px",
                fontWeight: 300,
                color: "#222222",
                px: 0.5,
                display: "inline",
              }}
            >
              {item?.name}
              {index < data.states.length - 1 && ", "}
            </Typography>
          ))}
        </Box> */}

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

      <Box sx={styles.JobDetailContainer}>
        <Box sx={styles.jobDetail}>
          {(data?.country?.name || data?.country) && (
            <JobTypeTab
              Icon={<FlagIcon sx={{ width: "20px", height: "20px" }} />}
              TypeLabel={"Country"}
              TypeDetail={data?.country?.name || data?.country}
            />
          )}
          {data?.states && (
            <JobTypeTab
              Icon={<HomeIcon sx={{ width: "20px", height: "20px" }} />}
              TypeLabel={"State"}
              TypeDetail={data?.states}
            />
          )}
          {data?.cities && (
            <JobTypeTab
              Icon={<LocationCityIcon sx={{ width: "20px", height: "20px" }} />}
              TypeLabel={"Cities"}
              TypeDetail={data?.cities}
            />
          )}
          {data?.experience_level && (
            <JobTypeTab
              Icon={<HomeWorkIcon sx={{ width: "20px", height: "20px" }} />}
              TypeLabel={"Experience"}
              TypeDetail={data?.experience_level}
            />
          )}
          {data?.job_categories && (
            <JobTypeTab
              Icon={<WorkIcon sx={{ width: "20px", height: "20px" }} />}
              TypeLabel={"Job categories"}
              TypeDetail={data?.job_categories}
            />
          )}
          {data?.job_locations && (
            <JobTypeTab
              Icon={<HomeWorkIcon sx={{ width: "20px", height: "20px" }} />}
              TypeLabel={"Job Locations"}
              TypeDetail={data?.job_locations}
            />
          )}
          {data?.job_types && (
            <JobTypeTab
              Icon={
                <HourglassFullIcon sx={{ width: "20px", height: "20px" }} />
              }
              TypeLabel={"Job Type"}
              TypeDetail={data?.job_types}
            />
          )}
          {data?.job_shifts && (
            <JobTypeTab
              Icon={<AccessTimeIcon sx={{ width: "20px", height: "20px" }} />}
              TypeLabel={"Job Shift"}
              TypeDetail={data?.job_shifts}
            />
          )}
          <JobTypeTab
            Icon={<MonetizationOnIcon sx={{ width: "20px", height: "20px" }} />}
            TypeLabel="Salary"
            TypeDetail={
              data?.salary && data?.salary_currency && data?.salary_period
                ? `${data.salary}, ${data.salary_currency}, ${data.salary_period}`
                : "Not Provided"
            }
          />
        </Box>
        <Box sx={styles.skillSection}>
          <Typography sx={styles.heading2}>Skills Required</Typography>
          <Box sx={styles.skillsContainer}>
            {data?.skills === null ? (
              <Typography sx={styles.skillText}>
                No Skills Were Added For This Job
              </Typography>
            ) : (
              data?.skills?.map((item, index) => (
                <Typography key={index} sx={styles.skillText}>
                  {item}
                </Typography>
              ))
            )}
          </Box>
        </Box>
        {data?.company_about && (
          <Box sx={{ borderBottom: "1px solid #0000004D" }}>
            <Box sx={{ my: 2, px: "15px", py: 1.5 }}>
              <Typography sx={styles.heading2}>About The Company</Typography>
              <Typography sx={styles.text}>{data?.company_about}</Typography>
            </Box>
          </Box>
        )}
        {data?.requirements && (
          <Box sx={{ borderBottom: "1px solid #0000004D" }}>
            <Box sx={{ my: 2, px: "15px", py: 1.5 }}>
              <Typography sx={styles.heading2}>Job Requirements</Typography>
              <Typography sx={styles.text}>{data?.requirements}</Typography>
            </Box>
          </Box>
        )}
        {data?.description && (
          <Box sx={{ borderBottom: "1px solid #0000004D" }}>
            <Box sx={{ my: 2, px: "15px", py: 1.5 }}>
              <Typography sx={styles.heading2}>Full Job Description</Typography>
              <Typography sx={styles.text}>{data?.description}</Typography>
            </Box>
          </Box>
        )}
        {data?.company_benefits && (
          <Box sx={{ borderBottom: "1px solid #0000004D" }}>
            <Box sx={{ my: 2, px: "15px", py: 1.5 }}>
              <Typography sx={styles.heading2}>Benefits</Typography>
              <Typography sx={styles.text}>{data?.company_benefits}</Typography>
            </Box>
          </Box>
        )}
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

  locationHeading: {
    fontSize: { xs: "12px", sm: "14px", md: "16px" },
    fontWeight: 500,
    lineHeight: "20px",
    color: "#00305B",
    pl: "5px",
    pr: "12px",
  },

  companyName: {
    backgroundColor: "#FDF7F7",
    border: "0.4px solid #0000004D",
    borderRadius: "6px",
    color: "#222222",
    fontSize: { xs: "11px", sm: "14px", md: "16px" },
    fontWeight: 400,
    lineHeight: { xs: "8px", sm: "16px", md: "18px" },
    textAlign: "center",
    p: "7px",
    py: { xs: "10px" },
  },

  arrowIcon: { fontSize: { xs: "12px", sm: "14px", md: "25px" } },

  applyButton: {
    width: { xs: "100px", sm: "120px", md: "150px" },
    height: { xs: "30px", sm: "40px", md: "50px" },
    backgroundColor: "#FE4D82",
    boxShadow: "0px 1px 5px #00000040",
    borderRadius: "6px",
    color: "#FFFFFF",
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
    fontWeight: 700,
    lineHeight: "18px",
    textAlign: "center",
    p: 1,
  },

  applicationCount: {
    borderRadius: "44px",
    backgroundColor: "#E3F6E6",
    fontSize: { xs: "9px", sm: "14px", md: "16px" },
    lineHeight: "18px",
    padding: "9px",
    color: "#111111",
    cursor: "pointer",
  },

  JobDetailContainer: {
    py: 2,
    px: "20px",
    borderRadius: "10px",
    boxShadow: "0px 1px 5px #00000040",
  },

  heading: {
    fontSize: { xs: "18px", sm: "21px", md: "24px" },
    fontWeight: 500,
    lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "20px" },
    color: "#111111",
    py: 1,
  },
  heading2: {
    fontSize: { xs: "14px", sm: "16px", md: "18px" },
    fontWeight: 700,
    lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "18px" },
    color: "#333333",
    py: 1,
  },
  skillSection: {
    px: "15px",
    py: 1,
    borderBottom: "1px solid  #00000040",
  },
  skillsContainer: {
    display: "flex",
    flexDirection: "row",
  },
  skillText: {
    mx: 0.5,
    my: 1,
    fontSize: { xs: "12px", sm: "14px", md: "15px" },
    fontWeight: 500,
    lineHeight: "16px",
    color: "#ffffffff",
    px: 1,
    py: 1,
    backgroundColor: "#00305B",
    width: "auto",
    textAlign: "center",
    borderRadius: "5px",
  },
  jobDetail: {
    py: 1,
    px: "15px",
  },
  text: {
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
    fontWeight: 300,
    color: "#333333",
  },

  actionText: {
    fontSize: { xs: "10px", sm: "12px", md: "14px" },
    fontWeight: 600,
    color: "#FE4D82",
  },
};

export default JobsCardDetails;
