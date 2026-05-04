"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Chip, Rating, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { BorderLinearProgress } from "@/helper/progressbar";
import RalliButton from "@/components/button/RalliButton";
import { usePathname, useRouter } from "next/navigation";
import { EMPLOYER_GET_REVIEWS } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import Image from "next/image";
import { useSelector } from "react-redux";
import { encode } from "@/helper/GeneralHelpers";


const EmployerProfile = ({
  data,
  onPressFollow = () => {},
  onPressMessage = () => {},
}) => {
  const { userData } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const Stars = [5, 4, 3, 2, 1];
  const notUser = Object.keys(userData).length === 0;
  const isMyProfile = userData?.user?.id === data?.id;
  const route = useRouter();

  console.log(data);

  const handleAddReview = () => {
    const encodedId = encode(data?.employer_id);
    route.push(`/profile/write-reviews/${encodedId}`);
  };
  const handleEdit = () => {
    route.push("/employer/profile/edit-profile");
  };

  useEffect(() => {
    const getReviews = async (empId) => {
      try {
        const response = await apiInstance?.get(
          `${EMPLOYER_GET_REVIEWS}/${empId}`
        );
        if (response?.data?.data) {
          setReviews(response?.data?.data?.reviews);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    getReviews(data?.employer_id);
  }, [data?.employer_id]);

  // === NEW: Get subscription info from data or userData ===
  const getSubscriptionDisplay = () => {
    const subscriptionPlan = data?.subscription_plan || userData?.user?.subscription_plan || "30-Day Trial";
    const isOnTrial = data?.subscription?.is_on_trial || subscriptionPlan === "30-Day Trial";
    const daysRemaining = data?.subscription?.days_remaining || 0;
    
    // Calculate days remaining for trial if not provided
    let calculatedDaysRemaining = daysRemaining;
    if (isOnTrial && data?.trial_ends_at && !daysRemaining) {
      const trialEnd = new Date(data.trial_ends_at);
      const now = new Date();
      calculatedDaysRemaining = Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)));
    }
    
    return {
      plan: subscriptionPlan,
      isOnTrial,
      daysRemaining: calculatedDaysRemaining,
    };
  };

  const subscriptionInfo = getSubscriptionDisplay();

  // === NEW: Get color based on subscription type ===
  const getSubscriptionColor = (plan) => {
    if (plan === "30-Day Trial") return { bg: "#fef3c7", text: "#d97706" };
    if (plan === "Tier 1") return { bg: "#dbeafe", text: "#2563eb" };
    if (plan === "Tier 2") return { bg: "#dcfce7", text: "#16a34a" };
    if (plan === "Tier 3") return { bg: "#f3e8ff", text: "#9333ea" };
    if (plan === "Expired") return { bg: "#fee2e2", text: "#dc2626" };
    return { bg: "#f3f4f6", text: "#374151" };
  };

  const subColors = getSubscriptionColor(subscriptionInfo.plan);

  return (
    <Box>
      <Box sx={styles.userDetail}>
        <Avatar alt="Profile" src={data?.photo} sx={styles.avatar} />
        {/* <UserSyncButton/> */}
        <Typography sx={styles.name}>
          {data?.first_name ?? ""} {data?.middle_name ?? ""}{" "}
          {data?.last_name ?? ""}
        </Typography>
        <Typography sx={styles.Count}>
          {data?.reviews_count ?? 0} Reviews
        </Typography>
        <Typography sx={styles.Count}>
          {data?.followers_count ?? 0} Followers
        </Typography>
        <Box sx={styles.starContainer}>
          {Stars.slice()
            .reverse()
            ?.map((el, index) => {
              let source;
              if (data?.averageRating >= el) {
                source = "/assets/images/stars.png";
              } else if (
                data?.averageRating > el - 1 &&
                data?.averageRating < el
              ) {
                source = "/assets/images/half.png";
              } else {
                source = "/assets/images/empty.png";
              }

              return (
                <Image
                  key={index}
                  alt="review_stars"
                  src={source}
                  width={30}
                  height={30}
                />
              );
            })}
        </Box>
      </Box>
      {!isMyProfile && !notUser && (
        <Box sx={styles.buttonContainer}>
          <Button
            sx={{
              backgroundColor: data?.isFollowed ? "#fff" : "#189e33ff",
              color: data?.isFollowed ? "#189e33ff" : "#fff",
              borderColor: data?.isFollowed ? "#189e33ff" : null,
              width: { xs: "70%", sm: "130px", md: "200px" },
              height: "60px",
              borderRadius: "10px",
              border: "2px solid",
            }}
            onClick={() => onPressFollow(data.id)}
          >
            {data?.isFollowed ? "UnFollow" : "Follow"}
          </Button>
          <Button
            sx={styles.primaryButton}
            onClick={() => onPressMessage(data?.id)}
          >
            Message
          </Button>
        </Box>
      )}
      {!notUser && isMyProfile && (
        <Box sx={styles.buttonContainer}>
          <Button
            onClick={handleEdit}
            sx={styles.editButton}
            style={styles.editButton}
          >
            Edit
          </Button>
        </Box>
      )}

      {/* === NEW: Subscription Plan Display for Employer === */}
      {isMyProfile && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mb: 3,
            p: 2,
            borderRadius: "12px",
            backgroundColor: subColors.bg,
            border: `1px solid ${subColors.text}20`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontWeight: 500, color: "#374151" }}>
              Current Plan:
            </Typography>
            <Chip
              label={subscriptionInfo.plan}
              size="small"
              sx={{
                backgroundColor: subColors.text,
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Box>
          
          {subscriptionInfo.isOnTrial && subscriptionInfo.daysRemaining > 0 && (
            <Typography
              sx={{
                fontSize: "14px",
                color: subscriptionInfo.daysRemaining <= 7 ? "#dc2626" : "#d97706",
                fontWeight: 600,
              }}
            >
              ⏰ {subscriptionInfo.daysRemaining} days remaining in trial
            </Typography>
          )}
          
          {(subscriptionInfo.plan === "30-Day Trial" || subscriptionInfo.plan === "Expired") && (
            <Button
              variant="contained"
              onClick={() => route.push("/billing")}
              sx={{
                mt: 1,
                backgroundColor: "#189e33ff",
                color: "#fff",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                "&:hover": {
                  backgroundColor: "#147c2cff",
                },
              }}
            >
              {subscriptionInfo.plan === "Expired" ? "Renew Subscription" : "Upgrade Now"}
            </Button>
          )}
        </Box>
      )}

      {!notUser && (
        <>
          <Typography sx={styles.heading}>Overview</Typography>
          <Box sx={styles.detailTab}>
            <Typography sx={styles.detailHeading}>Company Size</Typography>
            <Typography sx={styles.detailText}>
              {data?.company_size <= 1 ? `${data?.company_size} Employee` : `${data?.company_size} Employees`}
            </Typography>
          </Box>
          <Box sx={styles.detailTab}>
            <Typography sx={styles.detailHeading}>Industry</Typography>
            <Typography sx={styles.detailText}>{data?.industry}</Typography>
          </Box>
          <Box sx={styles.detailTab}>
            <Typography sx={styles.detailHeading}>Headquarter</Typography>
            <Typography sx={styles.detailText}>
            {data?.country?.name ?? ""}, {data?.state?.name ?? ""},{" "}
            {data?.city?.name ?? ""}
            </Typography>
          </Box>
          {isMyProfile && (
            <Box sx={styles.detailTab}>
              <Typography sx={styles.detailHeading}>Company Number</Typography>
              <Typography sx={styles.detailText}>
                {data?.phone}
              </Typography>
            </Box>
          )}
          <Box key={"website"} sx={styles.detailTab}>
            <Typography sx={styles.detailHeading}>Website</Typography>
            <Typography sx={styles.detailText}>
              {data?.website ?? ""}
            </Typography>
          </Box>
          <Box key={"founded"} sx={styles.detailTab}>
            <Typography sx={styles.detailHeading}>Founded</Typography>
            <Typography sx={styles.detailText}>
              {data?.founded ?? ""}
            </Typography>
          </Box>
        </>
      )}

      <Box sx={styles.aboutSection}>
        <Typography sx={styles.heading2}>About</Typography>
        <Typography sx={styles.aboutText}>{data?.about ?? ""}</Typography>
      </Box>

      <Box>
        <Typography sx={styles.heading}>Reviews & Rating</Typography>
        <Box sx={styles.ratingSection}>
          <Box sx={{ maxWidth: "800px", width: "100%" }}>
            {[5, 4, 3, 2, 1].map((item, index) => {
              const progressWidth =
                data?.reviews_count > 0
                  ? ((data?.ratingCounts[item] || 0) / data?.reviews_count) *
                    100
                  : 0;
              return (
                <Box key={index} sx={styles.progressSection}>
                  <Typography sx={styles.number}>{item}</Typography>
                  <BorderLinearProgress
                    variant="determinate"
                    value={progressWidth}
                    sx={{ width: "100%" }}
                  />
                </Box>
              );
            })}
          </Box>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: { xs: "22px", sm: "26px", md: "30px", lg: "40px" },
                lineHeight: { xs: "35px", sm: "40px", md: "48px" },
                color: "#00305B",
              }}
            >
              {data?.averageRating ?? ""}
            </Typography>
            <Typography
              sx={{
                fontWeight: 300,
                fontSize: { xs: "14px", sm: "16px", md: "20px" },
                lineHeight: { xs: "14px", sm: "16px", md: "17px" },
                color: "#111111",
              }}
            >
              {data?.reviews_count ?? ""} Reviews
            </Typography>
            <Rating
              name="text-feedback"
              value={data?.averageRating ?? 0}
              readOnly
              precision={0.5}
              sx={{
                fontSize: "12px",
              }}
              // emptyIcon={
              //   <StarIcon
              //     sx={{
              //       opacity: 0.55,
              //     }}
              //   />
              // }
            />
          </Box>
        </Box>
      </Box>
      {reviews?.map((item, index) => (
        <Box key={index} sx={styles.reviewSection}>
          <Rating
            name="text-feedback"
            value={item?.overall_ratings || 0}
            readOnly
            precision={0.5}
            sx={{ fontSize: "12px" }}
            // emptyIcon={
            //   <StarIcon
            //     sx={{
            //       opacity: 0.55,
            //     }}
            //   />
            // }
          />

          <Typography sx={styles.ReviewUsername}>
            {!!item?.is_anonymous
              ? "Anonymous"
              : [
                  item?.applicant?.first_name,
                  item?.applicant?.middle_name,
                  item?.applicant?.last_name,
                ]
                  .filter(Boolean)
                  .join(" ")}
          </Typography>

          <Typography sx={styles.reviewType}>
            {item?.feedback || "No feedback provided"}
          </Typography>

          {/* Yes/No Responses Display */}
          {item?.yes_no_responses && item.yes_no_responses.length > 0 && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography
                sx={{
                  fontSize: { xs: "13px", sm: "14px", md: "15px" },
                  fontWeight: 600,
                  color: "#00305B",
                  mb: 1,
                }}
              >
                Quick Responses:
              </Typography>
              {item.yes_no_responses.map((response, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.75,
                    px: 1.5,
                    mb: 0.75,
                    borderRadius: "8px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #e9ecef",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", sm: "13px", md: "14px" },
                      fontWeight: 400,
                      color: "#333",
                      flex: 1,
                    }}
                  >
                    {response.question}
                  </Typography>
                  <Chip
                    label={response.answer ? "Yes" : "No"}
                    sx={{
                      backgroundColor: response.answer ? "#189e33ff" : "#d32f2f",
                      color: "#FFF",
                      fontWeight: 600,
                      fontSize: { xs: "11px", sm: "12px" },
                      height: "24px",
                      "& .MuiChip-label": {
                        px: 1.5,
                      },
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1, md: 2 }, py: 1 }}>
            <Typography sx={styles.reviewType}>
              {item?.created_at
                ? new Date(item.created_at).toLocaleDateString()
                : "Unknown date"}
            </Typography>
          </Box>
        </Box>
      ))}
      {userData?.user?.type === "applicant" && !notUser && (
        <Box sx={{pt:1, pb:2}}>
          <RalliButton label="Write A Review" onClick={handleAddReview} />
        </Box>
      )}
    </Box>
  );
};

