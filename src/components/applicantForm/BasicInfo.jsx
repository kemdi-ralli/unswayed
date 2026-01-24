"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Typography,
  FormControl,
  CircularProgress,
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
import * as Yup from "yup";
import { formatPhoneNumber, extractPhoneNumbers } from "@/utils/phoneFormatter";

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
  isLoadingStates = false,
}) => {
  const { nextStep, previousStep } = useWizard();
  const [validationErrors, setValidationErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const pathName = usePathname();
  const router = useRouter();

  const mergedErrors = { ...validationErrors, ...errors };

  // Get the appropriate schema based on path
  const getSchema = () => {
    return pathName.includes("/employer")
      ? employerBasicInfoValidationSchema
      : applicantBasicInfoValidationSchema;
  };

  // Validate a single field
  const validateField = async (fieldName, value) => {
    try {
      const schema = getSchema();
      const fieldSchema = Yup.reach(schema, fieldName);
      await fieldSchema.validate(value);
      
      // Clear error for this field if valid
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
      return true;
    } catch (error) {
      setValidationErrors((prev) => ({
        ...prev,
        [fieldName]: error.message,
      }));
      return false;
    }
  };

  // Validate on blur
  const handleBlur = (name, value) => {
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  // Handle field change with immediate validation
  const handleFieldChangeWithValidation = (name, value) => {
    onFieldChange(name, value);
    setTouchedFields((prev) => ({ ...prev, [name]: true }));
    
    // Debounced validation for text inputs
    validateField(name, value);
  };

  const validateForm = async () => {
    try {
      const schema = getSchema();
      await schema.validate(formData, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = validationErrors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      
      // Mark all fields as touched
      const allTouched = {};
      data?.form?.forEach((item) => {
        allTouched[item.name] = true;
      });
      setTouchedFields(allTouched);
      
      setValidationErrors(newErrors);
      return false;
    }
  };

  const inputRef = useRef(null);
  const [details, setDetails] = useState(null);

  const GOOGLE_MAPS_API_KEY = "AIzaSyBEREiN-vfh4N5pGUgAsY2nRYNQARP-oUI";

  // Extract postal code
  const extractZipCode = (components) => {
    if (!components) return "";
    const postal = components.find((comp) =>
      comp.types.includes("postal_code")
    );
    return postal ? postal.long_name : "";
  };

  useEffect(() => {
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
        const selectedAddress = place.formatted_address || "";

        // Update the input field value with the selected address
        if (inputRef.current) {
          inputRef.current.value = selectedAddress;
        }

        // Update formData
        onFieldChange("address", selectedAddress);
        
        setDetails({
          address: selectedAddress,
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

  // Check if field should show error (only if touched)
  const shouldShowError = (fieldName) => {
    return touchedFields[fieldName] && mergedErrors[fieldName];
  };

  // Get error styling for inputs
  const getInputErrorSx = (fieldName) => ({
    boxShadow: shouldShowError(fieldName)
      ? "0px 0px 3px 2px #ff000040"
      : "0px 0px 3px 1px #00000040",
    border: shouldShowError(fieldName) ? "1px solid #ff0000" : "none",
  });

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
                    setTouchedFields((prev) => ({ ...prev, dob: true }));
                    
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

                    // Valid age
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
                      error: shouldShowError("dob"),
                      onBlur: () => setTouchedFields((prev) => ({ ...prev, dob: true })),
                      sx: {
                        width: "100%",
                        borderRadius: "10px",
                        ...getInputErrorSx("dob"),
                        "& input": { padding: "13px 10px" },
                        "& fieldset": { border: "none !important" },
                      },
                    },
                  }}
                  sx={{
                    width: "100%",
                  }}
                />
              </LocalizationProvider>
            ) : item.name === "phone" ? (
              // Phone Number with Auto-Formatting: (+1)-234-567-8900
              <Box
                component="input"
                type="tel"
                placeholder="(+1)-234-567-8900"
                value={formData[item.name] || ""}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  onFieldChange(item.name, formatted);
                  setTouchedFields((prev) => ({ ...prev, phone: true }));
                  
                  // Validate phone (must be 11 digits: 1 country code + 10 number)
                  const numbers = extractPhoneNumbers(formatted);
                  if (numbers.length > 0 && numbers.length < 11) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      phone: "Phone number must be 11 digits in format (+1)-234-567-8900",
                    }));
                  } else {
                    setValidationErrors((prev) => {
                      const { phone, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                onBlur={() => {
                  setTouchedFields((prev) => ({ ...prev, phone: true }));
                  const numbers = extractPhoneNumbers(formData[item.name] || "");
                  if (numbers.length > 0 && numbers.length < 11) {
                    setValidationErrors((prev) => ({
                      ...prev,
                      phone: "Phone number must be 11 digits in format (+1)-234-567-8900",
                    }));
                  }
                }}
                sx={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  fontWeight: 300,
                  padding: "18px 20px",
                  borderRadius: "10px",
                  color: "#222222",
                  ...getInputErrorSx("phone"),
                  "&::placeholder": {
                    color: "#00000040",
                    fontSize: "16px",
                  },
                  "&:focus": {
                    boxShadow: shouldShowError("phone")
                      ? "0px 0px 3px 2px #ff000060"
                      : "0px 0px 5px #00305B80",
                  },
                }}
              />
            ) : ["country", "state", "city", "ethnicity", "gender"].includes(
                item.name
              ) ? (
              // Dropdowns
              <Box sx={{ position: "relative" }}>
                <Select
                  value={dropdownStates[item.name] || ""}
                  onChange={(e) => {
                    handleDropdownChange(item.name, e.target.value);
                    onFieldChange(item.name, e.target.value);
                    setTouchedFields((prev) => ({ ...prev, [item.name]: true }));
                    
                    // Clear error when value selected
                    if (e.target.value) {
                      setValidationErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors[item.name];
                        return newErrors;
                      });
                    }
                  }}
                  onBlur={() => {
                    setTouchedFields((prev) => ({ ...prev, [item.name]: true }));
                    if (!dropdownStates[item.name]) {
                      setValidationErrors((prev) => ({
                        ...prev,
                        [item.name]: `${item.label} is required`,
                      }));
                    }
                  }}
                  displayEmpty
                  fullWidth
                  disabled={item.name === "state" && isLoadingStates}
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
                        {item.name === "state" && isLoadingStates 
                          ? "Loading states..." 
                          : `Select ${item.placeHolder}`}
                      </span>
                    )
                  }
                  sx={{
                    ...getInputErrorSx(item.name),
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
                {item.name === "state" && isLoadingStates && (
                  <CircularProgress
                    size={20}
                    sx={{
                      position: "absolute",
                      right: 40,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  />
                )}
              </Box>
            ) : item.name === "address" ? (
              <>
                <Box
                  component="input"
                  ref={inputRef}
                  placeholder={item.placeHolder}
                  defaultValue={formData.address || ""}
                  onChange={(e) => {
                    onFieldChange(item.name, e.target.value);
                    setTouchedFields((prev) => ({ ...prev, address: true }));
                  }}
                  onBlur={() => handleBlur("address", formData.address)}
                  sx={{
                    width: "100%",
                    ...getInputErrorSx("address"),
                    padding: "18px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    "&:focus": {
                      outline: "none",
                      boxShadow: shouldShowError("address")
                        ? "0px 0px 3px 2px #ff000060"
                        : "0px 0px 5px #00305B80",
                    },
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
              // Default Input
              <Box
                component="input"
                placeholder={item.placeHolder}
                value={formData[item.name] || ""}
                onChange={(e) => handleFieldChangeWithValidation(item.name, e.target.value)}
                onBlur={(e) => handleBlur(item.name, e.target.value)}
                sx={{
                  width: "100%",
                  ...getInputErrorSx(item.name),
                  padding: "18px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  "&:focus": {
                    outline: "none",
                    boxShadow: shouldShowError(item.name)
                      ? "0px 0px 3px 2px #ff000060"
                      : "0px 0px 5px #00305B80",
                  },
                }}
              />
            )}

            {/* Error message directly below the field */}
            {shouldShowError(item.name) && (
              <Typography 
                sx={{ 
                  color: "red", 
                  fontSize: "12px", 
                  mt: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                ⚠ {mergedErrors[item.name]}
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