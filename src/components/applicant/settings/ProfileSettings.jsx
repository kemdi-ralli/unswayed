"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { DEACTIVATE_ACCOUNT, LOGOUT } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useDispatch } from "react-redux";
import { clearUserDataLogout } from "@/redux/slices/authSlice";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { setSuccessMessage } from "@/redux/slices/deactivateMessageSlice";

const ProfileSettings = ({ data, profile }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleButtonClick = async (item) => {
    if (item.name === "signout") {
      try {
        const token = Cookie.get("token");
        if (!token) throw new Error("No authentication token found.");

        const response = await apiInstance.post(
          LOGOUT,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response?.data?.status === "success") {
          Cookie.remove("token");
          Cookie.remove("isVerified");
          Cookie.remove("userType");
          dispatch(clearUserDataLogout());
          router.push("/");
          Toast("success", response?.data?.message);
        } else {
          throw new Error(response?.data?.message || "Logout failed.");
        }
      } catch (error) {
        Toast("error", error?.response?.data?.message || "Failed to logout");
      }
    } else if (item.name === "deactivate") {
      setIsConfirmModalOpen(true);
    } else {
      router.push(item?.link);
    }
  };
  const handleDeactivateConfirm = async () => {
    try {
      const token = Cookie.get("token");
      if (!token) {
        Toast("error", "No authentication token found.");
        return;
      }
  
      const response = await apiInstance.post(
        DEACTIVATE_ACCOUNT,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response?.data?.status === "success") {
        Cookie.remove("token");
        Cookie.remove("isVerified");
        Cookie.remove("userType");

        dispatch(
          setSuccessMessage({
            message: response?.data?.message,
            showMessage: true,
          })
        );
  
        router.push("/");
      } else {
        throw new Error(response?.data?.message || "Deactivation failed.");
      }
    } catch (error) {
      Toast("error", error?.response?.data?.message || "Failed to deactivate account.");
    }
  };
  

  const handleDeleteCancle = () => {
    setIsConfirmModalOpen(false);
  };

  const filteredData = data.filter(
    (item) =>
      !profile ||
      profile?.provider === "manual" ||
      !["email", "password"].includes(item.name)
  );

  return (
    <Box>
      {filteredData.map((item) => {
        return (
          <Box
            key={item.name}
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
                flexDirection: "row",
                "@media (max-width: 520px)": {
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", sm: "17px", md: "20px" },
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "#00305B",
                    textAlign: { xs: "center", sm: "start" },
                  }}
                >
                  {item?.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", sm: "14px", md: "16px" },
                    fontWeight: 400,
                    lineHeight: "18px",
                    color: "#222222",
                    pb: { xs: "10px", md: "5px" },
                    pt: { xs: "0px", md: "5px" },
                    textAlign: { xs: "center", sm: "start" },
                  }}
                >
                  {(() => {
                    if (!profile) return item?.placeHolder || ""; 
                    if (item?.name === "email" && profile?.email)
                      return profile.email;
                    if (item?.name === "signout" && profile?.email)
                      return profile.email;
                    if (item?.name === "phone" && profile?.phone)
                      return profile.phone;
                    if (item?.name === "profile")
                      return [
                        profile?.first_name,
                        profile?.middle_name,
                        profile?.last_name,
                      ]
                        .filter(Boolean)
                        .join(" ");
                    return item?.placeHolder || "";
                  })()}
                </Typography>
              </Box>
              <Button
                sx={{
                  minWidth: { xs: "100%", sm: "222px" },
                  height: "46px",
                  borderRadius: "6px",
                  border: "1px solid #00305B",
                  fontSize: { xs: "9px", sm: "12px", md: "14px" },
                  fontWeight: 700,
                  lineHeight: "21px",
                  color: "#00305B",
                }}
                onClick={() => handleButtonClick(item)}
              >
                {item?.buttonLable}
              </Button>
              {/* {userData.user.type === "employer" && data?.isMyjob && ( */}
              <ConfirmModal
                open={isConfirmModalOpen}
                title="Are You Sure?"
                onClose={handleDeleteCancle}
                onConfirm={handleDeactivateConfirm}
                onCancle={handleDeleteCancle}
              />
              {/* )} */}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default ProfileSettings;
