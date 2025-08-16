"use client";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ModalRalli from "./ModalRalli";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { encode } from "@/helper/GeneralHelpers";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);

const MyPosting = ({
  data,
  onLike,
  onCommentClick,
  handleSendModal,
  isShareModalOpen,
  setIsShareModalOpen,
  handleDeletePost,
  anchorEl,
  setAnchorEl,
  handleMenuClose,
  handleEditPost,
  selectItem,
  setSelectItem,
  handleSend,
  handleClose,
  loading
}) => {
  const isMenuOpen = Boolean(anchorEl);
  const [id, setId] = useState();

  const handleProfileMenuOpen = (event, id, item) => {
    setId(id);
    setAnchorEl(event.currentTarget);
  };
  const router = useRouter()
  const onClickNetwork = (id) => {
    const encodedId = encode(id);
    router.push(`/profile/${encodedId}`);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleEditPost(id)}>
        <EditIcon
          sx={{
            color: "#111111",
          }}
        />
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            color: "#111111",
            px: "10px",
          }}
        >
          Edit
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => handleDeletePost(id)}>
        <DeleteIcon
          sx={{
            color: "#111111",
          }}
        />
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            color: "#111111",
            px: "10px",
          }}
        >
          Delete
        </Typography>
      </MenuItem>
    </Menu>
  );
  return (
    <Box>
      {/* {loading &&
        [...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              boxShadow: "0px 1px 3px #00000040",
              px: 2,
              py: 2,
              my: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Skeleton variant="circular" width={49} height={49} />
              <Box>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={80} height={15} />
              </Box>
            </Box>
            <Skeleton variant="rectangular" width="100%" height={150} sx={{ mt: 2, borderRadius: "10px" }} />
          </Box>
        ))} */}

      {!loading && data?.length === 0 && (
        <Typography textAlign="center" sx={{ mt: 3, fontSize: "18px", fontWeight: 500, color: "#666" }}>
          No Data Found
        </Typography>
      )}
      {data?.map((item, index) => (
        <Box
          key={index}
          sx={{
            borderRadius: "10px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0px 1px 3px #00000040",
            px: 2,
            py: 2,
            my: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => onClickNetwork(item?.user?.id)}>
              <Avatar
                alt={item?.userName}
                src={item?.user?.photo}
                sx={{ width: 49, height: 49 }}
              />
              <Box sx={{ px: 2 }}>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", lg: "16px" },
                    lineHeight: "16px",
                    fontWeight: 600,
                    color: "#222222",
                  }}
                >
                  {`${item?.user?.first_name} ${item?.user?.middle_name} ${item?.user?.last_name}`}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", lg: "14px" },
                    lineHeight: "21px",
                    fontWeight: 400,
                    color: "#222222",
                  }}
                >
                  {item?.user?.username}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "11px", lg: "12px" },
                    lineHeight: "21px",
                    fontWeight: 300,
                    color: "#222222",
                  }}
                >
                  {dayjs(item?.created_at).fromNow()}
                </Typography>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={(event) =>
                  handleProfileMenuOpen(event, item?.id, item)
                }
                color="inherit"
              >
                <MoreVertRoundedIcon
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={(event) =>
                    handleProfileMenuOpen(event, item?.id, item)
                  }
                />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ width: "100%" }}>
            <Typography
              sx={{
                fontSize: { xs: "14px", lg: "16px" },
                lineHeight: "18px",
                fontWeight: 500,
                color: "#222222",
                py: 1.5,
              }}
            >
              {item?.content}
            </Typography>

            {item?.media &&
              (item?.media_type === "video" ? (
                <Box>
                  <video
                    src={item?.media}
                    controls
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      border: "1px solid gray",
                      cursor: "pointer",
                      maxHeight: "450px",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxHeight: "450px",
                    overflow: "hidden",
                    borderRadius: "10px",
                    border: "1px solid gray",
                    cursor: "pointer"
                  }}
                  onClick={() => router.push(`/feed/${encode(item?.id)}`)}
                >
                  <img
                    src={item?.media}
                    alt="media"
                    style={{
                      width: "100%",
                      height: "auto",
                      maxHeight: "450px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ))}
          </Box>
          <Box
            sx={{
              py: 1,
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Button
              onClick={() => onLike(item?.id)}
              sx={{
                fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "16px" },
                lineHeight: "17px",
                fontWeight: 300,
                color: "#222222",
                border: "none",
                boxShadow: "0px 1px 3px #00000040",
                borderRadius: { xs: "10px", sm: "20px", md: "30px" },
                minWidth: { xs: "60px", sm: "100px", lg: "170px" },
                py: 1,
              }}
              startIcon={
                item?.isLiked ? (
                  <ThumbUpIcon color="primary" />
                ) : (
                  <ThumbUpOffAltIcon />
                )
              }
            >
              Like {item?.total_likes || 0}
            </Button>
            <Button
              onClick={() => onCommentClick(item?.id)}
              sx={{
                fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "16px" },

                lineHeight: "17px",
                fontWeight: 300,
                color: "#222222",
                border: "none",
                boxShadow: "0px 1px 3px #00000040",
                borderRadius: { xs: "10px", sm: "20px", md: "30px" },

                minWidth: { xs: "60px", sm: "100px", lg: "170px" },
                py: 1,
              }}
              startIcon={<ChatBubbleOutlineIcon />}
            >
              Comment {item?.total_comments || 0}
            </Button>
            <Button
              onClick={() => handleSendModal(item?.id)}
              sx={{
                fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "16px" },

                lineHeight: "17px",
                fontWeight: 300,
                color: "#222222",
                border: "none",
                boxShadow: "0px 1px 3px #00000040",
                borderRadius: { xs: "10px", sm: "20px", md: "30px" },
                minWidth: { xs: "60px", sm: "100px", lg: "170px" },
                py: 1,
              }}
              startIcon={<SendIcon />}
            >
              Send
            </Button>
          </Box>
        </Box>
      ))}
      {renderMenu}
      <ModalRalli
        open={isShareModalOpen}
        onClose={handleClose}
        isShareModalOpen={isShareModalOpen}
        selectItem={selectItem}
        setSelectItem={setSelectItem}
        handleSend={handleSend}
      />
    </Box>
  );
};

export default MyPosting;
