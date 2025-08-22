"use client";
import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, Rating, Typography } from "@mui/material";
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

  return (
    <Box>
      <Box sx={styles.userDetail}>
        <Avatar alt="Profile" src={data?.photo} sx={styles.avatar} />
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
      {!notUser && (
        <>
          <Typography sx={styles.heading}>Overview</Typography>
          <Box sx={styles.detailTab}>
            <Typography sx={styles.detailHeading}>Company Size</Typography>
            <Typography sx={styles.detailText}>
              {data?.company_size} Employee
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
                {data?.phone} Employee
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
            Paid Fairly: {item?.questions?.paid_fairly === true ? "Yes" : "No"}
          </Typography>
          <Typography sx={styles.reviewType}>
            Would You Recommend To Others:{" "}
            {item?.questions?.recommended === true ? "Yes" : "No"}
          </Typography>
          <Typography sx={styles.reviewType}>
            Work Environment: {item?.questions?.work_culture || ""}
          </Typography>
          <Typography sx={styles.reviewType}>
            {item?.feedback || "No feedback provided"}
          </Typography>

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
          <RalliButton label="Write A Reviews" onClick={handleAddReview} />
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
