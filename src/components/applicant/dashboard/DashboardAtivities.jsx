import React, { useEffect, useState } from "react";
import { encode } from "@/helper/GeneralHelpers";
import { MY_ACTIVITIES } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

const DashboardAtivities = () => {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  const handleFurtherDetails = (id) => {
    var encodeId = encode(id);
    router.push(`/applicant/dashboard/application/${encodeId}`);
  };

  const getMyActivites = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await apiInstance?.get(`${MY_ACTIVITIES}?limit=1000`);
      setActivities(response?.data?.data?.activities);
    } catch (error) {
      setErrors({
        email: error?.response?.data?.message || "Failed to load activities",
      });
    } finally {
      setIsLoadingJobs(false);
    }
  };

  useEffect(() => {
    getMyActivites();
  }, []);

  return activities?.map((item) => {
    const date = item?.created_at ? new Date(item.created_at) : null;
    const formattedDate = date ? date.toLocaleString() : "Invalid Date";
    return (
      <>
        <Box
          sx={{
            border: "0.6px solid #0000004D",
            borderRadius: "10px",
            p: 2,
            my: 2,
            cursor: "pointer",
            "&:hover": {
              border: "2px solid #FE4D82",
            },
          }}
          onClick={() => handleFurtherDetails(item?.application_id)}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box
              sx={{
                //   display: "flex",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: {xs:"12px", sm:"13px",md:"16px"},
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: "#222222",
                }}
              >
                REQ : {item?.requisition_number}
              </Typography>
              <Typography
                sx={{
                  fontSize: {xs:"15px",sm:"20px",md:"26px"},
                  lineHeight: { xs: "17px", md: "18px" },
                  fontWeight: 700,
                  color: "#00305B",
                  py: 1,
                }}
              >
                {item?.title}
              </Typography>
            </Box>
            <Button
              sx={{
                backgroundColor: "#FE4D82",
                color: "#fff",
                fontSize: { xs: "8px", sm: "10px", md: "12px" },
                lineHeight: {xs:"11px",sm:"20px",md:"24px"},
                borderRadius: "5px",
                height: "34px",
                width: "auto",
                fontWeight: 700,
              }}
              onClick={() => handleFurtherDetails(item?.application_id)}
            >
              Further Details
            </Button>
          </Box>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "26px",
                fontWeight: 400,
                color: "#111111",
                py: 1,
              }}
            >
              {item?.description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 4,
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#00305B",
                  }}
                >
                  Date:
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: "16px",
                    lineHeight: "24px",
                    color: "#222222",
                  }}
                >
                  {formattedDate}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </>
    );
  });
};

export default DashboardAtivities;
