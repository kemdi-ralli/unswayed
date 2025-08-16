"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "@/components/applicant/dashboard/SearchBar";
import MyJobCard from "../homePage/MyJobCard";
import RalliButton from "@/components/button/RalliButton";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { EMPLOYER_CRUD_JOBS } from "@/services/apiService/apiEndPoints";
import { encode } from "@/helper/GeneralHelpers";

const MyPosts = () => {
  const pathName = usePathname();
  const [search, setSearch] = useState("");
  const [myJobs, setMyJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const router = useRouter();

  const handleCreateJobs = () => {
    router.push("/employer/my-posts/form");
  };

  const onApplicationClick = (id) => {
    var encodeId = encode(id);
    router.push(`/employer/dashboard/${encodeId}`);
  };

  const onChange = (text) => {
    setSearch(text);
    if (text === "") {
      getMyJobs(text);
    }
  };

  const onClick = () => {
    if (search === "") {
      return;
    }
    getMyJobs(search);
  };

  const getMyJobs = async (text = "") => {
    try {
      setIsLoadingJobs(true);
      const response = await apiInstance?.get(
        `${EMPLOYER_CRUD_JOBS}?search=${text}&limit=100&page=1`
      );
      if (response?.data?.data) {
        setMyJobs(response?.data?.data?.jobs);
        setIsLoadingJobs(false);
      }
    } catch (err) {
      console.error("Error fetching myjobs:", err);
      setIsLoadingJobs(false);
    }
  };

  const onViewDetail = (id) => {
    var encodeId = encode(id);
    router.push(`/employer/job/${encodeId}`);
  };

  useEffect(() => {
    getMyJobs();
    return () => {
      console.log("Cleanup if needed");
    };
  }, []);

  return (
    <Box>
      <SearchBar onChange={onChange} onClick={onClick} />
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "18px", sm: "24px", md: "30px" },
            lineHeight: { xs: "14px", sm: "16px", md: "17px" },
            fontWeight: 600,
            color: "#00305B",
            pb: 2,
          }}
        >
          My Jobs
        </Typography>
        <Box>
          <RalliButton
            label="Create Job"
            size="large"
            onClick={handleCreateJobs}
          />
        </Box>
      </Grid>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {isLoadingJobs ? (
            ["1", "2", "3", "4"].map((item, index) => (
              <Grid
                key={index}
                item
                xs={12}
                md={6}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Box sx={{ my: 2 }}>
                  <Skeleton
                    sx={{ background: "#ebebeb" }}
                    variant="rounded"
                    width="100%"
                    height={200}
                  />
                  <Skeleton sx={{ background: "#ebebeb" }} width="60%" />
                  <Skeleton sx={{ background: "#ebebeb" }} width="40%" />
                  <Skeleton sx={{ background: "#ebebeb" }} width="80%" />
                  <Skeleton sx={{ background: "#ebebeb" }} width="30%" />
                </Box>
              </Grid>
            ))
          ) : myJobs.length === 0 ? (
            <Box
              sx={{
                minHeight:'70vh',
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
              }}
            >
              <Typography variant="h4" color="#666">
                No data found
              </Typography>
            </Box>
          ) : (
            myJobs.map((item, index) => (
              <Grid
                key={index}
                item
                xs={12}
                md={6}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <MyJobCard
                  item={item}
                  onApplicationClick={onApplicationClick}
                  onViewDetail={onViewDetail}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};
export default MyPosts;
