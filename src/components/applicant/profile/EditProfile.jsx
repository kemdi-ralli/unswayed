"use client";
import React, { useState } from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import RalliButton from "@/components/button/RalliButton";
import ModalRalli from "../dashboardProfile/ModalRalli";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RalliDropdown from "../applied/RalliDropdown";
import { useSelector } from "react-redux";
import BackButtonWithTitle from "../dashboard/BackButtonWithTitle";
import { useRouter } from "next/navigation";

const EditProfile = ({
  profileDetails,
  setProfileDetails,
  ethnicity,
  countries,
  states,
  cities,
  genders,
  experienceLevel,
  handleDropdownChange,
  handleProfilePicChange,
  profilePicPreview,
  onSave,
  loading,
  error,
  formikErrors,
  data,
}) => {
  const router = useRouter()
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const handleChangePassword = () => {
    router.push("/applicant/settings/change-password");
  };
  const getUserData = useSelector((state) => state?.auth?.userData);

  const handleCloseModal = () => {
    setIsChangePasswordModalOpen(false);
  };

  const handleAddSkill = (e, fieldName) => {
    if (e.key === "Enter" && e.target.value.trim() !== "") {
      const newSkill = e.target.value.trim();

      setProfileDetails((prevDetails) => {
        const updatedContactDetails = prevDetails.contactDetails.map((item) => {
          if (item.name === fieldName) {
            const currentSkills = Array.isArray(item.value) ? item.value : [];
            return { ...item, value: [...currentSkills, newSkill] };
          }
          return item;
        });

        return { ...prevDetails, contactDetails: updatedContactDetails };
      });

      e.target.value = "";
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileDetails((prevDetails) => {
      const updatedSkills = prevDetails.contactDetails
        .find((item) => item.name === "skills")
        ?.value.filter((skill) => skill !== skillToRemove);

      return {
        ...prevDetails,
        contactDetails: prevDetails.contactDetails.map((item) =>
          item.name === "skills" ? { ...item, value: updatedSkills } : item
        ),
      };
    });
  };

  const handleFieldChange = (name, newValue) => {
    setProfileDetails((prevDetails) => {
      const updatedContactDetails = prevDetails.contactDetails.map((item) => {
        if (item.name === name) {
          return { ...item, value: newValue };
        }
        return item;
      });
      return { ...prevDetails, contactDetails: updatedContactDetails };
    });
  };
  const handleChange = (name, value) => {
    setProfileDetails((prevDetails) => {
      const updatedContactDetails = prevDetails.contactDetails.map((item) => {
        if (item.name === name) {
          return { ...item, value };
        }
        return item;
      });

      return { ...prevDetails, contactDetails: updatedContactDetails };
    });
  };

  return (
    <Box sx={{ px: "25px", maxWidth: "1260px", margin: "25px auto" }}>
      <BackButtonWithTitle label="Edit Profile" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Box
            component="label"
            sx={{
              position: "absolute",
              zIndex: 1,
              top: 10,
              width: { xs: "30px", md: "40px" },
              height: { xs: "30px", md: "40px" },
              backgroundColor: "#FE4D82",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              ml: { md: 2 },
              cursor: "pointer",
            }}
          >
            <EditIcon sx={{ color: "#FFF" }} />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
          </Box>
          <Avatar
            alt="User Profile"
            src={profilePicPreview || profileDetails?.userProfile}
            sx={{
              width: { xs: 120, sm: 150, md: 191 },
              height: { xs: 120, sm: 150, md: 191 },
            }}
          />
        </Box>

        <Typography
          sx={{
            fontSize: { xs: "20px", sm: "22px", md: "26px" },
            fontWeight: 600,
            lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "33px" },
            color: "#111111",
            mt: "10px",
            mb: "-5px",
          }}
        >
          {profileDetails?.userName}
        </Typography>
        {data?.provider === "manual" && (
          <Button
            sx={{
              fontSize: { xs: "16px", sm: "16px", md: "19px" },
              fontWeight: 500,
              lineHeight: { xs: "25px", sm: "30px", md: "24px", lg: "17px" },
              color: "#00305B",
              textDecoration: "underline",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleChangePassword}
          >
            Change Password
          </Button>
        )}
      </Box>
      {getUserData?.is_completed === false && (
        <Box>
          <Typography
            sx={{
              fontSize: { xs: "20px", sm: "22px", md: "26px" },
              fontWeight: 500,
              lineHeight: { xs: "25px", sm: "30px", md: "31px", lg: "33px" },
              color: "red",
              mt: "10px",
              textAlign: "center",
            }}
          >
            Please complete your profile. Do not proceed further until the
            profile is complete.
          </Typography>
        </Box>
      )}

      <ModalRalli
        open={isChangePasswordModalOpen}
        onClose={handleCloseModal}
        isChangePasswordModalOpen={isChangePasswordModalOpen}
      />

      <Typography
        sx={{
          fontWeight: 600,
          fontSize: "30px",
          lineHeight: "18px",
          color: "#00305B",
          py: 2,
          pb: 4,
        }}
      >
        Edit Profile
      </Typography>

      {profileDetails?.contactDetails?.map((item, index) => {
        if (item.name === "skills") {
          return (
            <Box key={item.name} sx={{ mb: "20px" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "#222222",
                  mb: "10px",
                }}
              >
                {item?.title}
                {item?.required && <span style={{ color: "red" }}>*</span>}
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  boxShadow: "0px 0px 3px 0.4px #00000040",
                  border: "none",
                  outline: "none",
                  padding: "18px 20px",
                  borderRadius: "10px",
                  py: 1,
                }}
              >
                <Box
                  component="input"
                  sx={{
                    width: "100%",
                    border: "none",
                    outline: "none",
                    padding: "18px 20px",
                    borderRadius: "10px",
                    fontSize: "16px",
                    fontWeight: 300,
                    lineHeight: "18px",
                    color: "#222222",
                  }}
                  placeholder="Type skills and press Enter"
                  onKeyDown={(e) => handleAddSkill(e, item.name)}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "10px",
                  }}
                >
                  {item?.value?.map((skill, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#00305B",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        boxShadow: "0px 0px 3px #00000040",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 400,
                          color: "#FFF",
                          mr: "10px",
                        }}
                      >
                        {skill}
                      </Typography>
                      <CloseIcon
                        sx={{
                          cursor: "pointer",
                          color: "#fff",
                        }}
                        onClick={() => handleRemoveSkill(skill)}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          );
        }
        if (item.name === "about") {
          return (
            <Box key={item.name} sx={{ mb: "20px" }}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "#222222",
                  mb: "10px",
                }}
              >
                {item?.title}
                {item?.required && <span style={{ color: "red" }}>*</span>}
              </Typography>

              <Box
                component="textarea"
                rows={5}
                sx={{
                  width: "100%",
                  boxShadow: "0px 0px 3px 0.4px #00000040",
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
                placeholder={item?.placeholder}
                value={item?.value || ""}
                onChange={(e) => handleFieldChange(item.name, e.target.value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </Box>
          );
        }
        if (item.name === "dob") {
          return (
            <LocalizationProvider dateAdapter={AdapterDayjs} key={item.name}>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "18px",
                  color: "#222222",
                  mb: "10px",
                }}
              >
                {item?.title}
                <span style={{ color: "red" }}>*</span>
              </Typography>

              <DatePicker
                value={item.value ? dayjs(item.value) : null}
                onChange={(date) =>
                  handleFieldChange(
                    item.name,
                    date ? dayjs(date).format("YYYY-MM-DD") : ""
                  )
                }
                maxDate={dayjs()}
                slotProps={{
                  textField: {
                    placeholder: item.placeHolder,
                    sx: {
                      width: "100%",
                      borderRadius: "10px",
                      boxShadow: "0px 0px 3px 1px #00000040",
                      border: "none",
                      mb: "10px",
                      "& input": {
                        color: "#000",
                        padding: "13px 10px",
                        width: "100%",
                        border: "none",
                        outline: "none",
                      },
                      "& fieldset": {
                        border: "none !important",
                      },
                      "&:hover": {
                        outline: "none",
                        border: "none",
                      },
                    },
                  },
                }}
                sx={{
                  width: "100%",
                  height: "40px",
                  boxShadow: "0px 0px 3px 1px #00000040",
                  "& .MuiOutlinedInput-root": {
                    border: "none !important",
                    outline: "none !important",
                  },
                  "&:hover": {
                    outline: "none",
                    border: "none",
                  },
                }}
              />
            </LocalizationProvider>
          );
        }
        if (item.name === "gender") {
          return (
            <RalliDropdown
              key={item.name}
              names={genders}
              label={item?.title}
              required={item?.required}
              selectedValue={item.value || ""}
              onChange={(value) => handleDropdownChange("gender", value)}
            />
          );
        }

        if (item.name === "country") {
          return (
            <RalliDropdown
              key={item.name}
              names={countries}
              label={item?.title}
              required={item?.required}
              selectedValue={item.value || ""}
              onChange={(value) => handleDropdownChange("country", value)}
            />
          );
        }
        if (item.name === "experience_level") {
          return (
            <RalliDropdown
              key={item.name}
              names={experienceLevel}
              label={item?.title}
              required={item?.required}
              selectedValue={item.value || ""}
              onChange={(value) =>
                handleDropdownChange("experience_level", value)
              }
            />
          );
        }
        if (item.name === "ethnicity") {
          return (
            <RalliDropdown
              key={item.name}
              names={ethnicity}
              label={item.title}
              required={item?.required}
              selectedValue={item.value || ""}
              onChange={(value) => handleChange("ethnicity", value)}
            />
          );
        }

        if (item.name === "state") {
          return (
            <>
              <RalliDropdown
                key={item.name}
                names={states}
                label={item?.title}
                required={item?.required}
                selectedValue={item.value || ""}
                onChange={(value) => handleDropdownChange("state", value)}
              />
              {formikErrors[item.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item.name]}
                </Typography>
              )}
            </>
          );
        }

        if (item.name === "city") {
          return (
            <>
              <RalliDropdown
                key={item.name}
                names={cities}
                label={item?.title}
                required={item?.required}
                selectedValue={item.value || ""}
                onChange={(value) => handleDropdownChange("city", value)}
              />
              {formikErrors[item?.name] && (
                <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                  {formikErrors[item?.name]}
                </Typography>
              )}
            </>
          );
        }
        return (
          <Box key={index}>
            <Typography
              sx={{
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "18px",
                color: "#222222",
                mb: "10px",
              }}
            >
              {item?.title}
              {item?.required && <span style={{ color: "red" }}>*</span>}
            </Typography>

            <Box
              component="input"
              sx={{
                width: "100%",
                boxShadow: "0px 0px 3px 0.4px #00000040",
                border: "none",
                outline: "none",
                padding: "18px 20px",
                borderRadius: "10px",
                fontSize: "16px",
                fontWeight: 300,
                lineHeight: "18px",
                color: "#222222",
                my: 1,
              }}
              placeholder={item?.placeholder}
              value={item?.value || ""}
              onChange={(e) => handleFieldChange(item.name, e.target.value)}
            />
            {formikErrors[item.name] && (
              <Typography color="error" sx={{ fontSize: "12px", mt: "5px" }}>
                {formikErrors[item.name]}
              </Typography>
            )}
          </Box>
        );
      })}

      <Box sx={{ my: 2 }}>
        <RalliButton label="Enter" onClick={onSave} loading={loading} />
      </Box>
    </Box>
  );
};

export default EditProfile;
