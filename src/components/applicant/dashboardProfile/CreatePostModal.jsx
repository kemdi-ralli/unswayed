"use client";
import React from "react";
import {
  Avatar,
  Box,
  Divider,
  Modal,
  Typography,
  IconButton,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import RalliButton from "@/components/button/RalliButton";
import SelectPostType from "./SelectPostType";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "790px",
  width: { xs: "90%" },
  height: "auto",
  bgcolor: "#FFFFFF",
  boxShadow: "0px 1px 5px #00000040",
  p: 4,
  borderRadius: "15px",
};

const CreatePostModal = ({
  open,
  onClose,
  user,
  isPostType,
  dropdownStates,
  setDropdownStates,
  inputValue,
  setInputValue,
  mediaPreview,
  mediaType,
  handleMediaChange,
  handlePost,
  media,
  setMedia,
  fileInputRef,
  setMediaPreview,
  isReportModal,
  setDescription,
  description,
  setSelectedOption,
  selectedOption,
  handeSubmitReport,
  reportError,
  isDelete,
  isEdit,
  isCreatePost,
  loading
}) => {
  const handleClose = () => onClose();

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const getAcceptType = () => {
    const type = dropdownStates?.postType;
    if (type === "post") return "image/*";
    if (type === "reel") return "video/*";
    return "image/*,video/*";
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {isReportModal && (
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              p: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: "flex-end",
                cursor: "pointer"
              }}
              onClick={handleClose}
            >
              <CloseIcon color="primary" />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mt: 4,
                p: 3,
              }}
            >
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Select Type To Report
              </FormLabel>
              <FormControl component="fieldset">
                <RadioGroup
                  name="report-reason"
                  value={selectedOption}
                  onChange={handleOptionChange}
                >
                  <FormControlLabel value="spam" control={<Radio />} label="Spam" />
                  <FormControlLabel value="abusive" control={<Radio />} label="Abusive" />
                  <FormControlLabel
                    value="irrelevant"
                    control={<Radio />}
                    label="Irrelevant"
                  />
                  <FormControlLabel value="other" control={<Radio />} label="Others" />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box sx={{ mb: "20px" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "#222222",
                  mb: "10px",
                }}
              >
                Description
              </Typography>
              <Box
                component="textarea"
                rows={5}
                sx={{
                  width: "100%",
                  boxShadow: "0px 0px 3px #00000040",
                  border: "none",
                  outline: "none",
                  padding: "18px 20px",
                  borderRadius: "10px",
                  fontSize: "16px",
                  fontWeight: 300,
                  lineHeight: "24px",
                  color: "#222222",
                  resize: "vertical",
                }}
                placeholder="Describe Why You Want To Report"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Box>
            {reportError && (
              <Typography sx={{ color: "red", fontSize: 13, mt: 1 }}>
                {reportError}
              </Typography>
            )}
            <RalliButton label="Submit" onClick={handeSubmitReport} />
          </Box>
        )}

        {isDelete && (
          <Box sx={{ textAlign: "center", p: 3 }}>
            <Typography sx={{ mb: 2 }}>Are you sure you want to delete?</Typography>
            <Button variant="contained" color="error" onClick={handlePost}>
              Yes, Delete
            </Button>
          </Box>
        )}

        {(isEdit || isCreatePost) && !isReportModal && !isDelete && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                  <Avatar
                    src={user?.photo}
                    alt="user"
                    sx={{
                      width: { xs: 50, sm: 60, md: 95 },
                      height: { xs: 50, sm: 60, md: 95 },
                    }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: { xs: "12px", sm: "15px", md: "16px" },
                        lineHeight: { xs: "12px", sm: "20px" },
                        fontWeight: 500,
                        color: "#00305B",
                      }}
                    >
                      {user?.username}
                    </Typography>
                    <SelectPostType
                      names={isPostType}
                      isEdit={isEdit}
                      selectedValue={dropdownStates?.postType}
                      onChange={(value) =>
                        setDropdownStates((prevState) => ({
                          ...prevState,
                          postType: value,
                        }))
                      }
                    />
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  width: { xs: "40px", sm: "45px", md: "59px" },
                  height: { xs: "40px", sm: "45px", md: "59px" },
                  borderRadius: "50%",
                  boxShadow: "0px 1px 5px #00000040",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={handleClose}
              >
                <CloseIcon />
              </Box>
            </Box>
            <Divider sx={{ pt: 2 }} />
            <Box
              sx={{
                mt: 2,
                mb: mediaPreview ? 2 : 0,
                width: "100%",
                boxShadow: "0px 0px 3px #00000040",
                border: "none",
                outline: "none",
                padding: "18px 20px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "24px",
                color: "#222222",
              }}
            >
              <Box
                component={!mediaPreview ? "textarea" : "input"}
                rows={12}
                sx={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  resize: "vertical",
                }}
                fullWidth
                placeholder="Write something..."
                multiline
                minRows={media ? 3 : 12}
                maxRows={12}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {mediaPreview && (
                <Box sx={{ mt: 2, position: "relative" }}>
                  <IconButton
                    onClick={() => {
                      setMedia(null)
                      setMediaPreview(null)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = null;
                      }
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.6)",
                      color: "white",
                      zIndex: 1,
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.8)",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>

                  {mediaType?.startsWith("image") ? (
                    <Box
                      component="img"
                      src={mediaPreview}
                      alt="media preview"
                      sx={{
                        width: "100%",
                        borderRadius: "8px",
                        objectFit: "contain",
                        maxHeight: "400px",
                      }}
                    />
                  ) : mediaType?.startsWith("video") ? (
                    <video
                      src={mediaPreview}
                      controls
                      style={{
                        width: "100%",
                        borderRadius: "8px",
                        maxHeight: "400px",
                      }}
                    />
                  ) : null}
                </Box>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    width: { xs: "40px", sm: "45px", md: "59px" },
                    height: { xs: "40px", sm: "45px", md: "59px" },
                    borderRadius: "50%",
                    boxShadow: "0px 1px 5px #00000040",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <IconButton
                    component="label"
                    aria-label="Add Media"
                    sx={{ width: "100%", height: "100%" }}
                  >
                    <ImageIcon />
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={getAcceptType()}
                      hidden
                      onChange={handleMediaChange}
                      disabled={!dropdownStates?.postType}
                    />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePost}
                  disabled={loading || (!inputValue && !media)}
                >
                  {isEdit ? 'Update' : 'Post'}
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default CreatePostModal;
