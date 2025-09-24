import React, { useEffect, useState } from "react";
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { GET_CHATS } from "@/services/apiService/apiEndPoints";
import { echo } from "@/helper/webSockets";
import { useSelector } from "react-redux";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { Toast } from "@/components/Toast/Toast";


const MessageItems = ({ setChatUser = () => { }, chatId = null }) => {
  const [chatData, setChatData] = useState([]);
  const [SelectedUser, setSelectedUser] = useState(null);
  const { userData } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event, _chat) => {
    setAnchorEl({ element: event.currentTarget, chat: _chat });
  };
  const handleClose = () => setAnchorEl(null);

  const handleDeleteChat = async (chat) => {
    handleClose();
    if (chat) {
      try {
        const response = await apiInstance.delete(
          `chats/${chat?.id}/delete`
        );
        if (response.status === 200 || response.status === 201) {
          setChatData(prevChats => prevChats.filter(__chat => __chat.id !== chat?.id));
          setChatUser({});
          Toast("success", response?.data?.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getChats = async () => {
    const response = await apiInstance.get(`${GET_CHATS}?page=1&limit=10000`);
    if (response.status === 200 || response.status === 201) {
      setChatData(response?.data?.data?.chats);
      if (chatId) {
        const currentChat = response?.data?.data?.chats?.find(item => parseInt(item?.id) === parseInt(chatId));
        setChatUser(currentChat);
        setSelectedUser(currentChat?.id);
      }
    }
  };

  useEffect(() => {
    echo
      .channel(`ralli.userChats.${userData?.user?.id}`)
      .listen("ChatReceived", (event) => {
        const { chat } = event;

        setChatData((previousChats) => {
          const index = previousChats.findIndex((c) => c.id === chat.id);

          if (index !== -1) {
            const updatedChat = {
              ...chat,
            };

            return [
              updatedChat,
              ...previousChats.slice(0, index),
              ...previousChats.slice(index + 1),
            ];
          } else {
            const updatedChats = [
              {
                ...chat,
              },
              ...previousChats,
            ];

            return updatedChats;
          }
        });
      });

    return () => {
      echo.leaveChannel(`ralli.userChats.${userData?.user?.id}`);
    };
  }, []);

  useEffect(() => {
    getChats();
  }, []);

  const handleSelectedChat = (item) => {
    setChatUser(item);
    setSelectedUser(item.id);
  }

  return (
    <Box>
      <Typography
        sx={{
          fontSize: { xs: "16px", sm: "18px", md: "22px" },
          lineHeight: "18px",
          fontWeight: 600,
          color: "#00305B",
          pb: 2,
        }}
      >
        Messages
      </Typography>
      {chatData?.map((item, index) => {
        var formatted = new Date();
        if (item?.last_message) {
          formatted = new Date(item?.last_message?.created_at);
        }
        const chatUser = item.participants.find(
          (el) => el?.id !== userData?.user?.id
        );

        return (
          <Box
            key={index}
            onClick={() => handleSelectedChat(item)}
            sx={{
              display: "flex",
              alignItems: "center",
              my: 2,
              cursor: "pointer",
              backgroundColor:
                SelectedUser === item.id ? "#00305B" : "transparent",
              borderRadius: "8px",
              padding: "8px",
              transition: "background-color 0.1s",
            }}
          >
            <>
              <IconButton
                size="small"
                onClick={(event) => handleClick(event, item)}
              >
                <MoreVertRoundedIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl?.element}
                open={anchorEl?.chat?.id === item?.id}
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
                {["Delete"].map((action) => (
                  <MenuItem
                    key={action}
                    onClick={() => handleDeleteChat(item)}
                    sx={{
                      color: "black",
                      fontSize: {
                        xs: "8px",
                        sm: "8px",
                        md: "10px",
                        lg: "12px",
                      },
                    }}
                  >
                    {action}
                  </MenuItem>
                ))}
              </Menu>
            </>
            <Avatar
              alt="Profile Picture"
              src={chatUser?.photo ? chatUser?.photo : ""}
              sx={{
                width: { xs: 40, lg: 50 },
                height: { xs: 40, lg: 50 },
                border: "2px solid",
                borderColor: SelectedUser === item.id ? "#FFFFFFFF" : "#000306",
                backgroundColor: "#FFFF",
              }}
            />
            <Box sx={{ px: { xs: 1, lg: 1 }, width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: {
                      xs: "8px",
                      sm: "10px",
                      md: "10px",
                      lg: "14px",
                    },
                    lineHeight: { xs: "12px", md: "15px" },
                    fontWeight: 500,
                    color: SelectedUser === item.id ? "#FFFFFFFF" : "#000306",
                  }}
                >
                  {chatUser.first_name +
                    " " +
                    chatUser.middle_name +
                    " " +
                    chatUser.last_name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "8px", sm: "12px", lg: "16px" },
                    lineHeight: { xs: "12px", md: "15px" },
                    fontWeight: 400,
                    color: SelectedUser === item.id ? "#FFFFFFFF" : "#189e33ff",
                    textDecoration: "underline",
                  }}
                >
                  {formatted.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hourCycle: "h12",
                  })}
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "8px", sm: "10px", md: "12px" },
                  lineHeight: "18px",
                  fontWeight: 300,
                  color: SelectedUser === item.id ? "#FFFFFFFF" : "#000306",
                  py: 0.2,
                }}
              >
                {item?.last_message?.message_type === "text" ? item?.last_message?.content : "Sent a post..."}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default MessageItems;
