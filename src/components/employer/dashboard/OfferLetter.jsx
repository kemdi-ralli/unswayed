import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import { usePathname } from "next/navigation";

const OfferLetter = ({ ucn = '',type = 'OfferLetter', onAction = () => {}}) => {
  const pathName = usePathname();
  const data = {};

  const inputFields = [
    { label: "Details", placeholder: "Write your details", multiline: true },
    { label: "Salary", placeholder: "Enter salary details", multiline: false },
  ];

  const [payload, setPayload] = useState({
    'type' : type === "CounterOfferLetter" ? 'counter_offer_letter' : 'offer_letter',
    'description' : '',
    'salary' : '',
  });

  const handleChange = (key, value) => {
    setPayload(prevState => ({
        ...prevState,
        [key]: value,
    }));
  }

  const handleOfferSend = () => {
    if(payload.description === ''){
      alert("Descripion is Required");
      return;
    }
    if(payload.salary === ''){
      alert("Salary is Required");
      return;
    }
    onAction(payload);
  }

  return (
    <div>
      {!pathName.includes("/employer") ? (
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
              {data?.titleType || "Offer later"}
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
              {data?.ucnNumber || "34125"}
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
          </Typography>
          <Button
            sx={{
              minWidth: "112px",
              border: "1px solid #000000",
              fontSize: "14px",
              lineHeight: "21px",
              color: "#00305B",
            }}
          >
            {data?.ucn || "14253"}
          </Button>
          <Box sx={{ py: 2 }}>
            <RalliButton label="accept" bg="#00305B" />
          </Box>
          <RalliButton label="Decline" />
        </Box>
      ) : (
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
              {type === "CounterOfferLetter" ? "Counter Offer Letter" : "Offer Letter"}
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
              UCN : {ucn ?? ''}
            </Typography>
          </Box>

          <Box key="description" sx={{ py: 2 }}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "30px",
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

          <Box key="description" sx={{ py: 2 }}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "30px",
                color: "#00305B",
                mb: 1,
              }}
            >
              Salary
          <span style={{ color: "red" }}>*</span>
            </Typography>
            <Box
              component="input"
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
              placeholder="Your Salary Offer"
              value={payload?.salary}
              onChange={(e) => handleChange('salary', e?.target?.value)}
            />
          </Box>

          <RalliButton label='Send Offer' onClick={handleOfferSend} />
        </Box>
      )}
    </div>
  );
};

export default OfferLetter;
