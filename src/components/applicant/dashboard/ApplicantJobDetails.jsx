// ApplicantJobDetails.jsx
import React from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import JobsCard from "./JobsCard";
import dayjs from "dayjs";

const ApplicantJobDetails = ({
  data = [],
  isLoading = false,
  onPressCard = () => {},
  OnApply = () => {},
  OnSave = () => {},
}) => {
  const today = new Date().toISOString().split("T")[0];

  // Helper: is job still open (if deadline exists). If no deadline, consider it open.
  const isOpen = (job) => {
    if (!job) return false;
    if (!job.deadline) return true;
    try {
      const jobDate = new Date(job.deadline);
      const nowDay = new Date(today);
      return jobDate >= nowDay;
    } catch {
      return true;
    }
  };

  const visibleJobs = Array.isArray(data)
    ? data.filter((job) => !job?.is_applied && isOpen(job))
    : [];

  //   const IsSeparateLinks = (job) = {
  //     if(){

  //     }
  //   }

    //job: {jobId, jobLink}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {isLoading ? (
          Array.from(new Array(6)).map((_, index) => (
            <Grid key={index} item xs={12} md={6}>
              <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 2 }} />
              <Skeleton variant="text" sx={{ mt: 1, width: "60%" }} />
              <Skeleton variant="text" sx={{ width: "40%" }} />
              <Skeleton variant="text" sx={{ width: "80%" }} />
            </Grid>
          ))
        ) : visibleJobs.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: "center", mt: 3, color: "gray" }}>
              No Jobs Found
            </Typography>
          </Grid>
        ) : (
          visibleJobs.map((job) => (
            job?.job_apply_link?.includes("https://www.linkedin.com" && "https://www.indeed.com") ? (
              <></>
            ) : (
              <Grid key={job?.id ?? `${job?.title}_${Math.random().toString(36).slice(2, 8)}`} item xs={12} md={6}>
              <JobsCard
                item={job}
                handleCard={() => onPressCard(job?.id)}
                handleEasyApply={OnApply}
                handleJobSaved={OnSave}
              />
            </Grid>
            )
            
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ApplicantJobDetails;


//get the jobId
//joblink 
//joblink ? normal : except

//if(except has (indeed or linkedin)){render tag}

//Abnormals
