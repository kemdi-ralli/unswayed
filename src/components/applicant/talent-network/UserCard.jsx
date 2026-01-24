import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
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
import { useSelector } from "react-redux";

const UserCard = () => {
  const [TalentNetwork, setTalentNetwork] = useState([]);
  const [Search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const {
    user: { type = null } = {},
  } = useSelector((state) => state?.auth?.userData || {});

  const isEmployer = type === "employer";

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

    try {
      const response = await apiInstance.post(FOLLOW_USER, formData);
      if (response.status === 200 || response.status === 201) {
        setTalentNetwork((prevData) =>
          prevData.map((el) =>
            el.id === id ? { ...el, isFollowed: !el.isFollowed } : el
          )
        );
        Toast("success", response?.data?.message);
      }
    } catch (error) {
      Toast("error", "Failed to update follow status");
    }
  };

  const onClickNetwork = (id) => {
    const encodedId = encode(id);
    router.push(`/profile/${encodedId}`);
  };

  return (
    <Box>
      <TalentNetworkTitleSearchable
        label="Talent Network"
        value={Search}
        setValue={setSearch}
        onSearch={onSearch}
      />

      <FormTitle label="Recommended" />

      {loading ? (
        <Grid container spacing={2} mt={2}>
          {Array.from(new Array(10)).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
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
        <Grid container spacing={3} mt={2}>
          {TalentNetwork.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              {isEmployer ? (
                // ====== CREATIVE EMPLOYER VIEW CARD ======
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    boxShadow: "0px 2px 8px rgba(0, 48, 91, 0.12)",
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fb 100%)",
                    border: "1px solid rgba(0, 48, 91, 0.08)",
                    padding: "24px 20px",
                    mx: "auto",
                    width: "100%",
                    maxWidth: "320px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    position: "relative",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 8px 24px rgba(24, 158, 51, 0.15)",
                      borderColor: "rgba(24, 158, 51, 0.3)",
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: "linear-gradient(90deg, #189e33ff 0%, #00305B 100%)",
                    },
                  }}
                  onClick={() => onClickNetwork(item.id)}
                >
                  {/* Avatar with Badge */}
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 2, position: "relative" }}>
                    <Avatar
                      src={item?.photo || "/assets/images/profile.png"}
                      sx={{
                        width: 100,
                        height: 100,
                        border: "3px solid #189e33ff",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    {/* Online/Active Badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 5,
                        right: "calc(50% - 55px)",
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        backgroundColor: "#189e33ff",
                        border: "3px solid #fff",
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                      }}
                    />
                  </Box>

                  {/* Name */}
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: 700,
                      textAlign: "center",
                      color: "#111111",
                      mb: 0.5,
                      lineHeight: 1.3,
                      minHeight: "48px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item?.first_name} {item?.middle_name} {item?.last_name}
                  </Typography>

                  {/* Role/Title */}
                  {item?.experience_level && (
                    <Typography
                      sx={{
                        fontSize: "13px",
                        textAlign: "center",
                        color: "#6b7280",
                        fontWeight: 500,
                        mb: 2,
                      }}
                    >
                      {item.experience_level}
                    </Typography>
                  )}

                  {/* Stats Row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      backgroundColor: "rgba(0, 48, 91, 0.04)",
                      borderRadius: "8px",
                      padding: "12px 8px",
                      mt: 1,
                    }}
                  >
                    {/* Followers */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#189e33ff",
                          lineHeight: 1,
                        }}
                      >
                        {item?.followers_count || 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#6b7280",
                          fontWeight: 500,
                          mt: 0.5,
                        }}
                      >
                        Followers
                      </Typography>
                    </Box>

                    {/* Divider */}
                    <Box sx={{ width: "1px", height: "32px", backgroundColor: "rgba(0, 48, 91, 0.12)" }} />

                    {/* Following/Connections */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#00305B",
                          lineHeight: 1,
                        }}
                      >
                        {item?.following_count || 0}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "11px",
                          color: "#6b7280",
                          fontWeight: 500,
                          mt: 0.5,
                        }}
                      >
                        Following
                      </Typography>
                    </Box>
                  </Box>

                  {/* Location Badge */}
                  {(item?.city?.name || item?.state?.name) && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        mt: 2,
                      }}
                    >
                      <Typography sx={{ fontSize: "12px", color: "#9ca3af" }}>📍</Typography>
                      <Typography
                        sx={{
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: 500,
                        }}
                      >
                        {item?.city?.name || item?.state?.name}
                      </Typography>
                    </Box>
                  )}

                  {/* View Profile CTA */}
                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: "1px solid rgba(0, 48, 91, 0.08)",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: "#189e33ff",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                      }}
                    >
                      View Profile →
                    </Typography>
                  </Box>
                </Box>
              ) : (
                // ====== APPLICANT VIEW CARD (Original with Follow Button) ======
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: "5px",
                    boxShadow: "0px 1px 3px #00000040",
                    width: "280px",
                    height: "300px",
                    padding: "20px",
                    mx: "auto",
                    cursor: "pointer",
                  }}
                  onClick={() => onClickNetwork(item.id)}
                >
                  <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
                    <Avatar
                      src={item?.photo || "/assets/images/profile.png"}
                      sx={{
                        width: 90,
                        height: 90,
                        border: "1px solid rgba(0, 0, 0, 0.06)",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      textAlign: "center",
                    }}
                  >
                    {item?.first_name} {item?.middle_name} {item?.last_name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "14px",
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
                        minWidth: "151px",
                        height: "46px",
                        mx: "auto",
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "6px",
                        border: "1px solid",
                        borderColor: !item.isFollowed ? "#189e33ff" : "#00305B",
                        color: !item.isFollowed ? "#FFFFFF" : "#00305B",
                        fontSize: "14px",
                        fontWeight: 700,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onFollow(item.id);
                      }}
                    >
                      {item.isFollowed ? "Unfollow" : "Follow"}
                    </Button>
                  </Box>
                </Box>
              )}
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default UserCard;
