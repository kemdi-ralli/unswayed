"use client";
import { useState, useEffect } from "react";

const RAPID_API_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY; // store your key in .env

export const useJSearchJobs = (query = "Software Engineer", page = 1) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-key": RAPID_API_KEY,
              "x-rapidapi-host": "jsearch.p.rapidapi.com",
            },
          }
        );

        const result = await response.json();
        const formatted = result?.data?.map((job) => ({
          id: job.job_id,
          title: job.job_title,
          country: job.job_country || "N/A",
          states: [{ name: job.job_city || "" }],
          description: job.job_description || "",
          created_at: job.job_posted_at_datetime_utc || new Date(),
          deadline: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // fake 7-day deadline
          is_applied: false,
          is_saved: false,
        }));

        setJobs(formatted || []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [query, page]);

  return { jobs, loading, error };
};
