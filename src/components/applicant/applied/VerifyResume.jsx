"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import AppliedJobs from "../dashboard/AppliedJobs";
import { BorderLinearProgress } from "@/helper/progressbar";
import RalliButton from "@/components/button/RalliButton";
import Image from "next/image";
import { useWizard } from "react-use-wizard";
import BackbuttonWithTitle from "./BackbuttonWithTitle";

const VerifyResume = ({ data, getAppliedData, resumes, resumeId, authUser }) => {
  const { nextStep, previousStep } = useWizard();
  const [verify, setVerify] = useState(false);
  const [buttonLabel, setButtonLabel] = useState();

  const isVerify = resumes?.find((item) => item?.id === resumeId);

  const filterdData = data?.items?.filter((item) =>
    isVerify?.visible_sections?.includes(item.title)
  );

  const handleVerify = () => {
    setVerify(true);
    if (resumeId) {
      setButtonLabel("Next");
      if (verify) {
        nextStep();
      }
    } else {
      alert("please select resume first");
    }
  };
  const handleBack = () => {
    previousStep();
    setVerify(false);
  };

  useEffect(() => {
    if (resumeId) {
      setButtonLabel("Verify");
    } else {
      setButtonLabel("Next");
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100vh'
      }}>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#FFFFFF",
            pr: "25px",
          }}
        >
          <BackbuttonWithTitle title={data?.title} />
          <Box sx={{ py: 1 }}>
            <BorderLinearProgress variant="determinate" value={85} />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              py: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                fontWeight: 700,
                lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "16px" },
                color: "#000000",
              }}
            >
              Candidate UCN Number: {authUser?.ucn}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "21px",
                  md: "19px",
                },
                fontWeight: 700,
                lineHeight: {
                  xs: "25px",
                  sm: "30px",
                  md: "25px",
                  lg: "28.5px",
                },
                color: "#00305B",
              }}
            >
              {data?.resume}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              py: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "16px" },
                fontWeight: 400,
                lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "21px" },
                color: "#333333",
              }}
            >
              {data?.para}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: {
                  xs: "18px",
                  sm: "21px",
                  md: "19px",
                },
                fontWeight: 700,
                lineHeight: {
                  xs: "25px",
                  sm: "30px",
                  md: "25px",
                  lg: "28.5px",
                },
                color: "#00305B",
                py: 1,
              }}
            >
              {data?.visible}
            </Typography>
          </Box>
          {filterdData?.length === 0 ? (
            <Typography sx={{ color: "red", textAlign: "center", py: 2 }}>
              Invalid Resume
            </Typography>
          ) : (
            filterdData?.map((item, index) => (
              <Box key={index} sx={{ pb: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  <Box sx={{ pr: 2 }}>{item.icon}</Box>
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "12px",
                        sm: "14px",
                        md: "16px",
                      },
                      fontWeight: 400,
                      lineHeight: {
                        xs: "25px",
                        sm: "30px",
                        md: "25px",
                        lg: "16px",
                      },
                      color: "#111111",
                      px: 2,
                      py: 1,
                    }}
                  >
                    {item.title}
                  </Typography>
                  {verify && (
                    <Image src={item?.verify} width={25} height={25} alt="true" />
                  )}
                </Box>
              </Box>
            ))
          )}

          <RalliButton label={buttonLabel} onClick={handleVerify} disableValue={!filterdData || filterdData.length === 0} />
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            backgroundColor: "#FAF9F8",
          }}
        >
          <AppliedJobs data={getAppliedData} />
        </Grid>
      </Grid>
    </Box>
  );
};
export default VerifyResume;
