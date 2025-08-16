import React, { useEffect, useState } from "react";
import { Box, Switch, Typography } from "@mui/material";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  CHANGE_SETTING,
  GET_SETTINGS,
} from "@/services/apiService/apiEndPoints";
import { useDispatch, useSelector } from "react-redux";
import { notificationSetting } from "@/redux/slices/NotificationSettingSlice";
import { Toast } from "@/components/Toast/Toast";

const AllowJobSearchNotificationSwitch = () => {
  const label = { inputProps: { "aria-label": "Color switch demo" } };
  const dispatch = useDispatch();
  const { notification } = useSelector((state) => state.getSetting);
  const [Checked, setChecked] = useState(notification);

  useEffect(() => {
    setChecked(notification);
  }, [notification]);

  const getNotificationSetting = async () => {
    try {
      const response = await apiInstance.get(GET_SETTINGS);
      if (response.status === 200 || response.status === 201) {
        const isEnabled = response.data.data.setting.data.is_enable;
        dispatch(notificationSetting(isEnabled));
        setChecked(isEnabled);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const onToggle = async (isEnabled) => {
    const object = {
      type: "notification_setting",
      data: {
        is_enable: isEnabled,
      },
    };

    try {
      const response = await apiInstance.post(CHANGE_SETTING, object);
      if (response.status === 200 || response.status === 201) {
        const updatedValue = response.data.data.setting.data.is_enable;
        dispatch(notificationSetting(updatedValue));
        setChecked(updatedValue);
        Toast("success", response.data.message);
      }
    } catch (error) {
      console.error("Error updating setting:", error);
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
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "17px", md: "20px" },
            fontWeight: 600,
            lineHeight: "18px",
            color: "#00305B",
            textTransform: "capitalize",
          }}
        >
          Allow Notifications
        </Typography>
        <Switch
          {...label}
          checked={Checked}
          onChange={(event) => {
            const isEnabled = event.target.checked;
            setChecked(isEnabled);
            onToggle(isEnabled);
          }}
          sx={{
            color: "#FE4D82",
          }}
        />
      </Box>
    </Box>
  );
};

export default AllowJobSearchNotificationSwitch;
