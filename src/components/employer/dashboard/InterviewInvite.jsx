"use client";
import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import InterviewDatePicker from "@/components/applicant/dashboard/InterviewDatePicker"; 

const InterviewInvite = ({ ucn = '', onAction = () => {} }) => {
  const [payload, setPayload] = useState({
    'type' : 'interview',
    'description' : '',
    'dates' : [],
  });

  const handleChange = (key, value, ind = null) => {
    setPayload(prevState => {
        if (key === 'dates' && ind !== null) {
          const updatedDates = [...prevState.dates];
            if(value?.isValid()){
              updatedDates[ind] = value?.toString();
            }else{
              updatedDates[ind] = undefined;
            }
              return {
                  ...prevState,
                  dates: updatedDates,
              };
        }

        return {
            ...prevState,
            [key]: value,
        };
    });
  }

  const handleOfferSend = () => {
    
    if(payload.description === ''){
      alert("Descripion is Required");
      return;
    }

    const allDatesDefined = payload.dates.every(date => date !== undefined && date !== null && date !== "");
    if(payload.dates.length < 3 || !allDatesDefined){
      alert("Three Dates are Required");
      return;
    }
    
    onAction(payload);
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontWeight: 600, fontSize: "30px", color: "#00305B" }}
        >
          Interview
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            color: "#000000",
            textDecoration: "underline",
          }}
        >
          UCN : {ucn ?? ''}
        </Typography>
      </Box>

      <Box key="description" sx={{ py: 2 }}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "20px",
            color: "#00305B",
            mb: 1,
          }}
        >
          Description
          <span style={{ color: "red" }}>*</span>
        </Typography>
        <Box
          component={"textarea"}
          rows={4}
          sx={{
            width: "100%",
            boxShadow: "0px 0px 3px 1px #00000040",
            border: "none",
            padding: "18px 20px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 300,
            lineHeight: "18px",
            color: "#222222",
            resize: "vertical",
          }}
          placeholder="Write Your Details"
          value={payload?.description}
          onChange={(e) => handleChange('description', e?.target?.value)}
        />
      </Box>

      <Box key="datetime" sx={{ py: 2 }}>
        <InterviewDatePicker key="0" onDateChange={(newDate) => handleChange('dates', newDate, 0)} placeHolderLabel="Select First Date and Time For Interview" />
      </Box>
      <Box key="datetime" sx={{ py: 2 }}>
        <InterviewDatePicker key="1" onDateChange={(newDate) => handleChange('dates', newDate, 1)} placeHolderLabel="Select Second Date and Time For Interview" />
      </Box>
      <Box key="datetime" sx={{ py: 2 }}>
        <InterviewDatePicker key="2" onDateChange={(newDate) => handleChange('dates', newDate, 2)} placeHolderLabel="Select Third Date and Time For Interview" />
      </Box>

      <RalliButton label="Send Invite" onClick={handleOfferSend} />
    </Box>
  );
};

export default InterviewInvite;
