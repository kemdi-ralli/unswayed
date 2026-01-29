"use client";
import DescriptionIcon from "@mui/icons-material/Description";
import EmailIcon from "@mui/icons-material/Email";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import renderMenu from "@/helper/MenuHelpers";
import { GET_APPLICATION_DETAIL } from "@/services/apiService/apiEndPoints";
import apiInstance from "@/services/apiService/apiServiceInstance";
import ApplicationDetailModal from "../Modal/ApplicationDetailModal";
import ApplicationActionModal from "../Modal/ApplicationActionModal";
import ApplicationActionDetailModal from "../Modal/ApplicationActionDetailModal";
import RejectionReasonModal from "../Modal/RejectionReasonModal";
import { encode } from "@/helper/GeneralHelpers";

const ApplicationDetail = ({ applicationId = null }) => {
  const { user: { id = null, type = null } = {} } = useSelector(
    (state) => state?.auth?.userData || {}
  );
  const router = useRouter();

  const [applicationDetail, setApplicationDetail] = useState({});
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isApplicationActionModalOpen, setIsApplicationActionModalOpen] =
    useState(false);
  const [
    isApplicationActionDetailModalOpen,
    setIsApplicationActionDetailModalOpen,
  ] = useState(false);
  const [isRejectionReasonModalOpen, setIsRejectionReasonModalOpen] =
    useState(false);
  const [actionType, setActionType] = useState("");
  const [selectedRejectionReason, setSelectedRejectionReason] = useState("");
  const [historyData, setHistoryData] = useState({});

  const menuId = "primary-search-account-menu";

  const rejectionReasons = [
    "Underqualified: Not having the minimum skills, education, or experience required for the position.",
    "Overqualified: Having more experience than the role requires can make an employer question if the candidate will be engaged or if they will leave for a better opportunity.",
    "Insufficient experience: Not having enough experience to back up claims or perform the job effectively.",
    "Cannot meet applicant salary requirements",
    "Not eligible to work in U.S.",
    "Other",
  ];

  const fetchApplicationDetail = async () => {
    const response = await apiInstance.get(
      `${GET_APPLICATION_DETAIL}/${applicationId}`
    );
    if (response.status === 200 || 201) {
      setApplicationDetail(response.data.data.application);
    }
  };

  useEffect(() => {
    fetchApplicationDetail();
  }, [applicationId]);

  const timestamp = applicationDetail?.created_at;
  const dateObj = new Date(timestamp);

  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleCloseApplicationModal = () => {
    setIsApplicationModalOpen(false);
  };

  const hasOfferDeclined = applicationDetail?.histories?.some(
    (h) => h?.type === "offer_decline"
  );
  const menuItems = [
    {
      label: "Candidate Is Not A Match",
      icon: <AccountCircleIcon />,
      onClick: () => {
        setIsRejectionReasonModalOpen(true);
        handleMenuClose();
      },
    },
    {
      label: `Invite ${applicationDetail?.ucn} to Interview`,
      icon: <GroupsIcon />,
      onClick: () => {
        handleApplicationAction("Interview");
        handleMenuClose();
      },
    },
    {
      label: hasOfferDeclined ? "Counteroffer Letter" : "Offer Letter",
      icon: <EmailIcon />,
      onClick: () => {
        handleApplicationAction(hasOfferDeclined ? "CounterOfferLetter" : "OfferLetter");
        handleMenuClose();
      },
    },
  ];

  const pathName = usePathname();

  const handleApplicationAction = (aType) => {
    setActionType(aType);
    setIsApplicationActionModalOpen(true);
  };

  const handleCloseApplicationActionModal = () => {
    setIsApplicationActionModalOpen(false);
    setSelectedRejectionReason("");
  };

  const handleCloseRejectionReasonModal = () => {
    setIsRejectionReasonModalOpen(false);
  };

  const handleRejectWithReason = (reason) => {
    setActionType("Reject");
    setSelectedRejectionReason(reason ?? "");
    setIsRejectionReasonModalOpen(false);
    setIsApplicationActionModalOpen(true);
  };

  const handleApplicationActionDetail = (item) => {
    if (
      item?.type === "application_submitted" ||
      item?.type === "application_rejected"
    ) {
      return;
    }
    setHistoryData(item);
    setIsApplicationActionDetailModalOpen(true);
  };

  const handleCloseApplicationActionDetailModal = () => {
    setIsApplicationActionDetailModalOpen(false);
  };

  const onJobDetail = (id) => {
    var encodeId = encode(id);
    if (type === "employer") {
      router.push(`/employer/job/${encodeId}`);
    } else {
      router.push(`/applicant/job/${encodeId}`);
    }
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: "15px", sm: "20px", md: "26px" },
              lineHeight: "18px",
              fontWeight: 400,
            }}
          >
            UCN: {applicationDetail?.ucn ?? ""}
          </Typography>
          <Button
            variant="primary"
            sx={{
              fontSize: { xs: "8px", sm: "10px", md: "12px", lg: "14px" },
              lineHeight: { xs: "25px", sm: "20px", md: "17px" },
              fontWeight: 400,
              color: "white !important",
            }}
            disabled={true}
          >
            {applicationDetail?.status?.toUpperCase()}
          </Button>
          {pathName.includes("/employer") &&
            type === "employer" &&
            applicationDetail?.status !== "archive" && (
              <>
                <Box>
                  <IconButton
                    size="large"
                    edge="end"
                    aria-controls={menuId}
                    aria-haspopup="true"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <MoreVertRoundedIcon sx={{ cursor: "pointer" }} />
                  </IconButton>
                </Box>
                {renderMenu({
                  anchorEl,
                  isMenuOpen,
                  handleMenuClose,
                  menuId,
                  menuItems,
                })}
              </>
            )}
        </Box>
        <Typography
          sx={{
            fontSize: { xs: "15px", sm: "20px", md: "26px" },

            lineHeight: "18px",
            fontWeight: 700,
          }}
        >
          {applicationDetail?.job?.title ?? ""}
        </Typography>
        <Typography
          sx={{
            fontSize: "16px",
            lineHeight: "26px",
            fontWeight: 400,
            py: 2,
          }}
        >
          {applicationDetail?.job?.description ?? ""}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: { xs: 2, sm: 4 },
            }}
          >
            <Box sx={{ display: "flex", gap: { xs: 0.2, sm: 1 } }}>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: "13px", sm: "14px", md: "16px" },
                  lineHeight: { xs: "15px", md: "24px" },
                  color: "#00305B",
                }}
              >
                Date:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: "13px", sm: "14px", md: "16px" },
                  lineHeight: { xs: "15px", md: "24px" },
                  color: "#222222",
                }}
              >
                {date}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: { xs: 0.2, sm: 1 } }}>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: "13px", sm: "14px", md: "16px" },
                  lineHeight: { xs: "15px", md: "24px" },
                  color: "#00305B",
                }}
              >
                Time:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: { xs: "13px", sm: "14px", md: "16px" },
                  lineHeight: { xs: "15px", md: "24px" },
                  color: "#222222",
                }}
              >
                {time}
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 4,
            }}
          >
            {pathName.includes("/employer") && type === "employer" && (
              <Typography
                sx={{
                  fontSize: { xs: "12px", sm: "14px", md: "20px", lg: "24px" },
                  lineHeight: { xs: "25px", sm: "20px", md: "17px" },
                  fontWeight: 500,
                  textDecoration: "underline",
                  color: "#00305B",
                  cursor: "pointer",
                }}
                onClick={() => setIsApplicationModalOpen(true)}
              >
                View Application Details
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: { xs: "12px", sm: "14px", md: "20px", lg: "24px" },
                lineHeight: { xs: "25px", sm: "20px", md: "17px" },
                fontWeight: 500,
                textDecoration: "underline",
                color: "#189e33ff",
                cursor: "pointer",
              }}
              onClick={() => onJobDetail(applicationDetail?.job?.id)}
            >
              View Jobs Details
            </Typography>
          </Box>
        </Box>
        <Divider style={{ marginTop: "15px" }} />
      </Box>
      {applicationDetail?.histories?.map((item) => {
        const dateObj = new Date(item.created_at);
        const date = dateObj.toLocaleDateString();
        const time = dateObj.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return (
          <>
            <Box
              key={item?.id}
              sx={{
                backgroundColor: id === item?.user_id ? "#00305B" : "",
                border: "0.6px solid #0000004D",
                borderRadius: "10px",
                p: 2,
                my: 2,
                cursor: "pointer",
              }}
              disabled={item?.type === "application_submitted" ? true : false}
              onClick={() => handleApplicationActionDetail(item)}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: { xs: "15px", sm: "20px", md: "26px" },
                      lineHeight: { xs: "24px", sm: "28px", md: "24px" },
                      fontWeight: 700,
                      color: id === item?.user_id ? "#FFFFFF" : "#00305B",
                      py: 1,
                    }}
                  >
                    {item?.title ?? ""}
                  </Typography>
                </Box>

                <Button
                  sx={{
                    backgroundColor: "#189e33ff",
                    color: "#fff",
                    fontSize: { xs: "13px", sm: "14px", md: "16px" },
                    lineHeight: { xs: "15px", md: "24px" },
                    borderRadius: "44px",
                    height: "34px",
                    width: "148px",
                    fontWeight: 700,
                  }}
                  onClick={() => handleApplicationActionDetail(item)}
                >
                  REQ : {applicationDetail?.job?.requisition_number ?? ""}
                </Button>
              </Box>
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "13px", sm: "14px", md: "16px" },
                    lineHeight: { xs: "15px", md: "24px" },
                    fontWeight: 500,
                    color: id === item?.user_id ? "#FFFFFF" : "#111111",
                    py: 1,
                  }}
                >
                  {item?.description ?? ""}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2, sm: 4 },
                }}
              >
                <Box sx={{ display: "flex", gap: { xs: 0.2, sm: 1 } }}>
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: { xs: "13px", sm: "14px", md: "16px" },
                      lineHeight: { xs: "15px", md: "24px" },
                      color: id === item?.user_id ? "#FFFFFF" : "#00305B",
                    }}
                  >
                    Date:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: { xs: "13px", sm: "14px", md: "16px" },
                      lineHeight: { xs: "15px", md: "24px" },
                      color: id === item?.user_id ? "#FFFFFF" : "#222222",
                    }}
                  >
                    {date}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: { xs: 0.2, sm: 1 } }}>
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: { xs: "13px", sm: "14px", md: "16px" },
                      lineHeight: { xs: "15px", md: "24px" },
                      color: id === item?.user_id ? "#FFFFFF" : "#00305B",
                    }}
                  >
                    Time:
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: { xs: "13px", sm: "14px", md: "16px" },
                      lineHeight: { xs: "15px", md: "24px" },
                      color: id === item?.user_id ? "#FFFFFF" : "#222222",
                    }}
                  >
                    {time}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        );
      })}
      {pathName.includes("/employer") && type === "employer" && (
        <>
          <ApplicationActionModal
            ucn={applicationDetail?.ucn}
            open={isApplicationActionModalOpen}
            onClose={handleCloseApplicationActionModal}
            actionType={actionType}
            applicationId={applicationId}
            rejectionReason={selectedRejectionReason}
          />
          <ApplicationDetailModal
            open={isApplicationModalOpen}
            onClick={handleCloseApplicationModal}
            onClose={handleCloseApplicationModal}
            title="Application Details"
            data={applicationDetail}
            buttonLabel="Done"
          />
          <RejectionReasonModal
            open={isRejectionReasonModalOpen}
            onClose={handleCloseRejectionReasonModal}
            reasons={rejectionReasons}
            onReasonSelect={handleRejectWithReason}
          />
        </>
      )}
      <ApplicationActionDetailModal
        requisitionNumber={applicationDetail?.job?.requisition_number}
        userType={type}
        historyData={historyData}
        open={isApplicationActionDetailModalOpen}
        onClose={handleCloseApplicationActionDetailModal}
        applicationId={applicationId}
      />
    </>
  );
};

export default ApplicationDetail;