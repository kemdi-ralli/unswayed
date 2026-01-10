"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
} from "@mui/material";
import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeft";
import { useWizard } from "react-use-wizard";
import Image from "next/image";
import RalliButton from "../button/RalliButton";
import FormTitle from "../applicant/dashboard/FormTitle";
import Container from "../common/Container";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Flag from "react-world-flags";
import countryTelephoneData from "country-telephone-data";
import {
  applicantBasicInfoValidationSchema,
  employerBasicInfoValidationSchema,
} from "@/schemas/basicInfo";
import { usePathname, useRouter } from "next/navigation";
import { Loader } from "@googlemaps/js-api-loader";


const BasicInfo = ({
  data,
  formData,
  onFieldChange,
  countries,
  states,
  cities,
  ethnicities,
  genders,
  dropdownStates,
  handleDropdownChange,
  errors = {},
}) => {
  const { nextStep, previousStep } = useWizard();
  const [validationErrors, setValidationErrors] = useState({});
  const pathName = usePathname();
  const router = useRouter();

  const mergedErrors = { ...validationErrors, ...errors };

  const validateForm = async () => {
    try {
      const schema = pathName.includes("/employer")
        ? employerBasicInfoValidationSchema
        : applicantBasicInfoValidationSchema;

      await schema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = validationErrors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setValidationErrors(newErrors);
      return false;
    }
  };

  const inputRef = useRef(null);
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyBEREiN-vfh4N5pGUgAsY2nRYNQARP-oUI";

  // 🔒 Extract postal code
  const extractZipCode = (components) => {
    if (!components) return "";
    const postal = components.find((comp) =>
      comp.types.includes("postal_code")
    );
    return postal ? postal.long_name : "";
  };

  useEffect(() => {
    formData.address = address;

    const loader = new Loader({
      apiKey: GOOGLE_MAPS_API_KEY,
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (!inputRef.current) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["geocode"] }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const zip = extractZipCode(place.address_components);

        setAddress(place.formatted_address || "");
        setDetails({
          address: place.formatted_address,
          components: place.address_components,
          location: place.geometry?.location?.toJSON(),
          zipCode: zip,
        });

        if (zip) {
          onFieldChange("zip_code", zip);
        }
      });
    });
  }, []);

  const handleNext = async () => {
    const isValid = await validateForm();
    if (isValid) {
      nextStep();
    }
  };

  const handleBack = () => {
    if (pathName.includes("applicant")) {
      router.push("/applicant/login");
    } else {
      router.push("/employer/login");
    }
  };

  return (
    <Container>
      <Box sx={{ height: "100vh", backgroundColor: "#FFFFFF" }}>
        {/* Header */}
        <Box
          sx={{
            width: { xs: "100%", sm: "50%" },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: "15px",
            mb: "20px",
          }}
        >
          <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
            <ArrowCircleLeftRoundedIcon
              sx={{ color: "#00305B", fontSize: 32 }}
            />
          </Button>
          <Image
            src={data?.logo}
            width={70}
            height={70}
            alt="logo"
            style={{
              border: "1px solid #fff",
              borderRadius: 40,
            }}
          />
        </Box>

        <FormTitle label={data?.title} />

        {/* Form Fields */}
        {data.form.map((item) => (
          <Box key={item?.name || item?.label} sx={{ mb: "10px" }}>
            <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "3px" }}>
              {item.label}
              {item.required && (
                <Typography component="span" sx={{ color: "red" }}>
                  *
                </Typography>
              )}
            </Typography>

            {/* Field Types */}
           {item.name === "dob" ? (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      views={["year", "month", "day"]}
      value={formData[item.name] ? dayjs(formData[item.name]) : null}
      onChange={(date) => {
        if (!date) {
          onFieldChange(item.name, "");
          setValidationErrors((prev) => ({
            ...prev,
            dob: "Date of birth is required",
          }));
          return;
        }

        const age = dayjs().diff(dayjs(date), "year");

        if (age < 18) {
          onFieldChange(item.name, dayjs(date).format("YYYY-MM-DD"));
          setValidationErrors((prev) => ({
            ...prev,
            dob: "You must be at least 18 years old to continue",
          }));
          return;
        }

        // ✅ Valid age
        onFieldChange(item.name, dayjs(date).format("YYYY-MM-DD"));
        setValidationErrors((prev) => {
          const { dob, ...rest } = prev;
          return rest;
        });
      }}
      maxDate={dayjs()}
      slotProps={{
        textField: {
          placeholder: item.placeHolder,
          error: Boolean(mergedErrors.dob),
          sx: {
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0px 0px 3px 1px #00000040",
            "& input": { padding: "13px 10px" },
            "& fieldset": { border: "none !important" },
          },
        },
      }}
      sx={{
        width: "100%",
        boxShadow: "0px 0px 3px 1px #00000040",
      }}
    />
  </LocalizationProvider>
) : item.name === "phone" ? (
              // 📱 Country Code + Phone Number
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "100%",
                  boxShadow: "0px 0px 3px 1px #00000040",
                  borderRadius: "10px",
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ minWidth: 90 }}>
                  <Select
                    value={formData.countryCode || "+1"}
                    onChange={(e) => {
                      const newFullPhone = `${e.target.value}${
                        formData.phoneNumber || ""
                      }`;
                      onFieldChange("countryCode", e.target.value);
                      onFieldChange(item.name, newFullPhone);
                    }}
                    sx={{
                      borderRadius: "10px",
                      height: "48px",
                      minWidth: "120px",
                    }}
                  >
                    {countryTelephoneData.allCountries
                      .filter(
                        (country) =>
                          country.name !==
                          "United States Minor Outlying Islands"
                      )
                      .map((country) => (
                        <MenuItem
                          key={country.iso2}
                          value={`+${country.dialCode}`}
                        >
                          <Flag
                            code={country.iso2.toUpperCase()}
                            style={{ width: 20, marginRight: 8 }}
                          />
                          {country.name} +{country.dialCode}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    width: "100%",
                    padding: "0 8px",
                    alignItems: "center",
                  }}
                >
                  <Box
                    component="input"
                    type="tel"
                    placeholder={item.placeHolder || "Enter phone number"}
                    value={formData.phoneNumber || ""}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      onFieldChange("phoneNumber", value);
                      onFieldChange(
                        item.name,
                        `${formData.countryCode || "+1"}${value}`
                      );
                    }}
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      fontSize: "16px",
                      padding: "12px",
                      borderRadius: "10px",
                    }}
                  />
                </Box>
              </Box>
            ) : ["country", "state", "city", "ethnicity", "gender"].includes(
                item.name
              ) ? (
              // 🌍 Dropdowns
              <Select
                value={dropdownStates[item.name] || ""}
                onChange={(e) => {
                  handleDropdownChange(item.name, e.target.value);
                  onFieldChange(item.name, e.target.value);
                }}
                displayEmpty
                fullWidth
                renderValue={(selected) =>
                  selected ? (
                    (item.name === "country"
                      ? countries
                      : item.name === "state"
                      ? states
                      : item.name === "city"
                      ? cities
                      : item.name === "ethnicity"
                      ? ethnicities
                      : genders
                    )?.find((opt) => opt.id === selected)?.name || selected
                  ) : (
                    <span style={{ color: "#A9A9A9" }}>
                      Select {item.placeHolder}
                    </span>
                  )
                }
                sx={{
                  boxShadow: "0px 0px 3px 1px #00000040",
                  borderRadius: "10px",
                }}
              >
                <MenuItem value="">
                  <em>Select {item.label}</em>
                </MenuItem>
                {(item.name === "country"
                  ? countries
                  : item.name === "state"
                  ? states
                  : item.name === "city"
                  ? cities
                  : item.name === "ethnicity"
                  ? ethnicities
                  : genders
                )?.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))}
              </Select>
            ) : item.name === "address" ? (
              <>
                <Box
                  component="input"
                  ref={inputRef}
                  placeholder={item.placeHolder}
                  value={formData.address || ""}
                  onChange={(e) => {
                    onFieldChange(item.name, e.target.value);
                    setAddress(e.target.value);
                  }}
                  sx={{
                    width: "100%",
                    boxShadow: "0px 0px 3px 1px #00000040",
                    border: "none",
                    padding: "18px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                  }}
                />
                {details && (
                  <Box
                    sx={{
                      marginTop: "8px",
                      width: "100%",
                      boxShadow: "0px 0px 3px 1px #00000040",
                      border: "none",
                      padding: "18px 20px",
                      borderRadius: "10px",
                      fontSize: "16px",
                    }}
                  >
                    <Typography>
                      <strong>Address:</strong> {details.address}
                    </Typography>
                    <Typography>
                      <strong>Lat:</strong> {details.location?.lat}
                    </Typography>
                    <Typography>
                      <strong>Lng:</strong> {details.location?.lng}
                    </Typography>
                    <Typography>
                      <strong>Zip:</strong> {details.zipCode || "N/A"}
                    </Typography>
                  </Box>
                )}
              </>
            ) : (
              // ✏️ Default Input
              <Box
                component="input"
                placeholder={item.placeHolder}
                value={formData[item.name] || ""}
                onChange={(e) => onFieldChange(item.name, e.target.value)}
                sx={{
                  width: "100%",
                  boxShadow: "0px 0px 3px 1px #00000040",
                  border: "none",
                  padding: "18px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                }}
              />
            )}

            {/* Validation Errors */}
            {mergedErrors[item.name] && (
              <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>
                {mergedErrors[item.name]}
              </Typography>
            )}
          </Box>
        ))}

        {/* Buttons */}
        <Box sx={{ py: 2 }}>
          <RalliButton label="Next" onClick={handleNext} />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="text"
            onClick={previousStep}
            sx={{ textDecoration: "underline", textUnderlineOffset: "3px" }}
          >
            Previous
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default BasicInfo;