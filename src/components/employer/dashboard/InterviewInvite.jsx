"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tooltip,
  IconButton,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import dayjs from "dayjs";
import RalliButton from "@/components/button/RalliButton";
import InterviewDatePicker from "@/components/applicant/dashboard/InterviewDatePicker";
import apiInstance from "@/services/apiService/apiServiceInstance";
import {
  EMPLOYER_GOOGLE_GENERATE_MEET_LINK,
  EMPLOYER_GOOGLE_STATUS,
} from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

const defaultTz =
  typeof Intl !== "undefined"
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : "America/New_York";

function isValidHttpUrl(str) {
  if (!str || typeof str !== "string") return false;
  try {
    const u = new URL(str.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const InterviewInvite = ({ ucn = "", onAction = () => {} }) => {
  const [payload, setPayload] = useState({
    type: "interview",
    description: "",
    dates: [],
    timezone: defaultTz,
  });
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleStatusLoaded, setGoogleStatusLoaded] = useState(false);
  const [meetMode, setMeetMode] = useState("manual"); // "meet" | "manual"
  const [meetSummary, setMeetSummary] = useState("");
  const [meetStart, setMeetStart] = useState("");
  const [meetEnd, setMeetEnd] = useState("");
  const [manualLink, setManualLink] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [generatingMeet, setGeneratingMeet] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiInstance.get(EMPLOYER_GOOGLE_STATUS);
        const connected = !!res?.data?.data?.is_connected;
        if (!cancelled) {
          setGoogleConnected(connected);
          if (!connected) {
            setMeetMode((m) => (m === "meet" ? "manual" : m));
          }
        }
      } catch {
        if (!cancelled) setGoogleConnected(false);
      } finally {
        if (!cancelled) setGoogleStatusLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (key, value, ind = null) => {
    setPayload((prevState) => {
      if (key === "dates" && ind !== null) {
        const updatedDates = [...prevState.dates];
        if (value && dayjs.isDayjs(value) && value.isValid()) {
          updatedDates[ind] = value.toISOString();
        } else {
          updatedDates[ind] = undefined;
        }
        return {
          ...prevState,
          dates: updatedDates,
        };
      }
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      Toast("success", "Link copied");
    } catch {
      Toast("error", "Could not copy link");
    }
  };

  const generateMeetLink = async () => {
    if (!meetSummary.trim()) {
      Toast("error", "Interview title is required.");
      return;
    }
    if (!meetStart || !meetEnd) {
      Toast("error", "Start and end date/time are required.");
      return;
    }
    setGeneratingMeet(true);
    try {
      const body = {
        summary: meetSummary.trim(),
        start_datetime: meetStart,
        end_datetime: meetEnd,
        timezone: payload.timezone || defaultTz,
        description: payload.description?.trim() || "Interview via Google Meet",
      };
      const res = await apiInstance.post(EMPLOYER_GOOGLE_GENERATE_MEET_LINK, body);
      const link = res?.data?.data?.meeting_link;
      if (link) {
        setGeneratedLink(link);
        Toast("success", res?.data?.message ?? "Meet link created");
      } else {
        Toast("error", "No meeting link returned.");
      }
    } catch (e) {
      Toast("error", e?.response?.data?.message ?? "Could not generate Meet link.");
    } finally {
      setGeneratingMeet(false);
    }
  };

  const resolveMeetingLink = () => {
    if (meetMode === "meet" && generatedLink) return generatedLink.trim();
    if (meetMode === "manual" && manualLink.trim() && isValidHttpUrl(manualLink)) {
      return manualLink.trim();
    }
    return null;
  };

  const handleOfferSend = () => {
    if (payload.description === "") {
      Toast("error", "Description is required");
      return;
    }

    const allDatesDefined = payload.dates.every(
      (date) => date !== undefined && date !== null && date !== ""
    );
    if (payload.dates.length < 3 || !allDatesDefined) {
      Toast("error", "Three interview date/time options are required.");
      return;
    }

    if (meetMode === "manual" && manualLink.trim() && !isValidHttpUrl(manualLink)) {
      Toast("error", "Please enter a valid meeting URL.");
      return;
    }

    if (meetMode === "meet" && googleConnected && !generatedLink) {
      Toast("error", "Generate a Meet link or switch to manual entry.");
      return;
    }

    const meeting_link = resolveMeetingLink();

    onAction({
      ...payload,
      meeting_link,
    });
  };

  const meetOption = (
    <FormControlLabel
      value="meet"
      control={<Radio sx={{ color: "#00305B" }} disabled={!googleConnected} />}
      label="Generate Google Meet Link"
      disabled={!googleConnected}
    />
  );

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontWeight: 600, fontSize: "30px", color: "#00305B" }}>
          Interview
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            color: "#000000",
            textDecoration: "underline",
          }}
        >
          UCN : {ucn ?? ""}
        </Typography>
      </Box>

      <Box key="description" sx={{ py: 2 }}>
        <Typography
          sx={{
            fontWeight: 400,
            fontSize: "20px",
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
          onChange={(e) => handleChange("description", e?.target?.value)}
        />
      </Box>

      <Box sx={{ py: 1 }}>
        <Typography sx={{ fontWeight: 400, fontSize: "16px", color: "#00305B", mb: 1 }}>
          Timezone <span style={{ color: "red" }}>*</span>
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="e.g. America/New_York"
          value={payload.timezone}
          onChange={(e) => handleChange("timezone", e.target.value)}
        />
      </Box>

      <Box key="datetime0" sx={{ py: 2 }}>
        <InterviewDatePicker
          key="0"
          onDateChange={(newDate) => handleChange("dates", newDate, 0)}
          placeHolderLabel="Select First Date and Time For Interview"
        />
      </Box>
      <Box key="datetime1" sx={{ py: 2 }}>
        <InterviewDatePicker
          key="1"
          onDateChange={(newDate) => handleChange("dates", newDate, 1)}
          placeHolderLabel="Select Second Date and Time For Interview"
        />
      </Box>
      <Box key="datetime2" sx={{ py: 2 }}>
        <InterviewDatePicker
          key="2"
          onDateChange={(newDate) => handleChange("dates", newDate, 2)}
          placeHolderLabel="Select Third Date and Time For Interview"
        />
      </Box>

      <Box sx={{ py: 2 }}>
        <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "#00305B", mb: 1 }}>
          Meeting Link
        </Typography>
        <RadioGroup
          value={meetMode}
          onChange={(e) => {
            const v = e.target.value;
            setMeetMode(v);
            if (v === "manual") setGeneratedLink("");
          }}
        >
          {!googleConnected && googleStatusLoaded ? (
            <Tooltip title="Connect your Google account in Settings to use this option." arrow>
              <span>{meetOption}</span>
            </Tooltip>
          ) : (
            meetOption
          )}
          <FormControlLabel
            value="manual"
            control={<Radio sx={{ color: "#00305B" }} />}
            label="Add Meeting Link Manually"
          />
        </RadioGroup>

        {meetMode === "meet" && googleConnected && (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              required
              label="Interview Title"
              fullWidth
              value={meetSummary}
              onChange={(e) => setMeetSummary(e.target.value)}
              placeholder={`Interview for ${ucn || "candidate"}`}
            />
            <TextField
              required
              label="Interview Start"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={meetStart}
              onChange={(e) => setMeetStart(e.target.value)}
            />
            <TextField
              required
              label="Interview End"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={meetEnd}
              onChange={(e) => setMeetEnd(e.target.value)}
            />
            <RalliButton
              label={generatingMeet ? "Generating…" : "Generate Meet Link"}
              onClick={generateMeetLink}
              loading={generatingMeet}
            />
            {generatedLink && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={generatedLink}
                  variant="outlined"
                  sx={{
                    maxWidth: "100%",
                    "& .MuiChip-label": { overflow: "hidden", textOverflow: "ellipsis" },
                  }}
                />
                <IconButton size="small" aria-label="Copy link" onClick={() => copyLink(generatedLink)}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        {meetMode === "manual" && (
          <TextField
            sx={{ mt: 2 }}
            label="Meeting Link"
            fullWidth
            placeholder="https://meet.google.com/... or Zoom/Teams link"
            value={manualLink}
            onChange={(e) => setManualLink(e.target.value)}
            error={!!manualLink.trim() && !isValidHttpUrl(manualLink)}
            helperText={
              manualLink.trim() && !isValidHttpUrl(manualLink) ? "Enter a valid URL (https://...)" : ""
            }
          />
        )}
      </Box>

      <RalliButton label="Send Invite" onClick={handleOfferSend} />
    </Box>
  );
};

export default InterviewInvite;
