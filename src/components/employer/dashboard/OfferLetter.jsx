import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Select, MenuItem } from "@mui/material";
import RalliButton from "@/components/button/RalliButton";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { countryToCurrency } from "@/constant/applicant/countryCurrency/countryCurrency";

const OfferLetter = ({ ucn = '', type = 'OfferLetter', onAction = () => { } }) => {
  const pathName = usePathname();
  const data = {};

  const inputFields = [
    { label: "Details", placeholder: "Write your details", multiline: true },
    { label: "Salary", placeholder: "Enter salary details", multiline: false },
  ];

  const [payload, setPayload] = useState({
    'type': type === "CounterOfferLetter" ? 'counter_offer_letter' : 'offer_letter',
    'description': '',
    'salary': '',
    'salary_currency': 'USD',
  });

  const [currencies, setCurrencies] = useState([]);
  const { userData } = useSelector((state) => state.auth);

  useEffect(() => {
    const uniqueCodes = Array.from(
      new Set(Object.values(countryToCurrency).filter(Boolean))
    ).sort();
    setCurrencies(uniqueCodes);

    const employerCountry = userData?.user?.employer?.country;
    let defaultCurr = "USD";
    if (employerCountry) {
      if (countryToCurrency[employerCountry]) {
        defaultCurr = countryToCurrency[employerCountry];
      } else {
        const upper = String(employerCountry).toUpperCase();
        if (countryToCurrency[upper]) defaultCurr = countryToCurrency[upper];
      }
    }
    handleChange('salary_currency', defaultCurr);
  }, [userData]);

  const handleChange = (key, value) => {
    setPayload(prevState => ({
      ...prevState,
      [key]: value,
    }));
  }

  const handleOfferSend = () => {
    if (payload.description === '') {
      alert("Description is Required");
      return;
    }
    if (payload.salary === '') {
      alert("Salary is Required");
      return;
    }
    if (payload.salary_currency === '') {
      alert("Currency is Required");
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
              {data?.titleType || "Offer letter"}
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
              {type === "CounterOfferLetter" ? "Counteroffer Letter" : "Offer Letter"}
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

          <Box key="salary" sx={{ py: 2 }}>
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
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Select
                value={payload?.salary_currency || "USD"}
                onChange={(e) => handleChange('salary_currency', e.target.value)}
                sx={{
                  width: "120px",
                  boxShadow: "0px 0px 3px 1px #00000040",
                  borderRadius: "10px",
                  "& fieldset": { border: "none" },
                  backgroundColor: "#fff",
                }}
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
              <Box
                component="input"
                sx={{
                  flex: 1,
                  boxShadow: "0px 0px 3px 1px #00000040",
                  border: "none",
                  padding: "18px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: "18px",
                  color: "#222222",
                }}
                placeholder="Your Salary Offer (e.g., 80,000)"
                value={payload?.salary}
                onChange={(e) => handleChange('salary', e?.target?.value)}
              />
            </Box>
          </Box>

          <RalliButton label='Send Offer' onClick={handleOfferSend} />
        </Box>
      )}
    </div>
  );
};

export default OfferLetter;
