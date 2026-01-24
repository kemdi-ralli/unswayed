"use client";
import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useWizard } from "react-use-wizard";
import RalliButton from "@/components/button/RalliButton";
import { enhanceText } from "@/helper/aiEnhanceHelper";
import AddAnotherButton from "./AddAnotherButton";
import Header from "./Header";
import ButtonIndex from "./ButtonIndex";
import FormField from "./FormField";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  COUNTRIES,
  COUNTRY_STATES_NAME,
  CITIES_STATES_NAME,
} from "@/services/apiService/apiEndPoints";

const US_INHABITED_TERRITORIES = [
  "American Samoa",
  "Guam",
  "Northern Mariana Islands",
  "Puerto Rico",
  "U.S. Virgin Islands",
];

const US_UNINHABITED_TERRITORIES = [
  "Baker Island",
  "Howland Island",
  "Jarvis Island",
  "Johnston Atoll",
  "Kingman Reef",
  "Midway Atoll",
  "Navassa Island",
  "Palmyra Atoll",
  "Wake Island",
];

const Certifications = ({
  data,
  onNext,
  certifications,
}) => {
  const { nextStep, previousStep } = useWizard();
  const [certification, setCertification] = useState(certifications || [{}]);
  const [enhanceAi, setEnhanceAi] = useState("");

  // Master countries list (fetched once)
  const [countries, setCountries] = useState([]);

  // Per-entry states and cities storage
  const [locationData, setLocationData] = useState({});

  // Loading states per entry
  const [loadingStates, setLoadingStates] = useState({});
  const [loadingCities, setLoadingCities] = useState({});

  const sectionRefs = useRef([]);
  const formTopRef = useRef(null);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await apiInstance.get(COUNTRIES);
        setCountries(response?.data?.data?.countries || []);
      } catch (error) {
        console.error("Failed to load countries:", error);
      }
    };
    fetchCountries();
  }, []);

  // Initialize location data for existing entries
  useEffect(() => {
    if (certifications?.length > 0) {
      setEnhanceAi(certifications[0]?.description || "");

      // Initialize location data for each entry
      const initialLocationData = {};
      certifications.forEach((cert, index) => {
        initialLocationData[index] = { states: [], cities: [] };
      });
      setLocationData(initialLocationData);

      // Fetch states/cities for entries that have country/state selected
      certifications.forEach((cert, index) => {
        if (cert.country) {
          fetchStatesForEntry(index, cert.country);
        }
        if (cert.state) {
          fetchCitiesForEntry(index, cert.state);
        }
      });

      setTimeout(() => {
        if (formTopRef.current) {
          const offset = 100;
          const top =
            formTopRef.current.getBoundingClientRect().top +
            window.pageYOffset -
            offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [certifications]);

  // Fetch states for a specific entry
  const fetchStatesForEntry = async (index, countryValue) => {
    if (!countryValue) {
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], states: [], cities: [] },
      }));
      return;
    }

    setLoadingStates((prev) => ({ ...prev, [index]: true }));

    try {
      const response = await apiInstance.get(
        `${COUNTRY_STATES_NAME}/${countryValue}`
      );
      let fetchedStates = response?.data?.data?.states || [];

      // Handle US territories
      if (countryValue === 233 || countryValue === "233") {
        const territoryNames = [
          ...US_INHABITED_TERRITORIES,
          ...US_UNINHABITED_TERRITORIES,
        ];
        const mainStates = fetchedStates.filter(
          (state) => !territoryNames.includes(state.name)
        );
        const territories = territoryNames.map((name) => ({ id: name, name }));
        fetchedStates = [...mainStates, ...territories];
      }

      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], states: fetchedStates, cities: [] },
      }));
    } catch (error) {
      console.error("Failed to load states:", error);
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], states: [], cities: [] },
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Fetch cities for a specific entry
  const fetchCitiesForEntry = async (index, stateValue) => {
    if (!stateValue) {
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], cities: [] },
      }));
      return;
    }

    setLoadingCities((prev) => ({ ...prev, [index]: true }));

    try {
      const response = await apiInstance.get(
        `${CITIES_STATES_NAME}/${stateValue}`
      );
      const fetchedCities = response?.data?.data?.cities || [];

      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], cities: fetchedCities },
      }));
    } catch (error) {
      console.error("Failed to load cities:", error);
      setLocationData((prev) => ({
        ...prev,
        [index]: { ...prev[index], cities: [] },
      }));
    } finally {
      setLoadingCities((prev) => ({ ...prev, [index]: false }));
    }
  };

  const handleEnhanceAi = async (index, description) => {
    try {
      const enhancedText = await enhanceText(description);
      setCertification((prev) =>
        prev.map((cert, i) =>
          i === index ? { ...cert, description: enhancedText } : cert
        )
      );
    } catch (error) {
      console.error("Error enhancing description:", error);
    }
  };

  const handleChange = (index, name, value) => {
    setCertification((prev) =>
      prev.map((form, i) => {
        if (i === index) {
          const updatedForm = { ...form, [name]: value };

          if (name === "country") {
            // Reset state and city when country changes
            updatedForm.state = "";
            updatedForm.city = "";
            // Fetch states for this entry
            fetchStatesForEntry(index, value);
          }

          if (name === "state") {
            // Reset city when state changes
            updatedForm.city = "";
            // Fetch cities for this entry
            fetchCitiesForEntry(index, value);
          }

          return updatedForm;
        }
        return form;
      })
    );
  };

  const handleAddCertification = () => {
    const newIndex = certification.length;

    // Initialize location data for new entry
    setLocationData((prev) => ({
      ...prev,
      [newIndex]: { states: [], cities: [] },
    }));

    setCertification((prev) => [...prev, {}]);

    setTimeout(() => {
      const lastRef = sectionRefs.current[newIndex];
      if (lastRef) {
        lastRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleNext = () => {
    onNext(certification);
    nextStep();
  };

  const handleBack = () => {
    previousStep();
  };

  const handleClose = (index) => {
    setCertification((prev) => prev.filter((_, i) => i !== index));
    sectionRefs.current.splice(index, 1);

    // Rebuild locationData with new indices
    setLocationData((prev) => {
      const newData = {};
      Object.keys(prev).forEach((key) => {
        const keyNum = parseInt(key);
        if (keyNum < index) {
          newData[keyNum] = prev[keyNum];
        } else if (keyNum > index) {
          newData[keyNum - 1] = prev[keyNum];
        }
      });
      return newData;
    });
  };

  return (
    <Box sx={{ minHeight: "100vh" }} ref={formTopRef}>
      <Header handleBack={handleBack} pages={data?.pages} title={data?.title} />

      {certification?.map((form, index) => (
        <Box
          key={index}
          ref={(el) => (sectionRefs.current[index] = el)}
          sx={{ mb: "20px" }}
        >
          <ButtonIndex
            label="Certificate"
            index={index}
            handleClose={handleClose}
          />
          {data?.form?.map((item) => (
            <FormField
              key={item.name}
              item={item}
              form={form}
              index={index}
              handleChange={handleChange}
              handleEnhanceAi={handleEnhanceAi}
              // Pass entry-specific location data
              countries={countries}
              states={locationData[index]?.states || []}
              cities={locationData[index]?.cities || []}
              checkedLabel="Currently Enrolled"
              loadingStates={loadingStates[index]}
              loadingCities={loadingCities[index]}
            />
          ))}
        </Box>
      ))}

      <AddAnotherButton
        onClick={handleAddCertification}
        label={"Certificate"}
      />
      <RalliButton label="Save & Continue" onClick={handleNext} />
    </Box>
  );
};

export default Certifications;