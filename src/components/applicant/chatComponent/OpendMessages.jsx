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
    handleClose();
    if (action === "Edit") {
      setEditMessage(msg);
    } else {
      if (msg) {
        try {
          const response = await apiInstance.delete(
            `chats/${chatUser?.id}/delete-message/${msg?.id}`
          );
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
    if (EditMessage) {
      try {
        const response = await apiInstance.post(
          `chats/${chatUser.id}/update-message/${EditMessage.id}`,
          { content: newMessage }
        );
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
          { content: newMessage }
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

  const router = useRouter();
  const navigate = (selectedUser) => {
    if (selectedUser.id) {
      const encodedId = encode(selectedUser.id);
      router.push(`/profile/${encodedId}`);
    }
  };

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
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Image
              src={"/assets/images/unselectChat.png"}
              width={50}
              height={50}
              alt="not selected"
            />
            <Typography sx={{ fontSize: "18px", fontWeight: 600, color: "#00305B", py: 2 }}>
              You Have Messages
            </Typography>
            <Typography sx={{ fontSize: "16px", fontWeight: 300, color: "#000000" }}>
              Select a conversation to read
            </Typography>
          </Box>
        </Box>
      </>
    );
  }

  return (
    <Box sx={styles.container}>
      {/* Header */}
      <Box sx={styles.messageHeader} onClick={() => navigate(selectedUser)}>
        {isSmallScreen && (
          <IconButton onClick={() => toggleDrawer(true)}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Avatar alt="Profile Picture" src={selectedUser.photo} sx={styles.avatar} />
        <Typography sx={styles.username}>
          {selectedUser.first_name +
            " " +
            selectedUser.middle_name +
            " " +
            selectedUser.last_name ?? ""}
        </Typography>
      </Box>

      {/* Scrollable Messages */}
      <Box sx={styles.chatScrollable}>
        <Box sx={styles.chatContent}>
          {Messages?.sort((a, b) => a?.id - b?.id)?.map((msg, index) => {
            const MyMessage = msg?.sender?.id === userData?.user?.id;
            const formattedTime = new Date(msg.created_at).toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            });
            return msg.message_type === "share" ? (
              <Box key={index} sx={{ float: "right" }}>
                <SharePostMessage data={msg} />
              </Box>
            ) : (
              <Box key={index} sx={{ mb: 2, textAlign: "left" }}>
                <Typography
                  sx={{
                    display: "inline-block",
                    fontSize: "14px",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    maxWidth: "70%",
                    backgroundColor: MyMessage ? "#e8faf0ff" : "#c2c2c2ff",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
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
                    >
                      {["Edit", "Delete"].map((action) => (
                        <MenuItem key={action} onClick={() => handleAction(action, msg)}>
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
              backgroundColor: "#e8faf0ff",
              display: "flex",
              justifyContent: "space-between",
              mb: "5px",
              px: "5px",
            }}
          >
            <Typography sx={styles.message}>Editing</Typography>
            <IconButton size="small" onClick={() => (setAnchorEl(null), setEditMessage(null))}>
              <CloseIcon />
            </IconButton>
          </Box>
        )}
        <TextInput
          placeholder="Write Message (Shift + Enter for new line)"
          type="send"
          value={newMessage}
          setValue={setNewMessage}
          onSend={onSendMessage}
        />
      </Box>
    </Box>
  );
};
// MyMessage ? "right" : "left"
// styles
const styles = {
  container: {
    height: "80vh", // full screen like ChatGPT
    display: "flex",
    flexDirection: "column",
  },
  messageHeader: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderBottom: "1px solid #ccc",
    flexShrink: 0, // stays fixed
  },
  avatar: {
    width: 50,
    height: 50,
    mr: 2,
  },
  username: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#000306",
  },
  chatScrollable: {
    flexGrow: 1, // takes up available space
    overflowY: "auto",
    padding: "10px",
    "&::-webkit-scrollbar": {
      width: "4px",
    },
  },
  chatContent: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  timeText: {
    fontSize: "10px",
    color: "#555",
  },
  inputContainer: {
    borderTop: "1px solid #ccc",
    flexShrink: 0, // stays fixed at bottom
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: "14px",
    padding: "8px 12px",
    borderRadius: "12px",
    maxWidth: "70%",
  },
};

export default OpendMessages;
