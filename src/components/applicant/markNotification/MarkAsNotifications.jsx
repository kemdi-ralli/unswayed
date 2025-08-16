import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  GET_NOTIFICATIONS,
  MARK_READ_NOTIFICATION,
} from "@/services/apiService/apiEndPoints";
import { echo } from "@/helper/webSockets";
import { usePathname, useRouter } from "next/navigation";
import { encode } from "@/helper/GeneralHelpers";
import { useSelector, useDispatch } from "react-redux";
import { setType } from "@/redux/slices/NotificationSlice";

const MarkAsNotifications = ({ data }) => {
  const [Notifications, setNotifications] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const pathName = usePathname()
  const dispatch = useDispatch()
  const router = useRouter()
  const navigate = (item) => {
    if (item.type === "follow") {
      const encodedId = encode(item?.data?.user_id);
      router.push(`/profile/${encodedId}`);
    } else {
      const encodedId = encode(item?.data?.application_id)
      if (pathName.includes("employer")) {
        router.push(`/employer/dashboard/application/${encodedId}`)
      } else {
        router.push(`/applicant/dashboard/application/${encodedId}`)
      }
    }
  }
  const GetNotifications = async () => {
    const response = await apiInstance.get(`${GET_NOTIFICATIONS}`);
    if (response.status === 200 || response.status === 201) {
      setNotifications(response.data.data.notifications);
    }
  };

  const MarkAsRead = async (id) => {
    const response = await apiInstance.get(
      `${MARK_READ_NOTIFICATION}/${id}/read`
    );
    if (response.status === 200 || response.status === 201) {
      setNotifications((prevNotification) =>
        prevNotification.map((el) => {
          if (el.id === response?.data?.data?.notification?.id) {
            el = response.data.data.notification;
          }
          return el;
        })
      );
    }
  };

  useEffect(() => {
    GetNotifications();
  }, []);

  useEffect(() => {
    if (!userData?.user?.id) return;
    const channel = echo.channel(`ralli.notification.${userData.user.id}`);
    channel.listen("NotificationReceived", (event) => {
      const { notification } = event;
      setNotifications((prevNotification) => [
        notification,
        ...prevNotification,
      ]);
    });

    return () => {
      echo.leaveChannel(`ralli.notification.${userData.user.id}`);
    };
  }, []);

  useEffect(() => {
     dispatch(setType({ isNotification: false }));
  }, [dispatch]);
  return (
    <Box>
      {Notifications?.map((item, index) => {
        const formatted = new Date(item?.created_at);

        return (
          <Box
            key={index}
            sx={{
              //   backgroundColor: item?.id === ids ? "#00305B" : "",
              border: "0.6px solid #0000004D",
              borderRadius: "10px",
              p: 2,
              my: 2,
              cursor: "pointer",
              backgroundColor: item.is_read ? "#FFFFFFFF" : "#d1d1d1",
            }}
            onClick={() => navigate(item)}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "18px", md: "22px", lg: "26px" },
                  lineHeight: { xs: "14px", md: "18px" },
                  color: "#00305B",
                  fontWeight: 700,
                  py: 1,
                }}
              >
                {item?.title}
              </Typography>
              {!item.is_read && 
                <Typography
                  sx={{
                    color: "#FE4D82",
                    fontSize: { xs: "9px", sm: "10px", md: "14px", lg: "16px" },
                    lineHeight: { xs: "14px", md: "18px" },
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                  onClick={() => MarkAsRead(item?.id)}
                >
                  Mark As Read
                </Typography>
              }
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "9px", sm: "12px", md: "14px", lg: "16px" },
                lineHeight: { xs: "20px", md: "25px" },
                fontWeight: 400,
                py: 1,
              }}
            >
              {item?.description}
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 4,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "9px", sm: "12px", md: "14px", lg: "16px" },
                    lineHeight: { xs: "20px", md: "25px" },
                  }}
                >
                  Date:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "9px", sm: "12px", md: "14px", lg: "16px" },
                    lineHeight: { xs: "20px", md: "25px" },
                  }}
                >
                  {formatted.toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "9px", sm: "12px", md: "14px", lg: "16px" },
                    lineHeight: { xs: "20px", md: "25px" },
                  }}
                >
                  Time:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: { xs: "9px", sm: "12px", md: "14px", lg: "16px" },
                    lineHeight: { xs: "20px", md: "25px" },
                  }}
                >
                  {formatted.toLocaleTimeString()}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default MarkAsNotifications;
