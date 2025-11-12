// // BasicInfo.jsx
// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { Box, Button, MenuItem, Select, Typography, FormControl } from "@mui/material";
// import ArrowCircleLeftRoundedIcon from "@mui/icons-material/ArrowCircleLeft";
// import { useWizard } from "react-use-wizard";
// import Image from "next/image";
// import RalliButton from "../button/RalliButton";
// import FormTitle from "../applicant/dashboard/FormTitle";
// import Container from "../common/Container";
// import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import dayjs from "dayjs";
// import Flag from "react-world-flags";
// import countryTelephoneData from "country-telephone-data";
// import {
//   applicantBasicInfoValidationSchema,
//   employerBasicInfoValidationSchema,
// } from "@/schemas/basicInfo";
// import { usePathname, useRouter } from "next/navigation";
// import { Loader } from "@googlemaps/js-api-loader";

// /**
//  * Notes:
//  * - formData is the parent's basicInfo object.
//  * - onFieldChange(name, value) updates parent's basicInfo.
//  * - dropdownStates and handleDropdownChange are passed from parent to synchronize ids.
//  */

// const BasicInfo = ({
//   data,
//   formData = {},
//   onFieldChange,
//   countries,
//   states,
//   cities,
//   ethnicities,
//   genders,
//   dropdownStates,
//   handleDropdownChange,
//   errors = {},
// }) => {
//   const { nextStep, previousStep } = useWizard();
//   const [validationErrors, setValidationErrors] = useState({});
//   const pathName = usePathname();
//   const router = useRouter();
//   const mergedErrors = { ...validationErrors, ...errors };

// //   useEffect(() => {
// //   if (formData) setFields(formData);
// // }, [formData]);


//   const validateForm = async () => {
//     try {
//       const schema = pathName.includes("/employer") ? employerBasicInfoValidationSchema : applicantBasicInfoValidationSchema;
//       await schema.validate(formData, { abortEarly: false });
//       setValidationErrors({});
//       return true;
//     } catch (validationErrors) {
//       const newErrors = validationErrors.inner.reduce((acc, error) => {
//         acc[error.path] = error.message;
//         return acc;
//       }, {});
//       setValidationErrors(newErrors);
//       return false;
//     }
//   };

//   const inputRef = useRef(null);
//   const [address, setAddress] = useState(formData.address || "");
//   const [details, setDetails] = useState(null);

//   const GOOGLE_MAPS_API_KEY = "AIzaSyANustHLajHU4YAtA3PnAs9rhzt7YResIg";

//   // ---- helpers ----
//   const normalize = (s) => (s ? String(s).trim().toLowerCase() : "");
//   const matchOptionIdByName = (list = [], incomingText = "") => {
//     if (!incomingText || !Array.isArray(list) || list.length === 0) return null;
//     const normalized = normalize(incomingText);
//     // exact match by name
//     const exact = list.find((x) => normalize(x.name) === normalized || normalize(x?.label) === normalized);
//     if (exact) return exact.id || exact.value || exact.code || exact.iso2 || null;
//     // partial match (startsWith or includes)
//     const starts = list.find((x) => normalize(x.name).startsWith(normalized));
//     if (starts) return starts.id || starts.value || null;
//     const includes = list.find((x) => normalize(x.name).includes(normalized));
//     if (includes) return includes.id || includes.value || null;
//     return null;
//   };

//   // split phone like +123456789 -> countryCode + phoneNumber
//   const splitPhone = (fullPhone) => {
//     if (!fullPhone) return {};
//     const cleaned = String(fullPhone).replace(/[()\s-]/g, "");
//     if (cleaned.startsWith("+")) {
//       const withoutPlus = cleaned.slice(1);
//       for (let len = 1; len <= 3; len++) {
//         const cc = withoutPlus.slice(0, len);
//         const rest = withoutPlus.slice(len);
//         if (rest.length >= 6) {
//           return { countryCode: `+${cc}`, phoneNumber: rest.slice(0, 15) };
//         }
//       }
//       return { countryCode: "+", phoneNumber: withoutPlus };
//     }
//     return { countryCode: formData.countryCode || "+1", phoneNumber: cleaned };
//   };

