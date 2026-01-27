"use client";

import React, { useCallback, useMemo } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Box, Typography } from "@mui/material";
import { parsePhoneNumberFromString } from "libphonenumber-js";

const MAX_NATIONAL_DIGITS = 15; // digits only, excluding country code; dashes are not digits

/**
 * Format national digits (0–15 chars) with dashes. Only [0-9] count as digits; dashes are display-only.
 * Pattern: XXX-XXX-XXXX for first 10, then -X for each of 11–15.
 * Example: "9012034332" -> "901-203-4332"; "90120343321" -> "901-203-4332-1"
 */
function formatNationalWithDashes(nationalDigits) {
  const digitsOnly = String(nationalDigits || "")
    .replace(/\D/g, "")
    .slice(0, MAX_NATIONAL_DIGITS);
  if (digitsOnly.length <= 3) return digitsOnly;
  if (digitsOnly.length <= 6)
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
  if (digitsOnly.length <= 10)
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
  return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}-${digitsOnly.slice(10, MAX_NATIONAL_DIGITS)}`;
}

/**
 * From displayed input string and current E.164, produce new E.164.
 * Only digits are counted; dashes are ignored. National part is capped at 15 digits.
 */
function dashedInputToE164(inputStr, currentE164) {
  const digitsOnly = (inputStr || "").replace(/\D/g, "");
  if (digitsOnly.length === 0) return undefined;
  const parsed = parsePhoneNumberFromString(currentE164 || "+1");
  const cc = String(parsed?.countryCallingCode || "1");
  const ccLen = cc.length;
  const national = digitsOnly.slice(ccLen).slice(0, MAX_NATIONAL_DIGITS);
  return `+${cc}${national}`;
}

/**
 * E.164 (e.g. "+19012034332") -> display string "+1-901-203-4332". Dashes separate digits; they are not digits.
 */
function e164ToDashedDisplay(e164) {
  if (!e164) return "";
  const parsed = parsePhoneNumberFromString(e164);
  if (!parsed) return e164;
  const national = String(parsed.nationalNumber || "").replace(/\D/g, "");
  return `+${parsed.countryCallingCode}-${formatNationalWithDashes(national)}`;
}

const PhoneNumberField = ({
  value,
  handlePhoneNumberChange,
  placeholder,
  error,
}) => {
  const handleChange = useCallback(
    (phone) => {
      if (!phone) {
        handlePhoneNumberChange("");
        return;
      }
      const parsed = parsePhoneNumberFromString(phone);
      if (!parsed) return;
      const nationalDigits = String(parsed.nationalNumber || "").replace(
        /\D/g,
        ""
      );
      if (nationalDigits.length > MAX_NATIONAL_DIGITS) {
        const capped = nationalDigits.slice(0, MAX_NATIONAL_DIGITS);
        handlePhoneNumberChange(`+${parsed.countryCallingCode}${capped}`);
        return;
      }
      handlePhoneNumberChange(phone);
    },
    [handlePhoneNumberChange]
  );

  const DashFormatInput = useMemo(
    () =>
      React.forwardRef(function DashFormatInputInner(props, ref) {
        const { value: libValue, onChange, ...rest } = props;
        const displayValue = e164ToDashedDisplay(libValue);

        const handleInputChange = (e) => {
          const nextE164 = dashedInputToE164(e.target.value, libValue);
          if (onChange)
            onChange({ target: { value: nextE164 != null ? nextE164 : "" } });
        };

        return (
          <input
            {...rest}
            ref={ref}
            type="tel"
            value={displayValue}
            onChange={handleInputChange}
            placeholder={placeholder}
          />
        );
      }),
    [placeholder]
  );

  return (
    <Box>
      <PhoneInput
        international
        defaultCountry="US"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        inputComponent={DashFormatInput}
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
