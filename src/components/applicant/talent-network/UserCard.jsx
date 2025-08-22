import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Grid, Skeleton, Typography } from "@mui/material";
import TalentNetworkTitleSearchable from "./TalentNetworkTitleSearchable";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  FOLLOW_USER,
  GET_TALENT_NETWORK,
  SEARCH_TALENT_NETWORK,
} from "@/services/apiService/apiEndPoints";
import { useRouter } from "next/navigation";
import { encode } from "@/helper/GeneralHelpers";
import { Toast } from "@/components/Toast/Toast";
import FormTitle from "../dashboard/FormTitle";

const UserCard = () => {
  const [TalentNetwork, setTalentNetwork] = useState([]);
  const [Search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchTalent = async () => {
    try {
      setLoading(true);
      const response = await apiInstance.get(`${GET_TALENT_NETWORK}?limit=10`);

      if (response.status === 200 || response.status === 201) {
        setTalentNetwork(response.data.data.users || []);
      }
    } catch (error) {
      console.error("Error fetching talent network:", error);
      Toast("error", error.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const onSearch = async () => {
    setLoading(true);
    const response = await apiInstance(
      `${SEARCH_TALENT_NETWORK}?search=${Search}`
    );
    if (response.status === 200 || response.status === 201) {
      setTalentNetwork(response.data.data.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTalent();
  }, []);

  useEffect(() => {
    if (Search === "") {
      fetchTalent();
    }
  }, [Search]);

  const onFollow = async (id) => {
    const formData = new FormData();
    formData.append("following_user_id", id);
    if (formData) {
      const response = await apiInstance.post(FOLLOW_USER, formData);
      if (response.status === 200 || response.status === 201) {
        setTalentNetwork((prevData) =>
          prevData.map((el) =>
            el.id === id ? { ...el, isFollowed: !el.isFollowed } : el
          )
        );
        Toast("success", response?.data?.message);
      }
    }
  };

  const onClickNetwork = (id) => {
    const encodedId = encode(id);
    router.push(`/profile/${encodedId}`);
  };

  return (
    <Box>
      <TalentNetworkTitleSearchable
        label={"Talent Network"}
        value={Search}
        setValue={setSearch}
        onSearch={onSearch}
      />
      <FormTitle label="Recommended" />
      {loading ? (
        <Grid container spacing={2} mt={2}>
          {Array.from(new Array(10)).map((_, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} xl={3} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "5px",
                  boxShadow: "0px 1px 3px #00000040",
                  width: "280px",
                  height: "300px",
                  mx: "auto",
                  p: 2,
                }}
              >
                <Skeleton variant="circular" width={90} height={90} sx={{ mx: "auto" }} />
                <Skeleton variant="text" width={150} height={20} sx={{ mx: "auto", mt: 1 }} />
                <Skeleton variant="text" width={100} height={15} sx={{ mx: "auto", mb: 2 }} />
                <Skeleton variant="rectangular" width={151} height={46} sx={{ mx: "auto", borderRadius: "6px" }} />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : TalentNetwork.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No Users Found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} mt={2}>
          {TalentNetwork.map((item, index) => (
            <Grid item xs={12} sm={12} md={4} lg={4} xl={3} key={index}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "5px",
                  boxShadow: "0px 1px 3px #00000040",
                  width: "280px",
                  cursor: "pointer",
                  height: "300px",
                  mx: "auto",
                  "@media (min-width: 780px) and (max-width: 995px)": {
                    width: "230.16px",
                    height: "270px",
                  },
                  "@media (max-width: 340px)": {
                    width: "235.16px",
                    height: "270px",
                  },
                }}
                onClick={() => onClickNetwork(item?.id)}
              >
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center",my:2 }}>
                  <Avatar
                    src={item?.photo ? item.photo : "/assets/images/profile.png"}
                    sx={{
                      width: 90, height: 90,
                      "& img": {
                        objectFit: "contain",
                      },
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                    }}
                    alt="user"
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", md: "16px", lg: "18px" },
                    fontWeight: 600,
                    lineHeight: "18px",
                    textAlign: "center",
                    color: "#222222",
                  }}
                >
                  {item?.first_name + " " + item?.middle_name + " " + item?.last_name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", md: "14px" },
                    fontWeight: 400,
                    lineHeight: "19px",
                    textAlign: "center",
                    color: "#00305B",
                    textDecoration: "underline",
                  }}
                >
                  Follower {item?.followers_count}
                </Typography>
                <Box sx={{ py: 1 }}>
                  <Button
                    sx={{
                      backgroundColor: !item.isFollowed && "#189e33ff",
                      minWidth: "151.16px",
                      height: "46px",
                      margin: "0px auto",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: !item.isFollowed ? "#189e33ff" : "#00305B",
                      color: !item.isFollowed ? "#FFFFFF" : "#00305B",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      mb: 1,
                      fontSize: "14px",
                      fontWeight: 700,
                      lineHeight: "21px",
                      "@media (min-width: 780px) and (max-width: 880px)": {
                        minWidth: "111.16px",
                      },
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      onFollow(item.id);
                    }}
                  >
                    {item.isFollowed ? "UnFollow" : "Follow"}
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserCard;
