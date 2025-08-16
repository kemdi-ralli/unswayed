import React from "react";
import { Box, Button, Grid, Rating, Typography } from "@mui/material";
import Image from "next/image";
import StarIcon from "@mui/icons-material/Star";
import BackButtonWithTitle from "./BackButtonWithTitle";
import { usePathname, useRouter } from "next/navigation";

const PopularCompanies = ({ data }) => {
  const router = useRouter();
  const pathName = usePathname();
  const handleDetails = () => {
    if (pathName.includes("employer")) {
      router.push("/employer/feedback/employerProfile");
    } else {
      router.push("/applicant/feedback/employerProfile");
    }
  };
  const labels = {
    0.5: "4.5",
    1: "Useless+",
    1.5: "Poor",
    2: "Poor+",
    2.5: "Ok",
    3: "Ok+",
    3.5: "4.5",
    4: "Good+",
    4.5: "Excellent",
    5: "4.5",
  };
  const value = 5;
  return (
    <Box>
      <BackButtonWithTitle label="popular companies"/>
      <Grid container spacing={2}>
        {data?.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index} sx={{}}>
            <Box
              sx={{
                borderRadius: "5px",
                boxShadow: "0px 1px 3px #00000040",
                maxWidth: "254.66px",
                mx: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 2,
                }}
              >
                <Image src={item?.photo} width={81} height={81} alt="user" />
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "14px", md: "16px", lg: "18px" },
                  fontWeight: 600,
                  lineHeight: "18px",
                  textAlign: "center",
                  color: "#222222",
                }}
              >
                {item?.first_name}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "12px", md: "14px" },
                  fontWeight: 400,
                  lineHeight: "19px",
                  textAlign: "center",
                  color: "#00305B",
                  textDecoration: "underline",
                }}
              >
                Follower {item?.followers_count}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 1,
                }}
              >
                <Rating
                  name="text-feedback"
                  value={value}
                  readOnly
                  precision={0.5}
                  sx={{
                    fontSize: "12px",
                  }}
                  emptyIcon={
                    <StarIcon
                      sx={{
                        opacity: 0.55,
                      }}
                    />
                  }
                />
              </Box>
              <Box
                sx={{
                  py: 1,
                }}
              >
                <Button
                  onClick={handleDetails}
                  sx={{
                    minWidth: "151.16px",
                    height: "46px",
                    margin: "0px auto",
                    borderRadius: "6px",
                    border: "1px solid #00305B",
                    boxShadow: "0px 1px 3px #00000033",
                    color: "#00305B",
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "center",
                    mb: 1,
                    fontSize: "14px",
                    fontWeight: 700,
                    lineHeight: "21px",
                    "@media (min-width: 780px) and (max-width: 880px)": {
                      minWidth: "111.16px",
                    },
                  }}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularCompanies;
