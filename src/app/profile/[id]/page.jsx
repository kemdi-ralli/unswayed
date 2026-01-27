"use client";
import ProfileView from "@/components/applicant/profile/ProfileView";
import { Box, Container, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  FOLLOW_USER,
  GET_SHORT_PROFILE,
  USER_PROFILE,
} from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import EmployerProfile from "@/components/employer/profile/EmployerProfile";
import { Toast } from "@/components/Toast/Toast";
import { decode, encode } from "@/helper/GeneralHelpers";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import BackButton from "@/components/common/BackButton/BackButton";

const Page = ({ params }) => {
  const {
    user: { id = null, type = null } = {},
  } = useSelector((state) => state?.auth?.userData || {});
  const { userData } = useSelector((state) => state.auth);

  const [Profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const userId = decode(params?.id);
  const notUser = Object.keys(userData).length === 0;

  const isEmployerViewer = type === "employer";

  const FetchApplicantProfile = async () => {
    try {
      const response = await apiInstance.get(`${USER_PROFILE}/${userId}`);
      if (response.status === 200 || response.status === 201) {
        setProfile(response?.data?.data?.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShortEmployerProfile = async () => {
    try {
      const response = await apiInstance(`${GET_SHORT_PROFILE}/${userId}`);
      if (response.status === 200 || response.status === 201) {
        setProfile(response.data.data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!notUser) {
      if (parseInt(id) === parseInt(userId)) {
        if (type === "employer") {
          router.push(`/employer/profile`);
        } else if (type === "applicant") {
          router.push(`/applicant/profile`);
        }
      } else {
        FetchApplicantProfile();
      }
    } else {
      fetchShortEmployerProfile();
    }

    return () => {
      setProfile(null);
    };
  }, [userId]);

  const onPressFollow = async (_userId) => {
    try {
      const response = await apiInstance.post(FOLLOW_USER, { following_user_id: _userId });
      if (response.status === 200 || response.status === 201) {
        setProfile((prev) => ({
          ...prev,
          isFollowed: !prev.isFollowed,
        }));
        Toast("success", response?.data?.message);
      }
    } catch (error) {
      console.error("Follow error:", error);
    }
  };

  const onPressMessage = async (_userId) => {
    try {
      const response = await apiInstance.post("chats", {
        participants: [_userId],
      });

      if (response?.data?.status === "success") {
        const chatId = response?.data?.data?.chat?.id;
        if (chatId) {
          router.push(`/${type}/chat?chatId=${encode(chatId)}`);
        }
      }
    } catch (err) {
      Toast("error", err?.response?.data?.message || "Failed to Message User");
    }
  };

  return (
    <Box>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
          <Typography ml={2}>Loading Profile...</Typography>
        </Box>
      ) : notUser ? (
        <Container>
          <EmployerProfile data={Profile} onPressFollow={onPressFollow} />
        </Container>
      ) : (
        <Box>
          {Profile?.type === "employer" ? (
            <Container>
              <BackButton />
              <EmployerProfile
                data={Profile}
                onPressMessage={onPressMessage}
              />
            </Container>
          ) : (
            <>
              <BackButton />
              <ProfileView
                Profile={Profile}
                onPressMessage={onPressMessage}
                {...(!isEmployerViewer && { onPressFollow })}
              />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Page;
