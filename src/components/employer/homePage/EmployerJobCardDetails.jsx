import React from "react";
import { Box, Button, Typography, Skeleton } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";

const EmployerJobCardDetails = ({ data, isLoadingDetails }) => {
  return (
    <Box
      sx={{
        borderRadius: "10px",
        boxShadow: "0px 1px 5px #00000040",
      }}
    >
      <Box
        sx={{
          borderBottom: "1px solid #0000004D",
        }}
      >
        {!data ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              width="50%"
              sx={{
                py: "10px",
                ml: "17px",
              }}
            />
          ))
        ) : (
          <Box
            sx={{
              my: 2,
              px: "15px",
              py: 1.5,
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "21px", md: "24px" },
                fontWeight: 500,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "20px" },
                color: "#111111",
                py: 1,
              }}
            >
              Job Details
            </Typography>
            {isLoadingDetails ? (
              <Skeleton width="60%" />
            ) : (
              <Typography
                sx={{
                    fontSize: { xs: "12px", sm: "14px", md: "15px" },
                    fontWeight: 300,
                    lineHeight: "18px",
                  color: "#333333",
                  py: 1,
                }}
              >
                {data?.jobsPra}
              </Typography>
            )}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                py: "15px",
              }}
            >
              <WorkIcon />
              <Typography
                sx={{
                  fontSize: { xs: "18px", sm: "21px", md: "20px" },
                  fontWeight: 500,
                  lineHeight: {
                    xs: "25px",
                    sm: "30px",
                    md: "25px",
                    lg: "20px",
                  },
                  color: "#111111",
                  px: { xs: "3px", sm: 2 },
                }}
              >
                Job Type
              </Typography>
              {isLoadingDetails ? (
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={30}
                  sx={{ borderRadius: "6px" }}
                />
              ) : (
                <Button
                  sx={{
                    backgroundColor: "#FDF7F7",
                    border: "0.4px solid #0000004D",
                    borderRadius: "6px",
                    color: "#222222",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "18px",
                    textAlign: "center",
                    p: "7px",
                  }}
                >
                  {data?.jobsType}
                </Button>
              )}
            </Box>
          </Box>
        )}
      </Box>
      <Box sx={{ borderBottom: "1px solid #0000004D" }}>
        {!data?.jobsDescription ? (
          <Box sx={{ py: 3 }}>
            <Skeleton width="40%" />
            <Skeleton width="90%" />
            <Skeleton width="75%" />
          </Box>
        ) : (
          <Box sx={{ my: 2, px: "15px", py: 1.5 }}>
            <Typography
              sx={{
                fontSize: { xs: "18px", sm: "21px", md: "24px" },
                fontWeight: 500,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "20px" },
                color: "#111111",
                py: 1,
              }}
            >
              Full job description
            </Typography>

            <>
              <Typography
                sx={{
                  fontSize: { xs: "14px", sm: "16px", md: "18px" },
                  fontWeight: 700,
                  lineHeight: {
                    xs: "25px",
                    sm: "30px",
                    md: "25px",
                    lg: "18px",
                  },
                  color: "#00305B",
                  py: 1,
                }}
              >
                Job Description
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: 270,
                  lineHeight: "24px",
                  py: 1,
                }}
              >
                {data?.jobsDescription}
              </Typography>
            </>
          </Box>
        )}
      </Box>

      <Box sx={{ borderBottom: "1px solid #0000004D" }}>
        <Box sx={{ my: 2, px: "15px", py: 1.5 }}>
          {!data?.jobRequirements ? (
            <Skeleton width="90%" height="100px" />
          ) : (
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
                fontWeight: 700,
                lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "18px" },
                color: "#00305B",
                py: 1,
              }}
            >
              Responsibilities
            </Typography>
          )}
          {!data?.jobRequirements ? (
            <Skeleton width="90%" height="100px" />
          ) : (
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 270,
                lineHeight: "24px",
                py: 1,
              }}
            >
              {data?.jobRequirements}
            </Typography>
          )}
        </Box>
      </Box>
      {!data?.skills ? (
        Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            width="50%"
            sx={{
              py: "10px",
              ml: "40px",
            }}
          />
        ))
      ) : (
        <Box sx={{ my: 2, px: "15px", py: 1.5 }}>
          <Typography
            sx={{
              fontSize: { xs: "14px", sm: "16px", md: "18px" },
              fontWeight: 700,
              lineHeight: { xs: "25px", sm: "30px", md: "25px", lg: "18px" },
              color: "#00305B",
              py: 1,
            }}
          >
            Skills
          </Typography>
          {data?.skills?.map((item, index) => (
            <Typography
              key={index}
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "15px" },
                fontWeight: 300,
                lineHeight: "16px",
                color: "#333333",
                py: 1,
              }}
            >
              {item}
            </Typography>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EmployerJobCardDetails;
