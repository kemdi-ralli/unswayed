"use client"
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  useMediaQuery,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import Image from "next/image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ViewSidebarIcon from "@mui/icons-material/ViewSidebar";
import { GET_MESSAGES } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { useSelector } from "react-redux";
import TextInput from "@/components/input/TextInput";
import { echo } from "@/helper/webSockets";
import SharePostMessage from "@/components/SharePost/SharePost";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { Toast } from "@/components/Toast/Toast";
import { encode } from "@/helper/GeneralHelpers";

const OpendMessages = ({ chatUser, toggleDrawer }) => {
  const [Messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [EditMessage, setEditMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const { userData } = useSelector((state) => state.auth);
  const selectedUser = chatUser?.participants?.find(
    (el) => el?.id !== userData?.user?.id
  );

  const handleClick = (event, msg) => {
    setAnchorEl({ element: event.currentTarget, message: msg });
  };
  const handleClose = () => setAnchorEl(null);
  const handleAction = async (action, msg) => {
    console.log(msg);
    handleClose();
    if (action === "Edit") {
      setEditMessage(msg);
    } else {
      if (msg) {
        try {
          const response = await apiInstance.delete(
            `chats/${chatUser?.id}/delete-message/${msg?.id}`
          );
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            Toast("success", response.data.message);
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  const getMessages = async () => {
    const response = await apiInstance.get(
      `${GET_MESSAGES}/${chatUser.id}/messages?page=1&limit=10000`
    );
    if (response.status === 200 || response.status === 201) {
      setMessages(response.data.data.messages);
    }
  };

  useEffect(() => {
    echo
      .channel(`ralli.chat.${chatUser?.id}`)
      .listen("MessageSent", (event) => {
        const { message: newMessage, type } = event;
        if (type === "new") {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        } else if (type === "update") {
          setMessages((previousState) =>
            previousState.map((msg) =>
              msg.id === newMessage.id ? { ...msg, ...newMessage } : msg
            )
          );
        } else if (type === "delete") {
          setMessages((previousState) =>
            previousState.filter((msg) => msg.id !== newMessage?.id)
          );
        }
      });

    return () => {
      echo.leaveChannel(`ralli.chat.${chatUser?.id}`);
    };
  }, [chatUser?.id]);

  useEffect(() => {
    if (chatUser?.id) {
      getMessages();
    }
  }, [chatUser?.id]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [Messages]);

  const onSendMessage = async () => {
    const formData = new FormData();
    formData.append("content", newMessage);
    if (EditMessage) {
      try {
        const response = await apiInstance.post(
          `chats/${chatUser.id}/update-message/${EditMessage.id}`,
          formData
        );
        console.log(response);
        if (response.status === 200 || response.status === 201) {
          Toast("success", response.data.message);
          setEditMessage(null);
          setAnchorEl(null);
          setNewMessage("");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await apiInstance.post(
          `chats/${chatUser.id}/send-message`,
          formData
        );
        if (response.status === 200 || response.status === 201) {
          setNewMessage("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    setNewMessage(EditMessage?.content);
  }, [EditMessage]);
  const router = useRouter()
  const navigate = (selectedUser) => {
    if (selectedUser.id) {
      const encodedId = encode(selectedUser.id);
      router.push(`/profile/${encodedId}`);
    }
  }

  if (!selectedUser) {
    return (
      <>
        {isSmallScreen && (
          <Tooltip title="Open the messages item" arrow>
            <IconButton onClick={() => toggleDrawer(true)}>
              <ViewSidebarIcon />
            </IconButton>
          </Tooltip>
        )}
        <Box
          sx={{
            minHeight: "800px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              src={"/assets/images/unselectChat.png"}
              width={50}
              height={50}
              alt="not selected"
            />
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
                lineHeight: "18px",
                fontWeight: 600,
                color: "#00305B",
                py: 2,
              }}
            >
              You Have Messages
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "14px", sm: "16px", md: "18px" },
                lineHeight: "18px",
                fontWeight: 300,
                color: "#000000",
                pb: 2,
              }}
            >
              Select a conversation to read
            </Typography>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Box sx={styles.container}>
      <Box sx={styles.messageHeader} onClick={() => navigate(selectedUser)}>
        {isSmallScreen && (
          <IconButton onClick={() => toggleDrawer(true)}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar
          alt="Profile Picture"
          src={selectedUser.photo}
          sx={styles.avatar}
        />
        <Typography sx={styles.username}>
          {selectedUser.first_name +
            " " +
            selectedUser.middle_name +
            " " +
            selectedUser.last_name ?? ""}
        </Typography>
      </Box>

      {/* Message Content */}
      <Box
        sx={{
          maxHeight: "600px",
          minHeight: "600px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "1px",
          },
        }}
      >
        <Box sx={styles.chatContent}>
          {Messages?.sort((a, b) => a?.id - b?.id)?.map((msg, index) => {
            const MyMessage = msg?.sender?.id === userData?.user?.id;
            const formattedTime = new Date(msg.created_at).toLocaleString(
              "en-US",
              {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              }
            );
            return msg.message_type === "share" ? (
              <Box key={index} sx={{ float: "right" }}>
                <SharePostMessage data={msg} />
              </Box>
            ) : (
              <Box key={index} sx={{ mb: 2, textAlign: MyMessage ? "right" : "left" }}>
                <Typography
                  sx={{
                    display: "inline-block",
                    fontSize: {
                      xs: "10px",
                      sm: "10px",
                      md: "12px",
                      lg: "14px",
                    },
                    lineHeight: "18px",
                    fontWeight: 400,
                    padding: "8px 12px",
                    borderRadius: "12px",
                    maxWidth: "70%",
                    backgroundColor: MyMessage ? "#DCF8C6" : "gray",
                    whiteSpace: "pre-wrap", // ✅ preserves line breaks and spaces
                    wordBreak: "break-word", // ✅ wraps long words
                  }}
                >
                  {msg.content}
                </Typography>

                {MyMessage && (
                  <>
                    <IconButton size="small" onClick={(event) => handleClick(event, msg)}>
                      <MoreVertRoundedIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl?.element}
                      open={anchorEl?.message?.id === msg?.id}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      {["Edit", "Delete"].map((action) => (
                        <MenuItem
                          key={action}
                          onClick={() => handleAction(action, msg)}
                          sx={styles.menuItem}
                        >
                          {action}
                        </MenuItem>
                      ))}
                    </Menu>
                  </>
                )}

                <Typography color="textSecondary" sx={styles.timeText}>
                  {formattedTime}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box sx={styles.inputContainer}>
        {EditMessage && (
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#DCF8C6",
              display: "flex",
              justifyContent: "space-between",
              mb: "5px",
              px: "5px",
            }}
          >
            <Typography sx={styles.message}>Editing</Typography>
            <IconButton
              size="small"
              onClick={() => (setAnchorEl(null), setEditMessage(null))}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        <TextInput
          placeholder="Write Message (Click Shift + Enter for a new line)"
          type="send"
          value={newMessage}
          setValue={setNewMessage}
          onSend={onSendMessage}
          ContainerStyle={{ marginTop: "0px" }}
        />
      </Box>
    </Box>
  );
};

// styles unchanged
const styles = {
  container: {
    minHeight: "780px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  messageHeader: {
    display: "flex",
    alignItems: "center",
    mb: 2,
    pb: 1,
    borderBottom: "1px solid #ccc",
    cursor: "pointer",
  },
  avatar: {
    width: { xs: 35, sm: 40, md: 45, lg: 50 },
    height: { xs: 35, sm: 40, md: 45, lg: 50 },
    mr: 2,
  },
  username: {
    fontSize: { xs: "10px", sm: "12px", md: "14px", lg: "16px" },
    lineHeight: "18px",
    fontWeight: 600,
    color: "#000306",
  },
  message: {
    display: "inline-block",
    fontSize: {
      xs: "10px",
      sm: "10px",
      md: "12px",
      lg: "14px",
    },
    lineHeight: "18px",
    fontWeight: 400,
    padding: "8px 12px",
    borderRadius: "12px",
    maxWidth: "70%",
    backgroundColor: "#DCF8C6",
  },
  chatContent: {
    borderRadius: "8px",
    p: 2,
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
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
    pr: 2,
  },
  optionsButton: {
    color: "#FE4D82",
    "&:hover": {
      backgroundColor: "inherit",
      color: "#FE4D82",
    },
  },
  icon: {
    cursor: "pointer",
  },
  menuItem: {
    color: "black",
    fontSize: {
      xs: "8px",
      sm: "8px",
      md: "10px",
      lg: "12px",
    },
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
  },
};

export default OpendMessages;
