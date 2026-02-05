"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";

const GOOGLE_MAPS_API_KEY = "AIzaSyBEREiN-vfh4N5pGUgAsY2nRYNQARP-oUI";

// Extract postal code from address components
const extractZipCode = (components) => {
  if (!components) return "";
  const postal = components.find((comp) =>
    comp.types.includes("postal_code")
  );
  return postal ? postal.long_name : "";
};

// Extract state from address components
const extractState = (components) => {
  if (!components) return null;
  const state = components.find((comp) =>
    comp.types.includes("administrative_area_level_1")
  );
  return state ? { name: state.long_name, short: state.short_name } : null;
};

// Extract city from address components
const extractCity = (components) => {
  if (!components) return null;
  const city = components.find(
    (comp) =>
      comp.types.includes("locality") ||
      comp.types.includes("sublocality") ||
      comp.types.includes("administrative_area_level_2")
  );
  return city ? city.long_name : null;
};

// Extract country from address components
const extractCountry = (components) => {
  if (!components) return null;
  const country = components.find((comp) => comp.types.includes("country"));
  return country ? { name: country.long_name, short: country.short_name } : null;
};

const AddressAutocomplete = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Enter your address",
  showDetails = false,
  error,
  sx = {},
}) => {
  const inputRef = useRef(null);
  const [details, setDetails] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      initAutocomplete();
      return;
    }

    import("@googlemaps/js-api-loader").then(({ Loader }) => {
      if (cancelled) return;
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
      });
      loader.load().then(() => {
        if (!cancelled) {
          setIsLoaded(true);
          initAutocomplete();
        }
      }).catch((err) => {
        if (!cancelled) console.error("Error loading Google Maps:", err);
      });
    });
    return () => { cancelled = true; };
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

      if (!place.geometry) {
        console.warn("No geometry data for selected place");
        return;
      }

      const zip = extractZipCode(place.address_components);
      const state = extractState(place.address_components);
      const city = extractCity(place.address_components);
      const country = extractCountry(place.address_components);

      const addressDetails = {
        address: place.formatted_address || "",
        components: place.address_components,
        location: place.geometry?.location?.toJSON(),
        zipCode: zip,
        state,
        city,
        country,
      };

      setDetails(addressDetails);

      // Update the address value
      if (onChange) {
        onChange(place.formatted_address || "");
      }

      // Callback with full address details
      if (onAddressSelect) {
        onAddressSelect(addressDetails);
      }
    });
  };

  // Re-initialize autocomplete when input ref changes
  useEffect(() => {
    if (isLoaded && inputRef.current) {
      initAutocomplete();
    }
  }, [isLoaded]);

  return (
    <Box>
      <Box
        component="input"
        ref={inputRef}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        sx={{
          width: "100%",
          boxShadow: "0px 0px 3px 0.4px #00000040",
          border: "none",
          outline: "none",
          padding: "18px 20px",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: 300,
          lineHeight: "18px",
          color: "#222222",
          ...sx,
        }}
      />
      {error && (
        <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
          {error}
        </Typography>
      )}
      {showDetails && details && (
        <Box
          sx={{
            marginTop: "8px",
            width: "100%",
            boxShadow: "0px 0px 3px 1px #00000040",
            border: "none",
            padding: "18px 20px",
            borderRadius: "10px",
            fontSize: "14px",
          }}
        >
          <Typography>
            <strong>Address:</strong> {details.address}
          </Typography>
          {details.location && (
            <>
              <Typography>
                <strong>Lat:</strong> {details.location.lat}
              </Typography>
              <Typography>
                <strong>Lng:</strong> {details.location.lng}
              </Typography>
            </>
          )}
          {details.zipCode && (
            <Typography>
              <strong>Zip:</strong> {details.zipCode}
            </Typography>
          )}
          {details.city && (
            <Typography>
              <strong>City:</strong> {details.city}
            </Typography>
          )}
          {details.state && (
            <Typography>
              <strong>State:</strong> {details.state.name}
            </Typography>
          )}
          {details.country && (
            <Typography>
              <strong>Country:</strong> {details.country.name}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AddressAutocomplete;
