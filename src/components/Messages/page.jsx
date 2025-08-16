import React, { useState, useEffect } from "react";
import { Box, Grid, useMediaQuery } from "@mui/material";
import RalliDrawer from "../common/Drawer/RalliDrawer";
import Container from "../common/Container";
import MessageItems from "../applicant/chatComponent/MessageItems";
import OpendMessages from "../applicant/chatComponent/OpendMessages";
import { useSearchParams } from "next/navigation";
import { decode } from "@/helper/GeneralHelpers";
import { useDispatch } from "react-redux";
import { setType } from "@/redux/slices/NotificationSlice";

const Messages = () => {
  const searchParams = useSearchParams();
  const chatParamId = searchParams?.get('chatId');
  const chatId = chatParamId ? decode(chatParamId) : null;
  const [ChatUser, setChatUser] = useState({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const dispatch = useDispatch();

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };
  useEffect(() => {
      dispatch(setType({ isChat: false }));
  }, [dispatch]);

  return (
    <Box>
      {isSmallScreen && (
        <RalliDrawer
          setChatUser={setChatUser}
          chatId={chatId}
          open={drawerOpen}
          onClose={() => toggleDrawer(false)}
        />
      )}
      <Container>
        <Grid container spacing={2}>
          {!isSmallScreen && (
            <Grid item xs={4} md={4}>
              <Box sx={styles.chatsContainer}>
                <MessageItems setChatUser={setChatUser} chatId={chatId} />
              </Box>
            </Grid>
          )}
          <Grid item xs={12} md={8}>
            <Box sx={styles.messageContainer}>
              <OpendMessages toggleDrawer={toggleDrawer} chatUser={ChatUser} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

const styles = {
  chatsContainer: {
    minHeight: "800px",
    maxHeight: "800px",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 1px 3px #00000040",
    px: 2,
    py: 2,
    my: 2,
  },
  messageContainer: {
    minHeight: "800px",
    maxHeight: "800px",
    overflowY: "scroll",
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0px 1px 3px #00000040",
    px: 2,
    py: 2,
    my: 2,
  },
};

export default Messages;
