"use client";
import React, { useEffect, useState } from "react";
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
import { countryToCurrency } from "@/constant/applicant/countryCurrency/countryCurrency";

const JobsCardDetails = ({ data, ApplyNow, OnSave }) => {
  const { userData } = useSelector((state) => state.auth);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userCountry, setUserCountry] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [convertedSalary, setConvertedSalary] = useState(null);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  // Detect RapidAPI / external jobs
  const isRapid = data?.external_source === "rapidapi" || data?.source === "jsearch" || data?.job_id;

  // Format salary
  const addCommaToString = (num) => {
    if (num === null || num === undefined) return "";
    const parts = num.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
  };

  // Clean country name
  const cleanCountryName = (country) =>
    country?.replace(/\s*\(.*?\)\s*/g, "").trim();

  // Get user country via geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          const locData = await res.json();
          setUserCountry(cleanCountryName(locData.countryName));
        } catch (err) {
          console.error("Failed to fetch country:", err);
        }
      },
      (error) => console.error("User denied location access:", error)
    );
  }, []);

  // Convert salary to local currency
  useEffect(() => {
    if (!userCountry || !data) return;

    const fetchRate = async () => {
      try {
        const currencyCode = countryToCurrency[userCountry];
        if (!currencyCode) return;

        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/818177da10bc162069a91e5b/latest/USD`
        );
        const result = await res.json();

        if (result.result === "success") {
          const rate = result.conversion_rates[currencyCode];
          setExchangeRate(rate);

          const salaryValue = isRapid
            ? data.job_min_salary || data.job_max_salary || 0
            : data.salary;

          const converted = Math.round(salaryValue * rate);
          setConvertedSalary(converted);
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      }
    };

    fetchRate();
  }, [userCountry, data]);

  // Employer actions (backend only)
  const onApplicationClick = () => {
    if (!isRapid && userData.user.type === "employer" && data?.isMyjob) {
      const encodedId = encode(data?.id);
      router.push(`/employer/dashboard/${encodedId}`);
    }
  };
  const onEdit = () => {
    if (!isRapid && userData.user.type === "employer" && data?.isMyjob) {
      const encodedId = encode(data?.id);
      router.push(`/employer/my-posts/form/${encodedId}`);
    }
  };
  const onDelete = () => {
    if (!isRapid && userData.user.type === "employer" && data?.isMyjob) {
      setIsConfirmModalOpen(true);
    }
  };
  const onDeleteConfirm = async () => {
    if (!isRapid && userData.user.type === "employer" && data?.isMyjob) {
      await apiInstance.delete(`${EMPLOYER_CRUD_JOBS}/${data?.id}`);
      router.push(`/employer/my-posts`);
    }
  };
  const onEmployerClick = () => {
    if (isRapid) return;
    const encodedId = encode(data?.employer?.id);
    router.push(`/profile/${encodedId}`);
  };

  // Apply Now button
  const handleApplyClick = () => {
    if (isRapid && data?.job_apply_link) {
      window.open(data.job_apply_link, "_blank");
      return;
    }
    ApplyNow(data);
  };

  // Display values normalized
  const displayTitle = isRapid ? data.job_title : data?.title;
  const displayEmployer = isRapid ? data.employer_name : data?.employer?.username;
  const displayCategory = isRapid ? data.job_employment_type : data?.category?.name;
  const displayCountry = isRapid ? data.job_country : data?.country?.name;
  const displayCity = isRapid ? data.job_city : data?.city?.name;
  const displayDescription = isRapid ? data.job_description : data?.description;
  const displayDeadline = isRapid ? "N/A" : dayjs(data?.deadline).format("MM-DD-YYYY");
  const displaySkills = isRapid
    ? data.job_highlights?.Qualifications || []
    : data?.skills?.map((s) => s.name) || [];
  const displaySalaryCurrency = isRapid
    ? data?.job_salary_currency || "USD"
    : data?.salary_currency;
  const displaySalary = isRapid
    ? data?.job_min_salary || data?.job_max_salary || null
    : data?.salary;

  return (
    <>
      <Box sx={styles.applyNowSection}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={styles.heading}>{displayTitle}</Typography>

          {!isRapid && data?.isMyjob && (
            <Typography sx={styles.applicationCount} onClick={onApplicationClick}>
              {data?.applications_count} Application
            </Typography>
          )}
        </Box>

        {userData?.user?.type === "applicant" && (
          <Box sx={{ py: "10px", display: "flex", gap: 2 }}>
            <Button sx={styles.companyName} onClick={onEmployerClick} disabled={isRapid}>
              {displayEmployer}
              {!isRapid && <ArrowOutwardIcon sx={styles.arrowIcon} />}
            </Button>
            <Button
              onClick={handleApplyClick}
              sx={styles.applyButton}
              disabled={!isRapid && (data?.is_applied || data?.is_closed || data?.deadline < today)}
            >
              {isRapid ? "StepOut Now (External Job Link)" : "StepIn Now"}
            </Button>
            {!isRapid && (
              <Button
                onClick={() => OnSave(data?.id)}
                sx={{
                  ...styles.applyButton,
                  backgroundColor: data?.is_saved ? "#00305B" : "#189e33ff",
                }}
              >
                {data?.is_saved ? "Unsave Job" : "Save Job"}
              </Button>
            )}
          </Box>
        )}

        {!isRapid && userData?.user?.type === "employer" && data?.isMyjob && (
          <Box sx={{ py: "10px", display: "flex", gap: 2 }}>
            <Button sx={styles.applyButton} onClick={onEdit}>
              Edit
            </Button>
            <Button sx={styles.applyButton} onClick={onDelete}>
              Delete
            </Button>
          </Box>
        )}

        {!isRapid && data?.is_applied && userData?.user?.type !== "employer" && (
          <Typography sx={styles.actionText}>You Have Applied On This Job</Typography>
        )}
        {!isRapid && data?.is_closed && userData?.user?.type !== "employer" && (
          <Typography sx={styles.actionText}>Position Fulfilled</Typography>
        )}
        {!isRapid && data?.deadline < today && userData.user.type !== "employer" && (
          <Typography sx={styles.actionText}>No Longer Accepting Applications</Typography>
        )}
      </Box>

      {/* DETAILS SECTION */}
      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Job Details</Typography>

        <Box sx={styles.detailRow}><WorkIcon sx={styles.icon} /><Typography>{displayCategory}</Typography></Box>
        <Box sx={styles.detailRow}><FlagIcon sx={styles.icon} /><Typography>{displayCountry}</Typography></Box>
        <Box sx={styles.detailRow}><HomeIcon sx={styles.icon} /><Typography>{data?.address || "N/A"}</Typography></Box>
        <Box sx={styles.detailRow}><LocationCityIcon sx={styles.icon} /><Typography>{displayCity}</Typography></Box>
        <Box sx={styles.detailRow}><AccessTimeIcon sx={styles.icon} /><Typography>Deadline: {displayDeadline}</Typography></Box>
        <Box sx={styles.detailRow}><HourglassFullIcon sx={styles.icon} /><Typography>Experience: {isRapid ? "Not Specified" : `${data?.experience} years`}</Typography></Box>
        <Box sx={styles.detailRow}><HomeWorkIcon sx={styles.icon} /><Typography>Job Type: {displayCategory}</Typography></Box>
        <Box sx={styles.detailRow}><MonetizationOnIcon sx={styles.icon} /><Typography>Salary: {displaySalaryCurrency} {addCommaToString(displaySalary)}{convertedSalary && ` (~${addCommaToString(convertedSalary.toFixed(2))} ${countryToCurrency[userCountry]})`}</Typography></Box>
      </Box>

      {/* DESCRIPTION */}
      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Description</Typography>
        <Typography sx={styles.description}>{displayDescription}</Typography>
      </Box>

      {/* SKILLS */}
      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Required Skills</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {displaySkills.map((skill, index) => <JobTypeTab key={index} label={skill} />)}
        </Box>
      </Box>

      {!isRapid && userData.user?.type === "employer" && data?.isMyjob && (
        <ConfirmModal
          open={isConfirmModalOpen}
          title="Are you sure you want to delete this job?"
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={onDeleteConfirm}
        />
      )}
    </>
  );
};

const styles = {
  applyNowSection: { my: 2, borderRadius: "10px", px: "25px", py: 3, boxShadow: "0px 1px 5px #00000040" },
  heading: { fontSize: "20px", fontWeight: 600 },
  applicationCount: { color: "#189e33ff", fontWeight: 500, cursor: "pointer" },
  companyName: { color: "#00305B", fontWeight: 500, textTransform: "none" },
  arrowIcon: { fontSize: "18px", marginLeft: "5px" },
  applyButton: { backgroundColor: "#189e33ff", color: "#fff", fontWeight: 600, textTransform: "none", "&:hover": { backgroundColor: "#126b24ff" } },
  actionText: { fontSize: "14px", fontWeight: 500, color: "#189e33ff", mt: 1 },
  detailsSection: { my: 3, borderRadius: "10px", px: "25px", py: 3, boxShadow: "0px 1px 5px #00000040" },
  sectionHeading: { fontSize: "18px", fontWeight: 600, mb: 2 },
  detailRow: { display: "flex", alignItems: "center", mb: 1 },
  icon: { fontSize: "20px", marginRight: "10px", color: "#00305B" },
  description: { fontSize: "15px", lineHeight: "1.6", color: "#555" },
};

export default JobsCardDetails;
