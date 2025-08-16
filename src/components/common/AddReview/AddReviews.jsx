"use client";
import React, { useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Button, Typography, Checkbox } from "@mui/material";
import RateCompany from "./RateCompany";
import AddComment from "./AddComment";
import RalliButton from "@/components/button/RalliButton";
import OverallRating from "./OverallRating";
import WorkCulture from "./WorkCulture";
import RalliModal from "@/components/Modal/RalliModal";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { ADD_REVIEW } from "@/services/apiService/apiEndPoints";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/Toast/Toast";

const AddReviews = ({ data, id }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [Recommend, setRecommend] = useState(null);
  const [PaidFairly, setPaidFairly] = useState(null);
  const [selectedWorkCulture, setSelectedWorkCulture] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ratings, setRatings] = useState({
    work_life_balance: 0,
    benefits: 0,
    stability: 0,
  });
  const router = useRouter();

  const handleCloseModal = () => setModalOpen(false);

  const handleRecommendValue = (value) => {
    if (value === "Yes") {
      setRecommend(true);
    } else {
      setRecommend(false);
    }
  };
  const handlePaidValue = (value) => {
    if (value === "Yes") {
      setPaidFairly(true);
    } else {
      setPaidFairly(false);
    }
  };

  const handleWorkCultureSelect = (name) => {
    setSelectedWorkCulture(name);
  };
  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
  };
  const handleRatingChange = (categoryId, newValue) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [categoryId]: newValue,
    }));
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleAnonymousChange = (event) => {
    setIsAnonymous(event.target.checked);
  };

  const object = {
    questions: {
      recommended: Recommend,
      paid_fairly: PaidFairly,
      work_culture: selectedWorkCulture,
    },
    ratings: ratings,
    overall_ratings: selectedRating,
    is_anonymous: isAnonymous,
    feedback: comment,
  };

  const onFeedback = async () => {
    if (!selectedRating) {
      Toast("error", "Overall rating is required.");
      return;
    }
  
    if (!comment.trim()) {
      Toast("error", "Feedback is required.");
      return;
    }
  
    setLoading(true);
    try {
      const response = await apiInstance.post(`${ADD_REVIEW}/${id}`, object);
      if (response.status === 200 || response.status === 201) {
        setModalOpen(true);
        Toast("success", response?.data?.message);
      } else {
        Toast("error", "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Feedback submission failed:", error);
      Toast("error", error?.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onDone = () => {
    router.back();
  };

  return (
    <Box>
      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "19px", lg: "22px" },
          lineHeight: { xs: "22px", md: "18px" },
          fontWeight: 500,
          color: "#00305B",
          textTransform: "capitalize",
        }}
      >
        Share your anonymous feedback about your Employer in just two steps
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "16px" },
          lineHeight: { xs: "28px", md: "26px" },
          fontWeight: 300,
          color: "#111111",
          textTransform: "capitalize",
          py: 2,
        }}
      >
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industrys standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. Lorem Ipsum is simply dummy
        text of the printing and typesetting industry. Lorem Ipsum has been the
        industrys standard dummy text ever since the 1500s.
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, pb: 4 }}>
        <InfoIcon sx={{ color: "#00305B" }} />
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "16px", md: "19px", lg: "22px" },
            lineHeight: { xs: "22px", md: "18px" },
            fontWeight: 500,
            color: "#FE4D82",
            textTransform: "capitalize",
          }}
        >
          All questions are optional. Please skip any that don’t apply.
        </Typography>
      </Box>
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
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "13px", md: "16px" },
            lineHeight: { xs: "20px", sm: "19px", md: "18px" },
            fontWeight: 500,
            color: "#222222",
            textTransform: "capitalize",
            py: { xs: 1, sm: 0 },
          }}
        >
          Would You Recommend Working At This Company To A Friend
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["Yes", "No"].map((el, index) => (
            <Button
              key={index}
              sx={{
                backgroundColor: Recommend === el ? "#00305B" : "#FFFFFF",
                fontSize: { xs: "12px", md: "14px" },
                lineHeight: "21px",
                fontWeight: 700,
                color: Recommend === el ? "#FFFFFF" : "#00305B",
                border: "2px solid",
                borderColor: "#00305B",
              }}
              onClick={() => handleRecommendValue(el)}
            >
              {el}
            </Button>
          ))}
        </Box>
      </Box>
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
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "13px", md: "16px" },
            lineHeight: { xs: "20px", sm: "19px", md: "18px" },
            fontWeight: 500,
            color: "#222222",
            textTransform: "capitalize",
            py: { xs: 1, sm: 0 },
          }}
        >
          Do You Think You Are Paid Fairly At This Company
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["Yes", "No"].map((el, index) => (
            <Button
              key={index}
              sx={{
                backgroundColor: PaidFairly === el ? "#00305B" : "#FFFFFF",
                fontSize: { xs: "12px", md: "14px" },
                lineHeight: "21px",
                fontWeight: 700,
                color: PaidFairly === el ? "#FFFFFF" : "#00305B",
                border: "2px solid",
                borderColor: "#00305B",
              }}
              onClick={() => handlePaidValue(el)}
            >
              {el}
            </Button>
          ))}
        </Box>
      </Box>
      <WorkCulture
        data={data}
        selected={selectedWorkCulture}
        onSelect={handleWorkCultureSelect}
      />
      <OverallRating
        selectedRating={selectedRating}
        onSelect={handleRatingSelect}
      />
      <RateCompany ratings={ratings} onRatingChange={handleRatingChange} />
      <AddComment comment={comment} onCommentChange={handleCommentChange} />

      <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
        <Checkbox
          checked={isAnonymous}
          onChange={handleAnonymousChange}
          sx={{ color: "#00305B" }}
        />
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
            lineHeight: { xs: "22px", md: "18px" },
            fontWeight: 500,
            color: "#00305B",
            textTransform: "capitalize",
          }}
        >
          Want to Review as Anonymous
        </Typography>
      </Box>

      <RalliButton label="Submit" onClick={onFeedback} loading={loading}/>

      <RalliModal
        open={isModalOpen}
        onClose={handleCloseModal}
        para={
          "Review submitted! Your insights are valuable to us and will assist others in understanding more about this company."
        }
        imageSrc={"/assets/images/confirmation.png"}
        buttonLabel="Done"
        onClick={onDone}
      />
    </Box>
  );
};

export default AddReviews;
