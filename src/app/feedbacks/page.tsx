"use client";

import { useEffect, useState } from "react";
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
  Stack
} from "@mui/material";

import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_FEEDBACK, CREATE_FEEDBACK } from "@/services/apiService/apiEndPoints";

type Feedback = {
  id: number;
  subject: string;
  message: string;
  rating: number;
  created_at: string;
  user?: {
    name?: string;
    avatar?: string;
  };
};

export default function FeedbackPage() {
  const [form, setForm] = useState({
    subject: "",
    message: "",
    rating: 0
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
      alert("Please select a star rating");
      return;
    }

    setPosting(true);

    try {
      await apiInstance.post(CREATE_FEEDBACK, form);
      setForm({ subject: "", message: "", rating: 0 });
      await loadFeedback();
    } catch (e) {
      console.error("Failed to submit feedback", e);
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box maxWidth={900} mx="auto" mt={5} px={2}>
      {/* Submit */}
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

        <Button
          variant="contained"
          size="large"
          disabled={posting || !form.rating}
          onClick={submit}
        >
          {posting ? <CircularProgress size={22} /> : "Submit feedback"}
        </Button>
      </Card>

      {/* Feed */}
      <Typography variant="h5" mb={2}>
        Community Feedback
      </Typography>

      {loading && <CircularProgress />}

      <Stack spacing={2}>
        {feedback.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar sx={{ mr: 2 }}>
                  {item.user?.name?.[0] || "A"}
                </Avatar>

                <Box>
                  <Typography fontWeight="bold">
                    {item.user?.name || "Anonymous"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(item.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Rating value={item.rating} readOnly size="small" />
                <Typography ml={1} fontWeight="bold">
                  {item.subject}
                </Typography>
              </Box>

              <Typography color="text.secondary">
                {item.message}
              </Typography>

              <Divider sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
