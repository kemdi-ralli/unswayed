import React, { useState, useRef } from "react";
import Image from "next/image";
import renderMenu from "@/helper/MenuHelpers";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ResumeInput from "@/components/applicant/ResumeTab/ResumeInput";
import {
  attachResume,
  deleteResume,
  replaceResume,
} from "@/redux/slices/getResumesSlice";
import { usePathname, useRouter } from "next/navigation";
import { setCvs } from "@/redux/slices/applicantCv";
import { setEditMode } from "@/redux/slices/editSlice";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ResumeTab = ({ data, resumeId, selectedResume, appliedJobId }) => {
  const [anchorEls, setAnchorEls] = useState({});
  const dispatch = useDispatch();
  const pathName = usePathname();
  const route = useRouter();
  const resumes = useSelector((state) => state?.getResume?.resumes);

  const handleProfileMenuOpen = (event, id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleMenuClose = (id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }));
  };
  const handleDeleteResume = (id) => {
    dispatch(deleteResume(id));
    handleMenuClose(id);
  };
  const handleEditResume = (el, id) => {
    dispatch(setCvs(el));
    dispatch(setEditMode(true));
    if (pathName.includes("/career-areas")) {
      route.push(
        `/applicant/career-areas/job-details/${appliedJobId}/apply/ralli-resume`
      );
    } else {
      route.push(`/applicant/profile/ralli-resume`);
    }
  };
  const handleReplaceResume = (id) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".pdf";

    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        const payload = { id, file };
        await dispatch(replaceResume(payload));
      } catch (err) {
        console.error("Failed to replace resume:", err);
      }
    };

    fileInput.click();
    handleMenuClose(id);
  };

  const fileInputRef = useRef(null);
  const handleFileUploadClick = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await dispatch(attachResume(file));
      console.log("Resume uploaded successfully!");
    } catch (err) {
      console.error("Failed to upload resume:", err);
    } finally {
      event.target.value = "";
    }
  };
  const getMenuItems = (el) =>
    [
      {
        label: "View",
        icon: <DescriptionIcon />,
        onClick: () => {
          const fileUrl = el.resume;
          if (fileUrl) {
            window.open(fileUrl, "_blank");
          } else {
            console.error("Resume URL not available for ID:", el.id);
          }
          handleMenuClose(el.id);
        },
      },
      {
        label: "Download",
        icon: <DownloadIcon />,
        onClick: () => {
          const fileUrl = el.resume;
          if (fileUrl) {
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = el.title || "resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            console.error("Resume URL not available for ID:", el.id);
          }
          handleMenuClose(el.id);
        },
      },
      {
        label: "Replace File",
        icon: <PublishedWithChangesIcon />,
        onClick: () => handleReplaceResume(el.id),
      },
      el.type === "build" && {
        label: "Edit",
        icon: <EditIcon />,
        onClick: () => handleEditResume(el, el.id),
      },
      {
        label: "Delete",
        icon: <DeleteForeverIcon />,
        onClick: () => handleDeleteResume(el.id),
      },
    ].filter(Boolean);
  const getFileExtension = (url) => {
    try {
      return url?.split(".").pop().split(/#|\?/)[0].toLowerCase();
    } catch {
      return null;
    }
  };

  const getFileIcon = (url) => {
    const ext = getFileExtension(url);
    if (ext === "pdf") return "/assets/images/document.png";
    if (ext === "txt") return "/assets/images/txt.png";
    if (ext === "doc" || ext === "docx") return "/assets/images/word.png";
    return null;
  };

  return (
    <Box sx={{ my: "10px" }}>
      {pathName.includes("/career-areas/job-details") ? (
        <>
          {resumes?.length === 0 ? (
            <></>
          ) : (
            // <ResumeInput
            //   handleFileUploadClick={handleFileUploadClick}
            //   fileInputRef={fileInputRef}
            //   handleFileChange={handleFileChange}
            // />
            resumes?.map((el, index) => {
              return (
                <Box
                  key={index}
                  sx={{
                    maxWidth: "570px",
                    backgroundColor: el?.id === resumeId ? "#00305B" : "none",
                    boxShadow: "0px 1px 5px #00000040",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    my: 1,
                    p: 2,
                  }}
                  onClick={() => selectedResume(el.id)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      src={getFileIcon(el.resume)}
                      width={53.09}
                      height={65.23}
                      alt="pdf"
                    />
                    <Box sx={{ px: 2, pt: "10px" }}>
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", sm: "15px", md: "18px" },
                          fontWeight: 700,
                          color: el?.id === resumeId ? "#FFF" : "#111111",
                        }}
                      >
                        {el.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: { xs: "10px", sm: "13px" },
                          fontWeight: 400,
                          color: el?.id === resumeId ? "#FFF" : "#333",
                        }}
                      >
                        {dayjs(el.created_at).fromNow()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <IconButton
                      size="large"
                      edge="end"
                      aria-controls={`menu-${el.id}`}
                      aria-haspopup="true"
                      onClick={(e) => handleProfileMenuOpen(e, el.id)}
                      color="inherit"
                    >
                      <MoreVertRoundedIcon
                        sx={{
                          cursor: "pointer",
                          color: el?.id === resumeId ? "#FFF" : "#111111",
                        }}
                      />
                    </IconButton>
                  </Box>
                  {renderMenu({
                    anchorEl: anchorEls[el.id],
                    isMenuOpen: Boolean(anchorEls[el.id]),
                    handleMenuClose: () => handleMenuClose(el.id),
                    menuId: `menu-${el.id}`,
                    menuItems: getMenuItems(el),
                  })}
                </Box>
              );
            })
          )}
        </>
      ) : (
        <>
          {resumes?.length === 0 && (
            <ResumeInput
              handleFileUploadClick={handleFileUploadClick}
              fileInputRef={fileInputRef}
              handleFileChange={handleFileChange}
            />
          )}
          {resumes?.map((el, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: "570px",
                backgroundColor: el?.id === resumeId ? "#00305B" : "none",
                boxShadow: "0px 1px 5px #00000040",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                my: 1,
                p: 2,
              }}
              onClick={() => selectedResume(el.id)}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <Box
                  sx={{
                    width: { xs: 30, sm: 40, md: 53.09 },
                    height: { xs: 40, sm: 50, md: 65.23 },
                  }}
                >
                  <Image
                    src={getFileIcon(el.resume)}
                    alt="pdf"
                    layout="responsive"
                    width={1}
                    height={1}
                  />
                </Box>
                <Box sx={{ px: { xs: 1, sm: 2 }, pt: "10px" }}>
                  <Typography
                    sx={{
                      fontSize: { xs: "9px", sm: "15px", md: "18px" },
                      fontWeight: 700,
                      color: el?.id === resumeId ? "#fff" : "#111111",
                    }}
                  >
                    {el.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { xs: "10px", sm: "13px" },
                      fontWeight: 400,
                      color: el?.id === resumeId ? "#FFF" : "#333",
                    }}
                  >
                    {dayjs(el.created_at).fromNow()}
                  </Typography>
                </Box>
              </Box>
              <Box>
                <IconButton
                  size="large"
                  edge="end"
                  aria-controls={`menu-${el.id}`}
                  aria-haspopup="true"
                  onClick={(e) => handleProfileMenuOpen(e, el.id)}
                  color="inherit"
                >
                  <MoreVertRoundedIcon
                    sx={{
                      cursor: "pointer",
                      color: el?.id === resumeId ? "#FFF" : "#111111",
                    }}
                  />
                </IconButton>
              </Box>
              {renderMenu({
                anchorEl: anchorEls[el.id],
                isMenuOpen: Boolean(anchorEls[el.id]),
                handleMenuClose: () => handleMenuClose(el.id),
                menuId: `menu-${el.id}`,
                menuItems: getMenuItems(el),
              })}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default ResumeTab;
