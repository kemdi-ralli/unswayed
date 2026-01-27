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
import PeopleIcon from "@mui/icons-material/People";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import LinkIcon from "@mui/icons-material/Link";
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

  // Detect external jobs from backend
  const isExternal = data?.type === "external" || data?.job_kind === "external" || data?._source === "external";

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

          const salaryValue = data.salary || 0;

          const converted = Math.round(salaryValue * rate);
          setConvertedSalary(converted);
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      }
    };

    fetchRate();
  }, [userCountry, data]);

  // Employer actions (internal jobs only)
  const onApplicationClick = () => {
    if (!isExternal && userData.user.type === "employer" && data?.isMyjob) {
      const encodedId = encode(data?.id);
      router.push(`/employer/dashboard/${encodedId}`);
    }
  };
  const onEdit = () => {
    if (!isExternal && userData.user.type === "employer" && data?.isMyjob) {
      const encodedId = encode(data?.id);
      router.push(`/employer/my-posts/form/${encodedId}`);
    }
  };
  const onDelete = () => {
    if (!isExternal && userData.user.type === "employer" && data?.isMyjob) {
      setIsConfirmModalOpen(true);
    }
  };
  const onDeleteConfirm = async () => {
    if (!isExternal && userData.user.type === "employer" && data?.isMyjob) {
      await apiInstance.delete(`${EMPLOYER_CRUD_JOBS}/${data?.id}`);
      router.push(`/employer/my-posts`);
    }
  };
  const onEmployerClick = () => {
    if (isExternal) return;
    const encodedId = encode(data?.employer?.id);
    router.push(`/profile/${encodedId}`);
  };

  // Apply Now button
  const handleApplyClick = () => {
    if (isExternal && data?.job_apply_link) {
      window.open(data.job_apply_link, "_blank", "noopener,noreferrer");
      return;
    }
    if (ApplyNow) {
      ApplyNow(data);
    }
  };

  // Display values normalized
  const displayTitle = data?.title || "Untitled";
  const displayEmployer = isExternal ? (data?.employer_name || "External Employer") : data?.employer?.username;
  const displayCategory = data?.category?.name || data?.job_categories?.[0]?.name || data?.job_employment_type || "N/A";
  const displayCountry = data?.country?.name || data?.job_country || "N/A";
  const displayCity = data?.city?.name || data?.cities?.[0]?.name || data?.job_city || "N/A";
  const displayStates = data?.states?.map((s) => s.name).join(", ") || "N/A";
  const displayDescription = data?.description || data?.job_description || "";
  const displayDeadline = isExternal ? "N/A" : (data?.deadline ? dayjs(data.deadline).format("MM-DD-YYYY") : "N/A");
  // Handle skills - can be array of objects with name property or array of strings
  const displaySkills = (() => {
    if (!data?.skills || !Array.isArray(data.skills)) return [];
    return data.skills.map((s) => {
      if (typeof s === "string") return s;
      if (typeof s === "object" && s !== null) {
        return s.name || s.title || s.skill || String(s);
      }
      return String(s);
    }).filter(Boolean);
  })();
  const displaySalaryCurrency = data?.salary_currency || "USD";
  const displaySalary = data?.salary || null;
  const displaySalaryMax = data?.salary_max || null;
  const displaySalaryPeriod = data?.salary_period || "Per Month";
  const displayNoOfPositions = data?.no_of_positions || "N/A";
  const displayJobTypes = data?.job_types?.map((t) => t.name).join(", ") || data?.job_type?.name || "N/A";
  const displayJobLocations = data?.job_locations?.map((l) => l.name).join(", ") || data?.job_location?.name || "N/A";
  const displayJobShifts = data?.job_shifts?.map((s) => s.name).join(", ") || data?.job_shift?.name || "N/A";
  const displayJobShiftTiming = data?.job_shift_timing?.name || data?.job_shift_timing || "N/A";
  const displayRequirements = data?.requirements || "";
  const displayCompanyAbout = data?.company_about || "";
  const displayCompanyBenefits = data?.company_benefits || "";
  const displayJobApplyLink = data?.job_apply_link || "";

  return (
    <>
      <Box sx={styles.applyNowSection}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={styles.heading}>{displayTitle}</Typography>

          {!isExternal && data?.isMyjob && (
            <Typography sx={styles.applicationCount} onClick={onApplicationClick}>
              {data?.applications_count} Application
            </Typography>
          )}
        </Box>

        {userData?.user?.type === "applicant" && (
          <Box sx={{ py: "10px", display: "flex", gap: 2 }}>
            <Button sx={styles.companyName} onClick={onEmployerClick} disabled={isExternal}>
              {displayEmployer}
              {!isExternal && <ArrowOutwardIcon sx={styles.arrowIcon} />}
            </Button>
            <Button
              onClick={handleApplyClick}
              sx={styles.applyButton}
              disabled={!isExternal && (data?.is_applied || data?.is_closed || data?.deadline < today)}
            >
              {isExternal ? "StepOut Now (External Job)" : "StepIn Now"}
            </Button>
            {!isExternal && (
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

        {!isExternal && userData?.user?.type === "employer" && data?.isMyjob && (
          <Box sx={{ py: "10px", display: "flex", gap: 2 }}>
            <Button sx={styles.applyButton} onClick={onEdit}>
              Edit
            </Button>
            <Button sx={styles.applyButton} onClick={onDelete}>
              Delete
            </Button>
          </Box>
        )}

        {!isExternal && data?.is_applied && userData?.user?.type !== "employer" && (
          <Typography sx={styles.actionText}>You Have Applied On This Job</Typography>
        )}
        {!isExternal && data?.is_closed && userData?.user?.type !== "employer" && (
          <Typography sx={styles.actionText}>Position Fulfilled</Typography>
        )}
        {!isExternal && data?.deadline < today && userData.user.type !== "employer" && (
          <Typography sx={styles.actionText}>No Longer Accepting Applications</Typography>
        )}
      </Box>

      {/* DETAILS SECTION */}
      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Job Details</Typography>

        <Box sx={styles.detailRow}><WorkIcon sx={styles.icon} /><Typography><strong>Category:</strong> {displayCategory}</Typography></Box>
        <Box sx={styles.detailRow}><PeopleIcon sx={styles.icon} /><Typography><strong>Number of Positions:</strong> {displayNoOfPositions}</Typography></Box>
        <Box sx={styles.detailRow}><BusinessCenterIcon sx={styles.icon} /><Typography><strong>Job Types:</strong> {displayJobTypes}</Typography></Box>
        <Box sx={styles.detailRow}><HomeWorkIcon sx={styles.icon} /><Typography><strong>Job Locations:</strong> {displayJobLocations}</Typography></Box>
        <Box sx={styles.detailRow}><ScheduleIcon sx={styles.icon} /><Typography><strong>Job Shifts:</strong> {displayJobShifts}</Typography></Box>
        {displayJobShiftTiming !== "N/A" && (
          <Box sx={styles.detailRow}><ScheduleIcon sx={styles.icon} /><Typography><strong>Shift Timing:</strong> {displayJobShiftTiming}</Typography></Box>
        )}
        <Box sx={styles.detailRow}><HourglassFullIcon sx={styles.icon} /><Typography><strong>Experience Level:</strong> {data?.experience_level ? data.experience_level.charAt(0).toUpperCase() + data.experience_level.slice(1) : (data?.experience ? `${data.experience} years` : "Not Specified")}</Typography></Box>
        <Box sx={styles.detailRow}><FlagIcon sx={styles.icon} /><Typography><strong>Country:</strong> {displayCountry}</Typography></Box>
        {displayStates !== "N/A" && (
          <Box sx={styles.detailRow}><LocationCityIcon sx={styles.icon} /><Typography><strong>States:</strong> {displayStates}</Typography></Box>
        )}
        <Box sx={styles.detailRow}><LocationCityIcon sx={styles.icon} /><Typography><strong>City:</strong> {displayCity}</Typography></Box>
        {data?.address && (
          <Box sx={styles.detailRow}><HomeIcon sx={styles.icon} /><Typography><strong>Address:</strong> {data.address}</Typography></Box>
        )}
        <Box sx={styles.detailRow}><AccessTimeIcon sx={styles.icon} /><Typography><strong>Deadline:</strong> {displayDeadline}</Typography></Box>
        <Box sx={styles.detailRow}><MonetizationOnIcon sx={styles.icon} /><Typography>
          <strong>Salary:</strong> {displaySalaryCurrency} {addCommaToString(displaySalary)}
          {displaySalaryMax && ` - ${addCommaToString(displaySalaryMax)}`}
          {` ${displaySalaryPeriod}`}
          {convertedSalary && ` (~${addCommaToString(convertedSalary.toFixed(2))} ${countryToCurrency[userCountry]})`}
        </Typography></Box>
        {isExternal && displayJobApplyLink && (
          <Box sx={styles.detailRow}>
            <LinkIcon sx={styles.icon} />
            <Typography>
              <strong>Application Link:</strong>{" "}
              <a href={displayJobApplyLink} target="_blank" rel="noopener noreferrer" style={{ color: "#189e33ff", textDecoration: "underline" }}>
                {displayJobApplyLink}
              </a>
            </Typography>
          </Box>
        )}
      </Box>

      {/* DESCRIPTION */}
      <Box sx={styles.detailsSection}>
        <Typography sx={styles.sectionHeading}>Description</Typography>
        <Typography sx={styles.description}>{displayDescription}</Typography>
      </Box>

      {/* REQUIREMENTS */}
      {displayRequirements && (
        <Box sx={styles.detailsSection}>
          <Typography sx={styles.sectionHeading}>Requirements</Typography>
          <Typography sx={styles.description}>{displayRequirements}</Typography>
        </Box>
      )}

      {/* SKILLS */}
      {displaySkills.length > 0 && (
        <Box sx={styles.detailsSection}>
          <Typography sx={styles.sectionHeading}>Required Skills</Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {displaySkills.map((skill, index) => <JobTypeTab key={index} label={skill} />)}
          </Box>
        </Box>
      )}

      {/* COMPANY ABOUT */}
      {displayCompanyAbout && (
        <Box sx={styles.detailsSection}>
          <Typography sx={styles.sectionHeading}>About the Company</Typography>
          <Typography sx={styles.description}>{displayCompanyAbout}</Typography>
        </Box>
      )}

      {/* COMPANY BENEFITS */}
      {displayCompanyBenefits && (
        <Box sx={styles.detailsSection}>
          <Typography sx={styles.sectionHeading}>Company Benefits</Typography>
          <Typography sx={styles.description}>{displayCompanyBenefits}</Typography>
        </Box>
      )}

      {!isExternal && userData.user?.type === "employer" && data?.isMyjob && (
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
