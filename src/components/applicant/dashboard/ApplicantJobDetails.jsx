import React from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import JobsCard from "./JobsCard";

const ApplicantJobDetails = ({
  data = [],
  isLoading = false,
  onPressCard = () => {},
  OnApply = () => {},
  OnSave = () => {},
}) => {
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
        ) : data.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: "center", mt: 3, color: "gray" }}>
              No Jobs Found
            </Typography>
          </Grid>
        ) : (
          data.map((job, index) => (
            <Grid key={index} item xs={12} md={6}>
              <JobsCard
                item={job}
                handleCard={() => onPressCard(job?.id)}
                handleEasyApply={OnApply}
                handleJobSaved={OnSave}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default ApplicantJobDetails;
