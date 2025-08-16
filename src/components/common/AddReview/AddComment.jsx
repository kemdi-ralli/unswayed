import React from "react";
import { Box, Typography } from "@mui/material";

const AddComment = ({ comment, onCommentChange }) => {
  return (
    <>
      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "19px", lg: "22px" },
          lineHeight: { xs: "22px", md: "18px" },
          fontWeight: 500,
          color: "#00305B",
          textTransform: "capitalize",
          mt: 4,
          ml: 2,
        }}
      >
        Write your feedback
        <span style={{ color: "red" }}>*</span>
      </Typography>
      <Box
        component="textarea"
        rows={5}
        value={comment}
        onChange={onCommentChange}
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
          resize: "vertical",
        }}
        placeholder="Comments"
      />
    </>
  );
};

export default AddComment;
