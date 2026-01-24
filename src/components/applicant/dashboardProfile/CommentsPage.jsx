"use client";
import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuItem,
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import ModalRalli from "./ModalRalli";
import { encode } from "@/helper/GeneralHelpers";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Container from "@/components/common/Container";
import BackButton from "@/components/common/BackButton/BackButton";
dayjs.extend(relativeTime);

const CommentsPage = ({
  data,
  comments,
  onLike,
  commentText,
  onCommentChange,
  onCommentSubmit,
  handleSendModal,
  handleDeletePost,
  handleEditPost,
  getReplies,
  authUser,
  handleEditComments,
  handleDeleteComments,
  isShareModalOpen,
  isEdit,
  handleReply,
  postNotInterested,
  anchorEl,
  setAnchorEl,
  setAnchorCommentEl,
  anchorCommentEl,
  handleMenuClose,
  reportPost,
  handleFollowUnfollow,
  isFollowing,
  selectItem,
  setSelectItem,
  handleSend,
  handleClose,
  setReplyState,
  replyState,
  handleReplyChange,
  handleReplySubmit,
  handleEditCancel,
  likeLoading = false,
}) => {
  const isMenuOpen = Boolean(anchorEl);
  const isCommentMenuOpen = Boolean(anchorCommentEl);
  const [id, setId] = useState("");
  const [commentId, setCommentId] = useState("");
  const [commentItem, setCommentItem] = useState(null);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const router = useRouter()

  const handleModalRalliOpen = () => setOpen(true);

  const handleProfileMenuOpen = (event, id, item) => {
    setName(item?.user?.username);
    setUserId(item?.user?.id);
    setId(id);
    setAnchorEl(event.currentTarget);
  };
  const handleCommentProfileMenuOpen = (event, item) => {
    setCommentId(item?.id);
    setCommentItem(item);
    setAnchorCommentEl(event.currentTarget);
  };
  const toggleReply = (comment) => {
    const isReplyOpen = replyState[comment?.id]?.isReplyOpen || false;

    const isRepliesLoaded = comment?.replies?.length > 0;
    setReplyState((prevState) => ({
      ...prevState,
      [comment?.id]: {
        ...prevState[comment?.id],
        isReplyOpen: !isReplyOpen,
      },
    }));
    if (!isReplyOpen && !isRepliesLoaded) {
      getReplies(comment?.id);
    }
  };
  const countComments = (comments) => {
    let total = 0;

    comments.forEach((comment) => {
      total += 1;
      if (comment.replies && comment.replies.length > 0) {
        total += countComments(comment.replies);
      }
    });

    return total;
  };
  const onClickNetwork = (id) => {
    const encodedId = encode(id);
    router.push(`/profile/${encodedId}`);
  };
  const menuId = "primary-search-account-menu";
  const menuCommentId = "primary-search-account-menu-comment";
  const renderCommentMenu = (
    <Menu
      anchorEl={anchorCommentEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuCommentId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isCommentMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleEditComments(commentItem)}>
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
      <MenuItem onClick={() => handleDeleteComments(commentId)}>
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
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {data?.is_mypost ? (
        <>
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
        </>
      ) : (
        <>
          <MenuItem onClick={() => postNotInterested(id)}>
            <VisibilityOffIcon
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
              `{"Don't Want To See This"}`
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => handleFollowUnfollow(userId)}>
            <PermIdentityIcon
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
              {isFollowing ? "Follow" : "Unfollow"} {name}
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => reportPost(id)}>
            <ContentPasteIcon
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
              Report
            </Typography>
          </MenuItem>
        </>
      )}
    </Menu>
  );
  const commentsData = (item, isNested = false) => {
    const isReplyOpen = replyState[item?.id] ?? false;

    return (
      <React.Fragment key={item?.id}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            ml: isNested ? 4 : 0,
            my: 2,
          }}
        >
          <Avatar
            alt="User Avatar"
            src={item?.user?.photo}
            sx={{
              width: 40,
              height: 40,
              mr: 2,
              cursor: 'pointer'
            }}
            onClick={() => onClickNetwork(item?.user?.id)}
          />
          <Box flex={1}>
            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#222",
              }}
            >
              {`${item?.user?.first_name} ${item?.user?.middle_name || ""} ${item?.user?.last_name
                }`}
            </Typography>
            <Typography
              sx={{
                fontSize: "12px",
                color: "#555",
              }}
            >
              {item?.user?.username} • {dayjs(item?.created_at).fromNow()}
            </Typography>
            <Typography
              sx={{
                fontSize: "14px",
                color: "#333",
                mt: 1,
              }}
            >
              {item?.comment}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <Button
                onClick={() => handleReply(item)}
                sx={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#007bff",
                  textTransform: "none",
                  p: 0,
                  mr: 2,
                }}
              >
                Reply
              </Button>
              {item?.total_replies > 0 && (
                <Button
                  onClick={() => toggleReply(item)}
                  sx={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#007bff",
                    textTransform: "none",
                    p: 0,
                  }}
                >
                  {isReplyOpen
                    ? `Hide replies (${item?.total_replies})`
                    : `View replies (${item?.total_replies})`}
                </Button>
              )}
            </Box>
            {isReplyOpen && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder="Write your reply..."
                  value={replyState[item.id]?.replyText || ""}
                  onChange={(e) => handleReplyChange(item.id, e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          onClick={() => handleReplySubmit(item)}
                          disabled={
                            !replyState[item.id]?.replyText ||
                            replyState[item.id]?.replyText.trim() === ""
                          }
                        >
                          <SendIcon />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {isReplyOpen &&
              item.replies &&
              item.replies.map((reply) => commentsData(reply, true))}
          </Box>
          {authUser?.id === item?.user?.id && (
            <IconButton
              size="large"
              onClick={(event) => handleCommentProfileMenuOpen(event, item)}
            >
              <MoreVertRoundedIcon />
            </IconButton>
          )}
        </Box>
        {!isNested && <Divider sx={{ borderColor: "#ddd", my: 1 }} />}
      </React.Fragment>
    );
  };

  return (
    <>
      <BackButton />
      <Container>
        <Box>
          <Box
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
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                  onClick={() => onClickNetwork(data?.user?.id)}>
                  <Avatar
                    alt={"alt"}
                    src={data?.user?.photo}
                    sx={{
                      width: 49,
                      height: 49,
                    }}
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
                      {data?.user?.first_name} {data?.user?.middle_name} {data?.user?.last_name}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "14px", lg: "14px" },
                        lineHeight: "21px",
                        fontWeight: 400,
                        color: "#222222",
                      }}
                    >
                      {data?.user?.username}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "11px", lg: "12px" },
                        lineHeight: "21px",
                        fontWeight: 300,
                        color: "#222222",
                      }}
                    >
                      {dayjs(data?.created_at).fromNow()}
                    </Typography>
                  </Box>
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
                    handleProfileMenuOpen(event, data?.id, data)
                  }
                  color="inherit"
                >
                  <MoreVertRoundedIcon
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={(event) =>
                      handleProfileMenuOpen(event, data?.id, data)
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
                {data?.content}
              </Typography>
              {data?.media &&
                (data?.media_type === "video" ? (
                  <Box>
                    <video
                      src={data?.media}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: "10px",
                        border: "1px solid gray",
                        cursor: "pointer",
                        maxHeight: "450px",
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    component="img"
                    src={data?.media}
                    alt="media"
                    sx={{
                      width: "100%",
                      maxHeight: "450px",
                      borderRadius: "10px",
                      objectFit: "contain",
                      borderRadius: "10px",
                      display: "block",
                      margin: "auto",
                      border: "1px solid gray",
                    }}
                  />
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
                onClick={() => onLike(data?.id)}
                disabled={likeLoading}
                sx={{
                  fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "16px" },
                  lineHeight: "17px",
                  fontWeight: 300,
                  color: data?.isLiked ? "#189e33ff" : "#222222",
                  border: "none",
                  boxShadow: "0px 1px 3px #00000040",
                  borderRadius: { xs: "10px", sm: "20px", md: "30px" },
                  minWidth: { xs: "60px", sm: "100px", lg: "170px" },
                  py: 1,
                  opacity: likeLoading ? 0.7 : 1,
                  cursor: likeLoading ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  "&.Mui-disabled": {
                    color: data?.isLiked ? "#189e33ff" : "#222222",
                    opacity: 0.7,
                  },
                  "&:hover": {
                    backgroundColor: likeLoading ? "transparent" : "rgba(24, 158, 51, 0.08)",
                  },
                }}
                startIcon={
                  data?.isLiked ? (
                    <ThumbUpIcon 
                      sx={{ 
                        color: "#189e33ff",
                        opacity: likeLoading ? 0.7 : 1,
                      }} 
                    />
                  ) : (
                    <ThumbUpOffAltIcon 
                      sx={{ 
                        opacity: likeLoading ? 0.7 : 1,
                      }} 
                    />
                  )
                }
              >
                Like {data?.total_likes || 0}
              </Button>
              <Button
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
                {/* Comment {data?.total_comments || 0} */}
                Comment {countComments(comments)}
              </Button>
              <Button
                onClick={() => handleSendModal(data?.id)}
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
            {comments?.map((item) => commentsData(item))}

            <Box sx={{ mt: 2 }}>
              {isEdit && 
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    position: 'relative',
                    cursor: 'pointer',
                    zIndex:1
                  }}
                >
                  <CancelIcon sx={{color:"#189e33ff", position: 'absolute', right: 1}}
                  onClick={handleEditCancel}/>
                </Box>
              }
              <TextField
                fullWidth
                value={commentText}
                onChange={onCommentChange}
                placeholder="Write your comment..."
                sx={{
                  "& .MuiInputBase-root": {
                    borderRadius: "10px",
                    color: "#222222",
                  },
                }}
              />
              <Button
                onClick={() => onCommentSubmit(data?.id)}
                sx={{
                  mt: 1,
                  fontSize: { xs: "14px", lg: "16px" },
                  fontWeight: 600,
                  color: "#FFFFFF",
                  backgroundColor: "#189e33ff",
                  borderRadius: "30px",
                  px: 4,
                  py: 1,
                }}
              >
                {isEdit ? "update" : "Submit"}
              </Button>
            </Box>
          </Box>
          {renderMenu}
          {renderCommentMenu}
          <ModalRalli
            open={isShareModalOpen}
            onClose={handleClose}
            isShareModalOpen={isShareModalOpen}
            selectItem={selectItem}
            setSelectItem={setSelectItem}
            handleSend={handleSend}
          />
        </Box>
      </Container>
    </>
  );
};

export default CommentsPage;