//   // ---- Effect: when parser supplies textual country/state/city names or address/phone, map them into dropdown ids & fields
//   useEffect(() => {
//     // Only attempt to map if relevant values exist in incoming formData
//     // Country
//     const incomingCountryText = formData.country || formData.country_name || formData.countryText;
//     if (incomingCountryText && !dropdownStates.country) {
//       const matchedCountryId = matchOptionIdByName(countries, incomingCountryText);
//       if (matchedCountryId) {
//         // set dropdown state via parent's handler and also set basicInfo country field
//         handleDropdownChange("country", matchedCountryId);
//         onFieldChange("country", matchedCountryId);
//       }
//     }

//     // State
//     const incomingStateText = formData.state || formData.state_name || formData.stateText;
//     if (incomingStateText && !dropdownStates.state) {
//       const matchedStateId = matchOptionIdByName(states, incomingStateText);
//       if (matchedStateId) {
//         handleDropdownChange("state", matchedStateId);
//         onFieldChange("state", matchedStateId);
//       }
//     }

//     // City
//     const incomingCityText = formData.city || formData.city_name || formData.cityText;
//     if (incomingCityText && !dropdownStates.city) {
//       const matchedCityId = matchOptionIdByName(cities, incomingCityText);
//       if (matchedCityId) {
//         handleDropdownChange("city", matchedCityId);
//         onFieldChange("city", matchedCityId);
//       } else {
//         // if no id match, set the raw city name into the basicInfo.city text field (if such field exists)
//         if (!formData.city) onFieldChange("city", incomingCityText);
//       }
//     }

//     // Gender / ethnicity mapping (if parser returns these as strings)
//     const incomingGender = formData.gender;
//     if (incomingGender && !dropdownStates.gender) {
//       const matchedGenderId = matchOptionIdByName(genders, incomingGender);
//       if (matchedGenderId) {
//         handleDropdownChange("gender", matchedGenderId);
//         onFieldChange("gender", matchedGenderId);
//       } else if (!formData.gender) {
//         onFieldChange("gender", incomingGender);
//       }
//     }

//     const incomingEthnicity = formData.ethnicity;
//     if (incomingEthnicity && !dropdownStates.ethnicities) {
//       const matchedEthId = matchOptionIdByName(ethnicities, incomingEthnicity);
//       if (matchedEthId) {
//         handleDropdownChange("ethnicities", matchedEthId);
//         onFieldChange("ethnicities", matchedEthId);
//       } else if (!formData.ethnicities) {
//         onFieldChange("ethnicities", incomingEthnicity);
//       }
//     }

//     // Address
//     if (formData.address && !address) {
//       setAddress(formData.address);
//       onFieldChange("address", formData.address);
//     }

//     // Zip code
//     if (formData.zip_code && !formData.zip_code) {
//       onFieldChange("zip_code", formData.zip_code);
//     }

//     // Phone split
//     if (formData.phone && !formData.phoneNumber) {
//       const { countryCode, phoneNumber } = splitPhone(formData.phone);
//       if (countryCode) onFieldChange("countryCode", countryCode);
//       if (phoneNumber) {
//         onFieldChange("phoneNumber", phoneNumber);
//         onFieldChange("phone", `${countryCode || formData.countryCode || ""}${phoneNumber}`);
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [countries, states, cities, genders, ethnicities]); // re-run when option lists become available

//   // ---- Google Places autcomplete setup (unchanged) ----
//   useEffect(() => {
//     // keep parent's basicInfo.address in sync
//     onFieldChange("address", address);

//     const loader = new Loader({
//       apiKey: GOOGLE_MAPS_API_KEY,
//       libraries: ["places"],
//     });

//     let autocomplete;
//     loader.load().then(() => {
//       if (!inputRef.current || !window.google) return;

//       autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
//         types: ["geocode"],
//       });

//       autocomplete.addListener("place_changed", () => {
//         const place = autocomplete.getPlace();
//         if (!place) return;
//         const components = place.address_components || [];
//         const zip = components.find((comp) => comp.types.includes("postal_code"));
//         const zipCode = zip ? zip.long_name : "";
//         setAddress(place.formatted_address || "");
//         setDetails({
//           address: place.formatted_address,
//           components,
//           location: place.geometry?.location?.toJSON(),
//           zipCode,
//         });

//         onFieldChange("address", place.formatted_address || "");
//         if (zipCode) onFieldChange("zip_code", zipCode);
//       });
//     });

//     return () => {
//       if (autocomplete && autocomplete.removeListener) {
//         try {
//           // best-effort cleanup
//           autocomplete.unbindAll && autocomplete.unbindAll();
//         } catch (e) {}
//       }
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [inputRef]);

