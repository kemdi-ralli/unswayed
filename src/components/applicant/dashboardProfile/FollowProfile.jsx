import React from "react";
import { Avatar, Box, Button, Divider, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const FollowProfile = ({ 
    data,
    likedProfiles,
    setLikedProfiles,
    handleLikeToggle,
 }) => {
    return (
        <Box
          sx={{
            borderRadius: "15px",
            backgroundColor: "#FDF7F7",
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "16px", sm: "16px", lg: "26px" },
              lineHeight: { xs: "18px", sm: "18px", md: "18px" },
              fontWeight: 700,
              py: 3,
              px: { md: 1, lg: 2 },
            }}
          >
            Add To Your Feed
          </Typography>
          <Divider />
          {[1, 2, 3, 4, 5, 6].map((i, index) => (
            <Box
              key={index}
              sx={{
                px: { xs: 1, lg: 2 },
                py: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Avatar
                  alt="Profile Picture"
                  src={data?.userProfile}
                  sx={{
                    width: { xs: 50, lg: 68 },
                    height: { xs: 50, lg: 68 },
                  }}
                />
                <Box sx={{ px: { xs: 1, lg: 1.5 } }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "14px", lg: "16px" },
                      lineHeight: "18px",
                      fontWeight: 500,
                      color: "#00305B",
                    }}
                  >
                    {data?.userName}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "10px", lg: "12px" },
                      lineHeight: "17px",
                      fontWeight: 300,
                      py: 0.5,
                      pb: 1,
                    }}
                  >
                    {data?.userDetails}
                  </Typography>
                  <Button
                    onClick={() => handleLikeToggle(index)}
                    sx={{
                      fontSize: { xs: "14px", lg: "16px" },
                      lineHeight: "17px",
                      fontWeight: 300,
                      textAlign: "center",
                      color: likedProfiles[index] ? "white" : "#FE4D82",
                      backgroundColor: likedProfiles[index] ? "#FE4D82" : "transparent",
                      border: likedProfiles[index] ? "none" : "1px solid #FE4D82",
                      py: 1,
                      ":hover": {
                        backgroundColor: likedProfiles[index] ? "#FE4D82" : "rgba(254, 77, 130, 0.1)",
                      },
                    }}
                    startIcon={likedProfiles[index] ? null : <AddIcon />}
                    size="small"
                  >
                    {likedProfiles[index] ? "Following" : "Follow"}
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      );
    };
    
    export default FollowProfile;