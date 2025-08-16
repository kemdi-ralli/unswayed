"use client";
import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Box, Typography } from "@mui/material";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";

const MAX_DIGITS = 10;

const PhoneNumberField = ({
  value,
  handlePhoneNumberChange,
  placeholder,
  error,
}) => {
 const handleChange = (phone) => {
  if (!phone) {
    handlePhoneNumberChange("");
    return;
  }

  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber) return;

  let nationalNumber = phoneNumber.nationalNumber || "";

  // Restrict the national number to a maximum of 10 digits
  if (nationalNumber.length > 10) {
    nationalNumber = nationalNumber.slice(0, 10);
    // Reconstruct the phone number with the country code and truncated national number
    const formatted = `+${phoneNumber.countryCallingCode}${nationalNumber}`;
    handlePhoneNumberChange(formatted);
    return;
  }

  handlePhoneNumberChange(phone);
};

  return (
    <Box>
      <PhoneInput
        international
        defaultCountry="US"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="custom-phone-input"
      />
      {error && (
        <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
          {error}
        </Typography>
      )}

      <style jsx global>{`
        .custom-phone-input .PhoneInputInput {
          width: 100%;
          border: none;
          border-radius: 10px;
          box-shadow: 0px 0px 3px 1px #00000040;
          padding: 18px 20px;
          font-size: 16px;
          font-weight: 300;
          color: #000;
        }

        .custom-phone-input .PhoneInputInput::placeholder {
          color: #a9a9a9;
          font-size: 14px;
          font-weight: 300;
        }
      `}</style>
    </Box>
  );
};

export default PhoneNumberField;
