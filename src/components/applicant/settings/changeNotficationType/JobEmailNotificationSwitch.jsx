import React, { useEffect, useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  CHANGE_SETTING,
  GET_SETTINGS,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const JobEmailNotificationSwitch = () => {
  const label = { inputProps: { "aria-label": "Job email notification switch" } };
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getJobEmailNotificationSetting();
  }, []);

  const getJobEmailNotificationSetting = async () => {
    try {
      const response = await apiInstance.get(GET_SETTINGS);
      if (response.status === 200 || response.status === 201) {
        const settings = response.data.data.setting;
        // Check if job_email_notification setting exists in the notification data
        const jobEmailNotification = settings?.data?.job_email_notification ?? false;
        setChecked(jobEmailNotification);
      }
    } catch (error) {
      console.error("Error fetching job email notification settings:", error);
    }
  };

  const onToggle = async (isEnabled) => {
    // First, get current notification settings to preserve is_enable
    let currentIsEnable = true;
    try {
      const currentSettings = await apiInstance.get(GET_SETTINGS);
      if (currentSettings.status === 200 || currentSettings.status === 201) {
        currentIsEnable = currentSettings.data.data.setting?.data?.is_enable ?? true;
      }
    } catch (error) {
      console.error("Error fetching current settings:", error);
    }

    const object = {
      type: "notification",
      data: {
        is_enable: currentIsEnable, // Keep current notification setting
        job_email_notification: isEnabled, // Update job email notification
      },
    };

    setLoading(true);
    try {
      const response = await apiInstance.post(CHANGE_SETTING, object);
      if (response.status === 200 || response.status === 201) {
        setChecked(isEnabled);
        Toast("success", response.data.message || "Email notification preference updated");
      }
    } catch (error) {
      console.error("Error updating job email notification setting:", error);
      Toast("error", "Failed to update setting. Please try again.");
      // Revert the toggle if the API call fails
      setChecked(!isEnabled);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        boxShadow: "0px 0px 3px #00000040",
        border: "none",
        outline: "none",
        padding: "18px 20px",
        borderRadius: "10px",
        fontSize: "16px",
        fontWeight: 300,
        lineHeight: "18px",
        color: "#222222",
        my: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "17px", md: "20px" },
              fontWeight: 600,
              lineHeight: "18px",
              color: "#00305B",
              textTransform: "capitalize",
            }}
          >
            Email Notifications for Matching Jobs
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "12px", sm: "14px", md: "16px" },
              fontWeight: 400,
              lineHeight: "20px",
              color: "#666",
              mt: 0.5,
            }}
          >
            Receive email notifications when new jobs match your preferences
          </Typography>
        </Box>
        <Switch
          {...label}
          checked={checked}
          disabled={loading}
          onChange={(event) => {
            const isEnabled = event.target.checked;
            setChecked(isEnabled);
            onToggle(isEnabled);
          }}
          sx={{
            color: "#189e33ff",
          }}
        />
      </Box>
    </Box>
  );
};

export default JobEmailNotificationSwitch;
