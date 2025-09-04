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

const addCommaToString = (num) => {
  if (num === null || num === undefined) return "";

  let str = num.toString();

  let [integerPart, decimalPart] = str.split(".");

  let result = "";
  let count = 0;

  for (let i = integerPart.length - 1; i >= 0; i--) {
    result = integerPart[i] + result;
    count++;

    if (count % 3 === 0 && i !== 0) {
      result = "," + result;
    }
  }

  return decimalPart ? `${result}.${decimalPart}` : result;
};


  const cleanCountryName = (country) =>
    country?.replace(/\s*\(.*?\)\s*/g, "").trim();

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

  // ✅ Get exchange rate once we know userCountry
  useEffect(() => {
    const fetchRate = async () => {
      if (!userCountry) return;

      try {
        const currencyCode = countryToCurrency[userCountry];
        if (!currencyCode) return;

        const url = `https://v6.exchangerate-api.com/v6/818177da10bc162069a91e5b/latest/USD`;
        const response = await fetch(url);
        const result = await response.json();

        if (
          result.result === "success" &&
          result.conversion_rates[currencyCode]
        ) {
          const rate = result.conversion_rates[currencyCode];
          setExchangeRate(rate);
          setConvertedSalary(Math.round(data?.salary * rate));
        }
      } catch (err) {
        console.error("Failed to fetch exchange rate:", err);
      }
    };

    fetchRate();
  }, [userCountry, data?.salary]);

  // === Job actions ===
  const onApplicationClick = () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      var encodeId = encode(data?.id);
      router.push(`/employer/dashboard/${encodeId}`);
    }
  };

  const onEdit = () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      var encodeId = encode(data?.id);
      router.push(`/employer/my-posts/form/${encodeId}`);
    }
  };

  const onDelete = () => {
    if (userData.user.type === "employer" && data?.isMyjob) {
      setIsConfirmModalOpen(true);
    }
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
  };

  const onDeleteCancle = () => {
    setIsConfirmModalOpen(false);
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
                data?.is_applied || data?.is_closed || data?.deadline < today
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
        {data?.deadline < today && userData.user.type !== "employer" && (
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
            Deadline: {dayjs(data?.deadline).format("MM-DD-YYYY")}
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
          <Typography>
            Salary: {data?.salary_currency} {addCommaToString(data?.salary)}
            {convertedSalary &&
              ` (~${addCommaToString(
                convertedSalary.toFixed(2)
              )} ${countryToCurrency[userCountry]})`}
          </Typography>
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
