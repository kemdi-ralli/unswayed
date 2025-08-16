"use client";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClearIcon from "@mui/icons-material/Clear";
import SettingsIcon from "@mui/icons-material/Settings";
import ManagePrivacySwitch from "@/components/applicant/settings/manage-privacy/ManagePrivacySwitch";
import Container from "@/components/common/Container";
import apiInstance from "@/services/apiService/apiServiceInstance";
import PreferencesItem from "@/components/applicant/settings/manage-privacy/PreferencesItem";
import { Toast } from "@/components/Toast/Toast";
import RalliButton from "@/components/button/RalliButton";
import BackButton from "@/components/common/BackButton/BackButton";

const Page = () => {
  const [personalizedAds, setPersonalizedAds] = useState(false);
  const [trackingAnalytics, setTrackingAnalytics] = useState(false);
  const [thirdPartySharing, setThirdPartySharing] = useState(false);
  const [essentialCookies, setEssentialCookies] = useState(false);
  const [defaultSettings, setDefaultSettings] = useState(null);
  const [acceptAll, setAcceptAll] = useState(false);
  const [rejectAll, setRejectAll] = useState(false);
  const [showPreferences, setShowPreferences] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get("/settings?type=privacy");
      if (response.status === 200 || response.status === 201) {
        const data = response.data.data.setting.data;

        setPersonalizedAds(data.personalized_ads);
        setTrackingAnalytics(data.tracking_analytics);
        setThirdPartySharing(data.thirdparty_sharing);
        setEssentialCookies(data.cookies);

        setDefaultSettings(data);

        if (
          data.personalized_ads &&
          data.tracking_analytics &&
          data.thirdparty_sharing
        ) {
          setAcceptAll(true);
          setRejectAll(false);
          setShowPreferences(true);
        }
        else if (
          !data.personalized_ads &&
          !data.tracking_analytics &&
          !data.thirdparty_sharing
        ) {
          setAcceptAll(false);
          setRejectAll(true);
          setShowPreferences(false);
        }
        else if (
          data.personalized_ads ||
          data.tracking_analytics ||
          data.thirdparty_sharing
        ) {
          setShowPreferences(true);
        } else {
          setAcceptAll(false);
          setRejectAll(false);
        }
      } else {
        console.log("Failed to fetch settings");
      }
    } catch (error) {
      console.log("Error fetching settings:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (acceptAll) {
      setShowPreferences(true);
    }
    else if (personalizedAds || trackingAnalytics || thirdPartySharing) {
      setShowPreferences(true);
      setRejectAll(false);
      setAcceptAll(false)
    }
  }, [
    acceptAll,
    rejectAll,
    personalizedAds,
    trackingAnalytics,
    thirdPartySharing,
  ]);

  const handleAcceptAll = (checked) => {
    if (!acceptAll) {
      setAcceptAll(true);
      setRejectAll(false);
      setShowPreferences(true);

      setPersonalizedAds(true);
      setTrackingAnalytics(true);
      setThirdPartySharing(true);
      setEssentialCookies(true);
    }
  };

  const handleRejectAll = (checked) => {
    if (!rejectAll) {
      setRejectAll(true);
      setAcceptAll(false);
      setShowPreferences(false);

      setPersonalizedAds(false);
      setTrackingAnalytics(false);
      setThirdPartySharing(false);
      setEssentialCookies(true);
    }
  };
  const handleSavePreferences = async () => {
    const payload = {
      personalized_ads: personalizedAds,
      tracking_analytics: trackingAnalytics,
      thirdparty_sharing: thirdPartySharing,
      cookies: essentialCookies,
    };
    setSaveLoading(true);

    try {
      const response = await apiInstance.post("/settings/change-setting", {
        type: "privacy",
        data: payload,
      });
      if (response.status === 200 || response.status === 201) {
        Toast("success", response?.data?.message);
        fetchProfile();
      } else {
        console.log("Failed to update settings");
      }
    } catch (error) {
      console.log("Error updating settings:", error);
    }
    setSaveLoading(false);
  };

  return (
    <>
      <BackButton />
      <Container>
        {loading ? (
          <Box display="flex" justifyContent="center" py={5}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <ManagePrivacySwitch
              label="Accept All"
              icon={<CheckCircleIcon />}
              checked={acceptAll}
              onToggle={handleAcceptAll}
            />
            <ManagePrivacySwitch
              label="Reject All"
              icon={<ClearIcon />}
              checked={rejectAll}
              onToggle={handleRejectAll}
            />
            <ManagePrivacySwitch
              label="Manage Preferences"
              icon={<SettingsIcon />}
              checked={showPreferences}
              onToggle={setShowPreferences}
            />

            {showPreferences && (
              <Box sx={{ pl: 5 }}>
                <PreferencesItem
                  label="Personalized job ads"
                  checked={personalizedAds}
                  onToggle={() => setPersonalizedAds((prev) => !prev)}
                />
                <PreferencesItem
                  label="Tracking for analytics"
                  checked={trackingAnalytics}
                  onToggle={() => setTrackingAnalytics((prev) => !prev)}
                />
                <PreferencesItem
                  label="Third-party data sharing"
                  checked={thirdPartySharing}
                  onToggle={() => setThirdPartySharing((prev) => !prev)}
                />
                <PreferencesItem
                  label="Essential cookies"
                  checked={essentialCookies}
                  onToggle={() => setEssentialCookies((prev) => !prev)}
                />
              </Box>
            )}
            <Box
              sx={{
                my: 2,
              }}
            >
              <RalliButton label={"Save"} onClick={handleSavePreferences} loading={saveLoading}/>
            </Box>
          </>
        )}
      </Container>
    </>
  );
};

export default Page;