const styles = {
  userDetail: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
  avatar: {
    width: { xs: 80, sm: 100, md: 131 },
    height: { xs: 80, sm: 100, md: 131 },
    border: "1px solid rgba(0, 0, 0, 0.06)",
    my: 1,
    "& img": {
      objectFit: "contain",
    },
  },
  name: {
    fontSize: { xs: "20px", sm: "22px", md: "26px" },
    fontWeight: 600,
    lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "33px" },
    color: "#111111",
    mt: "10px",
    mb: "-5px",
  },

  Count: {
    fontSize: { xs: "14px", sm: "16px", md: "18px" },
    fontWeight: 400,
    lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "19px" },
    textDecoration: "underline",
    color: "#00305B",
    mt: "10px",
    mb: "5px",
  },
  starContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    marginTop: "15px",
  },
  buttonContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: 2,
    justifyContent: "center",
    my: 4,
  },
  primaryButton: {
    width: { xs: "70%", sm: "130px", md: "200px" },
    height: "60px",
    borderRadius: "10px",
    backgroundColor: "#00305B",
    color: "#fff",
  },
  editButton: {
    width: { xs: "100%", sm: "300px", md: "390px" },
    height: "60px",
    borderRadius: "10px",
    backgroundColor: "#189e33ff",
    color: "#fff",
  },
  heading: {
    fontSize: { xs: "18px", sm: "24px", md: "30px" },
    lineHeight: { xs: "14px", sm: "16px", md: "17px" },
    fontWeight: 600,
    color: "#00305B",
    pb: 2,
  },
  detailTab: {
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    my: 2,
    gap:1
  },
  detailHeading: {
    fontSize: { xs: "14px", sm: "14px", md: "16px" },
    lineHeight: { xs: "14px", sm: "16px", md: "18px" },
    fontWeight: 500,
    color: "#222222",
  },
  detailText: {
    fontSize: { xs: "14px", sm: "14px", md: "16px" },
    lineHeight: { xs: "14px", sm: "16px", md: "18px" },
    fontWeight: 700,
    color: "#00305B",
  },
  aboutSection: {
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
    mb: 4,
  },
  heading2: {
    fontSize: { xs: "16px", sm: "18px", md: "22px" },
    lineHeight: "18px",
    fontWeight: 600,
    color: "#00305B",
    pb: 2,
  },
  aboutText: {
    fontSize: { xs: "14px", sm: "16px", md: "16px" },
    lineHeight: { xs: "20px", sm: "22px", md: "26px" },
    fontWeight: 300,
    color: "#111111",
    pb: 2,
  },
  ratingSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  progressSection: { my: 2, display: "flex", alignItems: "center" },
  number: {
    fontSize: "16px",
    fontWeight: 500,
    color: "#00305B",
    mr: 2,
  },
  reviewSection: {
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
  },
  ReviewUsername: {
    fontSize: { xs: "14px", sm: "16px", md: "20px" },
    lineHeight: "17px",
    fontWeight: 500,
    color: "#222222",
    py: 1,
  },
  reviewType: {
    fontSize: { xs: "12px", sm: "14px", md: "16px" },
    lineHeight: { xs: "17px", sm: "20px", md: "26px" },
    fontWeight: 300,
    color: "#111111",
    py: 1,
  },
};

export default EmployerProfile;