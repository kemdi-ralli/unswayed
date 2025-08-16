import React from "react";
import { Modal, Box } from "@mui/material";
import { SHARE_YOUR_FEED } from "@/constant/applicant/feed";
import SharePost from "./SharePost";
import ChangePassword from "../profile/ChangePassword";
import PasswordChangeContainer from "../forgetPassword/PasswordChangeContainer";

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
      </Box>
    </Modal>
  );
};

export default ModalRalli;