//   const handleNext = async () => {
//     const isValid = await validateForm();
//     if (isValid) {
//       nextStep();
//     }
//   };

//   const handleBack = () => {
//     if (pathName.includes("applicant")) {
//       router.push("/applicant/login");
//     } else {
//       router.push("/employer/login");
//     }
//   };

//   return (
//     <Container>
//       <Box sx={{ height: "100vh", backgroundColor: "#FFFFFF" }}>
//         {/* Header */}
//         <Box
//           sx={{
//             width: { xs: "100%", sm: "50%" },
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             py: "15px",
//             mb: "20px",
//           }}
//         >
//           <Button onClick={handleBack} sx={{ minWidth: 0, p: 0 }}>
//             <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
//           </Button>
//           <Image src={data?.logo} width={70} height={140} alt="logo" />
//         </Box>

//         <FormTitle label={data?.title} />

//         {/* Form Fields */}
//         {data.form.map((item) => (
//           <Box key={item?.name || item?.label} sx={{ mb: "10px" }}>
//             <Typography sx={{ fontWeight: 600, fontSize: "16px", mb: "3px" }}>
//               {item.label}
//               {item.required && (
//                 <Typography component="span" sx={{ color: "red" }}>
//                   *
//                 </Typography>
//               )}
//             </Typography>

//             {item.name === "dob" ? (
//               <LocalizationProvider dateAdapter={AdapterDayjs}>
//                 <DatePicker
//                   views={["year", "month", "day"]}
//                   value={formData[item.name] ? dayjs(formData[item.name]) : null}
//                   onChange={(date) => onFieldChange(item.name, date ? dayjs(date).format("YYYY-MM-DD") : "")}
//                   maxDate={dayjs()}
//                   slotProps={{
//                     textField: {
//                       placeholder: item.placeHolder,
//                       sx: {
//                         width: "100%",
//                         borderRadius: "10px",
//                         boxShadow: "0px 0px 3px 1px #00000040",
//                         "& input": { padding: "13px 10px" },
//                         "& fieldset": { border: "none !important" },
//                       },
//                     },
//                   }}
//                   sx={{
//                     width: "100%",
//                     boxShadow: "0px 0px 3px 1px #00000040",
//                   }}
//                 />
//               </LocalizationProvider>
//             ) : item.name === "phone" ? (
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 1,
//                   width: "100%",
//                   boxShadow: "0px 0px 3px 1px #00000040",
//                   borderRadius: "10px",
//                   alignItems: "center",
//                 }}
//               >
//                 <FormControl sx={{ minWidth: 90 }}>
//                   <Select
//                     value={formData.countryCode || "+1"}
//                     onChange={(e) => {
//                       const newFullPhone = `${e.target.value}${formData.phoneNumber || ""}`;
//                       onFieldChange("countryCode", e.target.value);
//                       onFieldChange(item.name, newFullPhone);
//                     }}
//                     sx={{
//                       borderRadius: "10px",
//                       height: "48px",
//                       minWidth: "120px",
//                     }}
//                   >
//                     {countryTelephoneData.allCountries.map((country) => (
//                       <MenuItem key={country.iso2} value={`+${country.dialCode}`}>
//                         <Flag code={country.iso2.toUpperCase()} style={{ width: 20, marginRight: 8 }} />
//                         {country.name} +{country.dialCode}
//                       </MenuItem>
//                     ))}
//                   </Select>
//                 </FormControl>

