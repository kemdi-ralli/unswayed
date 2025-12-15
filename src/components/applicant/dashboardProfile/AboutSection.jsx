"use client"

import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import CallIcon from "@mui/icons-material/Call";

const AboutSection = ({ data, authUser }) => {
  useEffect(() => {
  let url;

  if (authUser?.photo instanceof Blob) {
    url = URL.createObjectURL(authUser.photo);
  }

  return () => {
    if (url) URL.revokeObjectURL(url);
  };
}, [authUser?.photo]);

  const [showFullAbout, setShowFullAbout] = useState(false);

  const handleToggleAbout = () => {
    setShowFullAbout((prev) => !prev);
  };

  const getTruncatedAbout = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  const getSafeImageSrc = (value) => {
    if (!value) return undefined;
    if (typeof value === "string") return value;

    // Handle File / Blob safely
    if (value instanceof Blob) {
      return URL.createObjectURL(value);
    }

    return undefined;
  };

  return (
    <>
      <Box
        sx={{
          borderRadius: "15px",
          backgroundColor: "#FDF7F7",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            backgroundImage:
              typeof data?.backgroundImage === "string"
                ? `url(${data.backgroundImage})`
                : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: "100px",
            width: "100%",
            zIndex: 0,
          }}
        ></Box>
        <Box
          sx={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            pb: 4,
          }}
        >
          <Avatar
            alt="Profile"
            src={getSafeImageSrc(authUser?.photo)}
            sx={{
              width: 95,
              height: 95,
              position: "absolute",
              top: -50,
              zIndex: 1,
            }}
          />
        </Box>
        <Box sx={{ py: 2, px: "7px" }}>
          <Typography
            sx={{
              fontSize: { xs: "16px", sm: "18px", lg: "26px" },
              lineHeight: { xs: "18px", sm: "18px", md: "18px" },
              fontWeight: 700,
              textAlign: "center",
              py: 1,
            }}
          >
            {authUser?.username}
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "10px", sm: "12px", lg: "16px" },
              lineHeight: { md: "17px", lg: "22px" },
              fontWeight: 300,
              textAlign: "center",
              py: 1,
            }}
          >
            {/* {data?.userDetails} */}
            <Typography
              sx={{
                fontSize: { xs: "10px", sm: "12px", lg: "16px" },
                lineHeight: { md: "17px", lg: "22px" },
                fontWeight: 300,
                py: 1,
              }}
            >
              {showFullAbout
                ? authUser?.about
                : getTruncatedAbout(authUser?.about || "", 50)}
            </Typography>
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ py: 2, px: "8px" }}>
          <Box
            sx={{
              px: "10px",
              pb: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "12px", lg: "16px" },
                lineHeight: { xs: "21px", md: "15px" },
                fontWeight: 400,
                color: "#222222",
              }}
            >
              Followers
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", lg: "16px" },
                lineHeight: { xs: "21px", md: "15px" },
                fontWeight: 700,
                textAlign: "center",
                color: "#00305B",
              }}
            >
              {authUser?.followers_count}
            </Typography>
          </Box>
          <Box
            sx={{
              px: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "12px", lg: "16px" },
                lineHeight: { xs: "21px", md: "15px" },
                fontWeight: 400,
                color: "#222222",
              }}
            >
              Following
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "12px", lg: "16px" },
                lineHeight: { xs: "21px", md: "15px" },
                fontWeight: 700,
                textAlign: "center",
                color: "#00305B",
              }}
            >
              {authUser?.followings_count}
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Box sx={{ py: 2 }}>
          <Box sx={{ mb: "20px", mx: { xs: 1, lg: 2 } }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: { xs: "7px 7px", lg: "10px 10px" },
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "18px",
                color: "#222222",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 5px #00000040",
              }}
            >
              <Box
                sx={{
                  width: "39.14px",
                  height: "39.14px",
                  borderRadius: "50%",
                  boxShadow: "0px 1px 5px #00000040",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MarkunreadIcon />
              </Box>
              <Box sx={{ px: { xs: 0.5, sm: 1, lg: 2 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", lg: "16px" },
                    lineHeight: { xs: "21px", md: "15px" },
                    fontWeight: 400,
                    color: "#111111",
                    pb: 0.2,
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "10px", lg: "14px" },
                    lineHeight: { xs: "21px", md: "15px" },
                    fontWeight: 400,
                    color: "#00305B",
                  }}
                >
                  {authUser?.email}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ mb: "20px", mx: { xs: 1, lg: 2 } }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                padding: { xs: "7px 7px", lg: "10px 10px" },
                borderRadius: "4pxs",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "18px",
                color: "#222222",
                backgroundColor: "#FFFFFF",
                boxShadow: "0px 1px 5px #00000040",
              }}
            >
              <Box
                sx={{
                  width: "39.14px",
                  height: "39.14px",
                  borderRadius: "50%",
                  boxShadow: "0px 1px 5px #00000040",
                  backgroundColor: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CallIcon />
              </Box>
              <Box sx={{ px: { xs: 0.5, sm: 1, lg: 2 } }}>
                <Typography
                  sx={{
                    fontSize: { xs: "12px", lg: "16px" },
                    lineHeight: { xs: "21px", md: "15px" },
                    fontWeight: 400,
                    color: "#111111",
                    pb: 0.2,
                  }}
                >
                  Phone
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "10px", lg: "14px" },
                    lineHeight: { xs: "21px", md: "15px" },
                    fontWeight: 400,
                    color: "#00305B",
                  }}
                >
                  {authUser?.phone}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          borderRadius: "15px",
          backgroundColor: "#FDF7F7",
          overflow: "hidden",
          px: 1.7,
          my: 3,
          py: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "16px", sm: "18px", lg: "26px" },
            lineHeight: { xs: "18px", sm: "18px", md: "18px" },
            fontWeight: 700,
            py: 1,
          }}
        >
          About
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "10px", sm: "12px", lg: "16px" },
            lineHeight: { md: "17px", lg: "22px" },
            fontWeight: 300,
            py: 1,
          }}
        >
          {showFullAbout
            ? authUser?.about
            : getTruncatedAbout(authUser?.about || "", 50)}
        </Typography>
        <Button
          onClick={handleToggleAbout}
          variant="text"
          sx={{
            fontSize: { xs: "12px", sm: "16px" },
            lineHeight: { xs: "18px", sm: "18px", md: "18px" },
            fontWeight: 700,
            color: "#00305B",
            pl: -2,
          }}
        >
          {showFullAbout ? "Show Less" : "View Details"}
        </Button>
      </Box>
    </>
  );
};

export default AboutSection;
