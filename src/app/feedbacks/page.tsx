"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Rating,
  Avatar,
  Divider,
  CircularProgress,
  Stack,
  FormControlLabel,
  Switch,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_FEEDBACK, CREATE_FEEDBACK } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";

type FeedbackUser = {
  id?: number;
  name?: string;
  photo?: string | null;
};

type Feedback = {
  id: number;
  subject: string;
  message: string;
  rating: number;
  created_at: string;
  is_anonymous?: boolean;
  user?: FeedbackUser;
};

function feedbackIsAnonymous(item: Feedback): boolean {
  if (item.is_anonymous === true) return true;
  const u = item.user;
  if (!u) return false;
  if (u.id != null) return false;
  return u.name === "Anonymous User";
}

function FeedbackCardHeader({ item }: { item: Feedback }) {
  const anon = feedbackIsAnonymous(item);
  const photo = item.user?.photo;

  let avatar: ReactNode;
  if (anon) {
    avatar = (
      <Avatar sx={{ mr: 2, bgcolor: "#9e9e9e", width: 40, height: 40 }}>
        <PersonOutlineIcon sx={{ color: "#fff" }} />
      </Avatar>
    );
  } else if (photo) {
    avatar = <Avatar src={photo} sx={{ mr: 2, width: 40, height: 40 }} alt="" />;
  } else {
    const initial = item.user?.name?.trim()?.[0] ?? "?";
    avatar = (
      <Avatar sx={{ mr: 2, width: 40, height: 40, bgcolor: "#00305B" }}>{initial}</Avatar>
    );
  }

  const displayName = anon ? "Anonymous User" : item.user?.name || "User";

  return (
    <Box display="flex" alignItems="center" mb={1}>
      {avatar}
      <Box>
        <Typography fontWeight="bold">{displayName}</Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(item.created_at).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

export default function FeedbackPage() {
  const [form, setForm] = useState({
    subject: "",
    message: "",
    rating: 0,
    is_anonymous: false,
  });

  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadFeedback = async () => {
    try {
      const res = await apiInstance.get(GET_FEEDBACK);
      setFeedback(res.data.data);
    } catch (e) {
      console.error("Failed to load feedback", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  const submit = async () => {
    if (!form.rating) {
      Toast("error", "Please select a star rating");
      return;
    }

    setPosting(true);

    try {
      await apiInstance.post(CREATE_FEEDBACK, {
        subject: form.subject,
        message: form.message,
        rating: form.rating,
        is_anonymous: form.is_anonymous,
      });
      setForm({ subject: "", message: "", rating: 0, is_anonymous: false });
      await loadFeedback();
      Toast("success", "Thanks for your feedback");
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      Toast("error", err?.response?.data?.message ?? "Failed to submit feedback");
      console.error("Failed to submit feedback", e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box maxWidth={900} mx="auto" mt={5} px={2}>
      <Card sx={{ mb: 4, p: 3 }}>
        <Typography variant="h4" mb={1}>
          How was your experience?
        </Typography>

        <Typography color="text.secondary" mb={2}>
          Your feedback helps improve the platform for everyone.
        </Typography>

        <Rating
          size="large"
          value={form.rating}
          onChange={(_, v) => setForm({ ...form, rating: v || 0 })}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Short summary"
          fullWidth
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          placeholder="E.g. Job search is fast, but filters are missing"
          sx={{ mb: 2 }}
        />

        <TextField
          label="Tell us more"
          fullWidth
          multiline
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          placeholder="What worked? What didn’t? What should we improve?"
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Switch
              checked={form.is_anonymous}
              onChange={(_, checked) => setForm({ ...form, is_anonymous: checked })}
              color="primary"
            />
          }
          label="Send feedback anonymously"
          sx={{ display: "block", mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {form.is_anonymous
            ? "Your name and profile photo will not be shown publicly."
            : "Your name and profile photo will be visible with your feedback."}
        </Typography>

        <Button variant="contained" size="large" disabled={posting || !form.rating} onClick={submit}>
          {posting ? <CircularProgress size={22} /> : "Submit feedback"}
        </Button>
      </Card>

      <Typography variant="h5" mb={2}>
        Community Feedback
      </Typography>

      {loading && <CircularProgress />}

      <Stack spacing={2}>
        {feedback.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <FeedbackCardHeader item={item} />

              <Box display="flex" alignItems="center" mb={1}>
                <Rating value={item.rating} readOnly size="small" />
                <Typography ml={1} fontWeight="bold">
                  {item.subject}
                </Typography>
              </Box>

              <Typography color="text.secondary">{item.message}</Typography>

              <Divider sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
