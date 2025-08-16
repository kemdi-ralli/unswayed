import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import ReactPlayer from "react-player";
import { useRouter } from "next/navigation";
import { encode } from "@/helper/GeneralHelpers";

const SharePostMessage = ({ data }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const formattedTime = new Date(data.created_at).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const router = useRouter()
  const navigate = (el) => {
    if (el?.id) {
      const encodedId = encode(el?.id);
      router.push(`/feed/${encodedId}`);
    }
  }

  return (
    <Box sx={styles.container}>
      {data?.postShares?.map((el, index) => (
        <Box 
          key={index} 
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(el)}
        >
          <Box sx={styles.userContainer}>
            <Image
              src={
                el?.user?.photo ? el?.user?.photo : "/assets/images/profile.png"
              }
              width={40}
              height={40}
              alt="user"
              style={{ borderRadius: "50px" }}
            />
            <Box>
              <Typography sx={styles.name}>
                {el?.user?.first_name +
                  " " +
                  el?.user?.middle_name +
                  " " +
                  el?.user?.last_name}
              </Typography>
              <Typography sx={styles.username}>{el?.user?.username}</Typography>
            </Box>
          </Box>
          {el.content && (
            <Typography sx={styles.contentText}>{el.content}</Typography>
          )}
          <Box
            // sx={{ cursor: "pointer" }}
            // onClick={() => navigate(el)}
          >
            {el.media &&
              (el.media_type === "video" ? (
                <Box>
                  <Box
                    sx={styles.videoContainer}
                    onClick={() => {
                      setIsPlaying(!isPlaying);
                    }}
                  >
                    <ReactPlayer
                      url={el.media}
                      playing={isPlaying}
                      loop={true}
                      width="100%"
                      height="100%"
                      style={{
                        display: "block",
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Image
                  src={el.media}
                  width={130}
                  height={100}
                  alt="Post Image"
                  style={styles.image}
                />
              ))}
          </Box>

        </Box>
      ))}
      <Typography color="textSecondary" sx={styles.timeText}>
        {formattedTime}
      </Typography>
    </Box>
  );
};

const styles = {
  container: {
    display: "inline-block",
    backgroundColor: "white",
    py: "5px",
    px: "10px",
    borderRadius: "10px",
    border: "1px solid",
    borderColor: "#99999999",
    float: "right",
    my: " 10px",
  },
  contentText: {
    fontSize: { xs: "8px", sm: "8px", md: "10px", lg: "12px" },
    fontWeight: 400,
    color: "#000306",
  },
  userContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    marginTop: "10px",
    marginBottom: "15px",
  },
  name: {
    fontSize: { xs: "8px", sm: "8px", md: "10px", lg: "10px" },
    fontWeight: 400,
    color: "#000306",
  },
  username: {
    fontSize: { xs: "8px", sm: "8px", md: "8px", lg: "8px" },
    fontWeight: 400,
    color: "#000306",
  },
  videoContainer: {
    maxWidth: "190px",
    maxHeight: "400px",
    borderRadius: "15px",
    overflow: "hidden",
    marginTop: "15px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "15px",
    marginTop: "15px",
  },
  timeText: {
    display: "block",
    fontSize: {
      xs: "8px",
      sm: "8px",
      md: "8px",
      lg: "9px",
    },
    lineHeight: "18px",
    fontWeight: 400,
    py: 1,
    float: "right",
  },
};

export default SharePostMessage;