//                 <Box sx={{ display: "flex", gap: 1, width: "100%", padding: "0 8px", alignItems: "center" }}>
//                   <Box
//                     component="input"
//                     type="tel"
//                     placeholder={item.placeHolder || "Enter phone number"}
//                     value={formData.phoneNumber || ""}
//                     onChange={(e) => {
//                       const value = e.target.value.replace(/\D/g, "").slice(0, 15);
//                       onFieldChange("phoneNumber", value);
//                       onFieldChange(item.name, `${formData.countryCode || "+1"}${value}`);
//                     }}
//                     style={{ flex: 1, border: "none", outline: "none", fontSize: "16px", padding: "12px", borderRadius: "10px" }}
//                   />
//                 </Box>
//               </Box>
//             ) : ["country", "state", "city", "ethnicity", "gender"].includes(item.name) ? (
//               <Select
//                 value={dropdownStates[item.name] || ""}
//                 onChange={(e) => {
//                   handleDropdownChange(item.name, e.target.value);
//                   onFieldChange(item.name, e.target.value);
//                 }}
//                 displayEmpty
//                 fullWidth
//                 renderValue={(selected) =>
//                   selected ? (
//                     (item.name === "country" ? countries : item.name === "state" ? states : item.name === "city" ? cities : item.name === "ethnicity" ? ethnicities : genders)?.find((opt) => opt.id === selected)?.name ||
//                     selected
//                   ) : (
//                     <span style={{ color: "#A9A9A9" }}>Select {item.placeHolder}</span>
//                   )
//                 }
//                 sx={{ boxShadow: "0px 0px 3px 1px #00000040", borderRadius: "10px" }}
//               >
//                 <MenuItem value="">
//                   <em>Select {item.label}</em>
//                 </MenuItem>
//                 {(item.name === "country" ? countries : item.name === "state" ? states : item.name === "city" ? cities : item.name === "ethnicity" ? ethnicities : genders)?.map((option) => (
//                   <MenuItem key={option.id} value={option.id}>
//                     {option.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             ) : item.name === "address" ? (
//               <>
//                 <Box
//                   component="input"
//                   ref={inputRef}
//                   placeholder={item.placeHolder}
//                   value={address || formData.address || ""}
//                   onChange={(e) => {
//                     onFieldChange(item.name, e.target.value);
//                     setAddress(e.target.value);
//                   }}
//                   sx={{
//                     width: "100%",
//                     boxShadow: "0px 0px 3px 1px #00000040",
//                     border: "none",
//                     padding: "18px 20px",
//                     borderRadius: "10px",
//                     fontSize: "16px",
//                   }}
//                 />

//                 {details && (
//                   <Box sx={{ marginTop: "8px", width: "100%", boxShadow: "0px 0px 3px 1px #00000040", border: "none", padding: "18px 20px", borderRadius: "10px", fontSize: "16px" }}>
//                     <Typography>
//                       <strong>Address:</strong> {details.address}
//                     </Typography>
//                     <Typography>
//                       <strong>Lat:</strong> {details.location?.lat}
//                     </Typography>
//                     <Typography>
//                       <strong>Lng:</strong> {details.location?.lng}
//                     </Typography>
//                     <Typography>
//                       <strong>Zip:</strong> {details.zipCode || "N/A"}
//                     </Typography>
//                   </Box>
//                 )}
//               </>
//             ) : (
//               <Box
//                 component="input"
//                 placeholder={item.placeHolder}
//                 value={formData[item.name] || ""}
//                 onChange={(e) => onFieldChange(item.name, e.target.value)}
//                 sx={{
//                   width: "100%",
//                   boxShadow: "0px 0px 3px 1px #00000040",
//                   border: "none",
//                   padding: "18px 20px",
//                   borderRadius: "10px",
//                   fontSize: "16px",
//                 }}
//               />
//             )}

//             {mergedErrors[item.name] && <Typography sx={{ color: "red", fontSize: "12px", mt: "5px" }}>{mergedErrors[item.name]}</Typography>}
//           </Box>
//         ))}

//         {/* Buttons */}
//         <Box sx={{ py: 2 }}>
//           <RalliButton label="Next" onClick={handleNext} />
//         </Box>
//         <Box sx={{ display: "flex", justifyContent: "center" }}>
//           <Button variant="text" onClick={previousStep} sx={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>
//             Previous
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default BasicInfo;


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

  const GOOGLE_MAPS_API_KEY = "AIzaSyANustHLajHU4YAtA3PnAs9rhzt7YResIg";

  // 🔑 Extract postal code
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
            <ArrowCircleLeftRoundedIcon sx={{ color: "#00305B", fontSize: 32 }} />
          </Button>
                    <Image src={data?.logo} width={70} height={70} alt="logo" style={{
                      border: "1px solid #fff", 
                      borderRadius: 40
                    }} />
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
              // 🗓️ Date Picker
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={["year", "month", "day"]}
                  value={
                    formData[item.name] ? dayjs(formData[item.name]) : null
                  }
                  onChange={(date) =>
                    onFieldChange(
                      item.name,
                      date ? dayjs(date).format("YYYY-MM-DD") : ""
                    )
                  }
                  maxDate={dayjs()}
                  slotProps={{
                    textField: {
                      placeholder: item.placeHolder,
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
                    {countryTelephoneData.allCountries.map((country) => (
                      <MenuItem key={country.iso2} value={`+${country.dialCode}`}>
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
                      const value = e.target.value.replace(/\D/g, "").slice(0, 10);
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

