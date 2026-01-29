import React, { useState, useEffect } from "react";
import { Modal, Box, CircularProgress } from "@mui/material";
import { SHARE_YOUR_FEED } from "@/constant/applicant/feed";
import SharePost from "./SharePost";
import ChangePassword from "../profile/ChangePassword";
import PasswordChangeContainer from "../forgetPassword/PasswordChangeContainer";

const PRELOADER_DELAY_MS = 300;

const ModalRalli = ({
  open,
  onClose,
  isShareModalOpen,
  isChangePasswordModalOpen,
  isForgetPasswordModalOpen,
  selectItem,
  setSelectItem,
  handleSend
}) => {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    if (!open) {
      setContentReady(false);
      return;
    }
    const t = setTimeout(() => setContentReady(true), PRELOADER_DELAY_MS);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          width: "100%",
          maxWidth: "1260px",
          height: "740px",
          borderRadius: 2,
          overflowY:"scroll",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {!contentReady ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 600 }}>
            <CircularProgress size={48} sx={{ color: "#00305B" }} />
          </Box>
        ) : (
        <Box sx={{}}>
          {isShareModalOpen && (
            <SharePost
              data={SHARE_YOUR_FEED}
              handleClose={onClose}
              selectItem={selectItem}
              setSelectItem={setSelectItem}
              handleSend={handleSend}
            />
          )}
          {isChangePasswordModalOpen && (
            <ChangePassword handleClose={onClose} />
          )}
          {isForgetPasswordModalOpen && (
            <PasswordChangeContainer handleClose={onClose} />
          )}
        </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ModalRalli;
