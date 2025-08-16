import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { applicantOfferResponse } from "@/helper/ApplicationActionHelper";

const OfferLetterDetails = ({ requisitionNumber = '', userType = '', historyData = {} }) => {

  const [item, setItem] = useState({});
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const onResponse = async (type = '') => {
    if (userType !== 'employer' && (historyData?.type === 'offer_letter_sent' || historyData?.type === 'counter_offer_letter_sent') && item?.status === 'pending') {
      type === 'accept' ? setAcceptLoading(true) : setDeclineLoading(true);
      try {
        const formData = new FormData();
        formData.append("type", type);
        const response = await applicantOfferResponse(item?.id, formData);
        if (response?.data?.status === 'success') {
          window.location.href = window.location.href;
        }
      } catch (error) {
        Toast("error", "Something went wrong.");
      } finally {
        type === 'accept' ? setAcceptLoading(false) : setDeclineLoading(false);
      }
    }
  };

  const getOfferDetails = async () => {
    try {
      const response = await apiInstance.get(`application/${historyData?.history_data?.offer_id}/offer-detail`);
      const offer = response?.data?.data?.interview;
      if (offer) {
        setItem(offer);
      }
    } catch (error) {
      Toast("error", error?.response?.data?.message);
      return error?.response;
    }
  }

  useEffect(() => {
    getOfferDetails();
  }, [historyData?.history_data?.offer_id]);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "30px",
            lineHeight: "18px",
            color: "#00305B",
          }}
        >
          {item?.title ?? "Offer later"}
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            lineHeight: "30px",
            color: "#000000",
            textDecoration: "underline",
          }}
        >
          {userType === 'employer' ? `UCN : ${item?.ucn}` : `REQ : ${requisitionNumber}`}
        </Typography>
      </Box>
      <Typography
        sx={{
          fontWeight: 400,
          fontSize: "20px",
          lineHeight: "30px",
          color: "#111111",
          py: 2,
        }}
      >
        {item?.description ?? ""}
      </Typography>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "20px",
          color: "#00305B",
          // py: 2,
        }}
      >
        Salary: {item?.salary ?? ""}
      </Typography>
      <Box sx={{ py: 2, display: "flex", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontWeight: 400, fontSize: "16px", color: "#111111", py: 2 }}
        >
          Date: {new Date(item?.created_at)?.toDateString() + " " ?? ""}
          {new Date(item?.created_at)?.toLocaleTimeString() ?? ""}
        </Typography>
        <Button
          sx={{
            // minWidth: "112px",
            border: "1px solid #ffff",
            fontSize: "14px",
            color: "#ffff",
            backgroundColor: item?.status === 'accept' ? 'green' : 'red',
          }}
        >
          STATUS: {item?.status?.toUpperCase() || ""}
        </Button>
      </Box>
      {(userType !== 'employer' && item?.status === 'pending') && (
        <>
          <Box sx={{ py: 2 }}>
            <RalliButton
              label="Accept"
              bg="#00305B"
              onClick={() => onResponse('accept')}
              loading={acceptLoading}
            />
          </Box>
          <RalliButton
            label="Decline"
            onClick={() => onResponse('decline')}
            loading={declineLoading}
          />
        </>
      )}
    </Box>
  );
};

export default OfferLetterDetails;
