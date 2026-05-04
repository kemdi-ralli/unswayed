"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Chip, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { DEACTIVATE_ACCOUNT, LOGOUT } from "@/services/apiService/apiEndPoints";
import { Toast } from "@/components/Toast/Toast";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDataLogout } from "@/redux/slices/authSlice";
import ConfirmModal from "@/components/Modal/ConfirmModal";
import { setSuccessMessage } from "@/redux/slices/deactivateMessageSlice";

// Subscription cancel endpoint
const CANCEL_SUBSCRIPTION = "/subscriptions/cancel";
const GET_SUBSCRIPTION = "/subscriptions/current";

const ProfileSettings = ({ data, profile }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCancelSubModalOpen, setIsCancelSubModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  const { userData } = useSelector((state) => state.auth);

  // Fetch subscription info on mount
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await apiInstance.get(GET_SUBSCRIPTION);
        if (response?.data?.status === "success") {
          setSubscriptionInfo(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
        // Fallback to profile data
        setSubscriptionInfo({
          plan: profile?.subscription_plan || "Freemium",
          is_subscribed: profile?.is_subscribed || false,
          is_on_trial: profile?.subscription_plan === "30-Day Trial",
          days_remaining: 0,
          has_active_subscription: profile?.is_subscribed || false,
        });
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, [profile]);

  // Get subscription color based on plan
  const getSubscriptionColor = (plan) => {
    if (plan === "Freemium") return { bg: "#f3f4f6", text: "#6b7280" };
    if (plan === "30-Day Trial") return { bg: "#fef3c7", text: "#d97706" };
    if (plan === "Pro Plan" || plan?.includes("Pro")) return { bg: "#dbeafe", text: "#2563eb" };
    if (plan?.includes("Tier")) return { bg: "#dcfce7", text: "#16a34a" };
    if (plan === "Expired") return { bg: "#fee2e2", text: "#dc2626" };
    return { bg: "#f3f4f6", text: "#374151" };
  };

  const subColors = subscriptionInfo ? getSubscriptionColor(subscriptionInfo.plan) : { bg: "#f3f4f6", text: "#374151" };

  // Check if subscription can be cancelled
  const canCancelSubscription = () => {
    if (!subscriptionInfo) return false;
    // Can cancel if has active paid subscription (not freemium, not trial, not expired)
    return (
      subscriptionInfo.is_subscribed &&
      subscriptionInfo.plan !== "Freemium" &&
      subscriptionInfo.plan !== "30-Day Trial" &&
      subscriptionInfo.plan !== "Expired"
    );
  };

  const handleButtonClick = async (item) => {
    if (item.name === "signout") {
      try {
        const token = Cookie.get("token");
        if (!token) throw new Error("No authentication token found.");

        const response = await apiInstance.post(
          LOGOUT,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response?.data?.status === "success") {
          Cookie.remove("token");
          Cookie.remove("isVerified");
          Cookie.remove("userType");
          dispatch(clearUserDataLogout());
          router.push("/");
          Toast("success", response?.data?.message);
        } else {
          throw new Error(response?.data?.message || "Logout failed.");
        }
      } catch (error) {
        Toast("error", error?.response?.data?.message || "Failed to logout");
      }
    } else if (item.name === "deactivate") {
      setIsConfirmModalOpen(true);
    } else if (item.name === "subscription") {
      // Handle subscription button click
      if (canCancelSubscription()) {
        setIsCancelSubModalOpen(true);
      } else {
        // Redirect to pricing page
        router.push("/billing");
      }
    } else {
      router.push(item?.link);
    }
  };

  const handleDeactivateConfirm = async () => {
    try {
      const token = Cookie.get("token");
      if (!token) {
        Toast("error", "No authentication token found.");
        return;
      }

      const response = await apiInstance.post(
        DEACTIVATE_ACCOUNT,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.status === "success") {
        Cookie.remove("token");
        Cookie.remove("isVerified");
        Cookie.remove("userType");

        dispatch(
          setSuccessMessage({
            message: response?.data?.message,
            showMessage: true,
          })
        );

        router.push("/");
      } else {
        throw new Error(response?.data?.message || "Deactivation failed.");
      }
    } catch (error) {
      Toast("error", error?.response?.data?.message || "Failed to deactivate account.");
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const response = await apiInstance.post(CANCEL_SUBSCRIPTION, {
        immediately: false, // Cancel at end of billing period
        reason: "User requested cancellation from settings",
      });

      if (response?.data?.status === "success") {
        Toast("success", response?.data?.message || "Subscription will be cancelled at the end of your billing period.");
        setIsCancelSubModalOpen(false);
        
        // Update local subscription info
        setSubscriptionInfo((prev) => ({
          ...prev,
          is_subscribed: false,
          plan: userData?.user?.type === "employer" ? "Expired" : "Freemium",
        }));
      } else {
        throw new Error(response?.data?.message || "Failed to cancel subscription.");
      }
    } catch (error) {
      console.error("Cancel subscription error:", error);
      Toast("error", error?.response?.data?.message || "Failed to cancel subscription. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsConfirmModalOpen(false);
  };

  const handleCancelSubClose = () => {
    setIsCancelSubModalOpen(false);
  };

  const filteredData = data.filter(
    (item) =>
      !profile ||
      profile?.provider === "manual" ||
      !["email", "password"].includes(item.name)
  );

  // Build subscription item dynamically
  const subscriptionItem = {
    name: "subscription",
    title: "Subscription Plan",
    placeHolder: loadingSubscription ? "Loading..." : subscriptionInfo?.plan || "Freemium",
    buttonLable: canCancelSubscription() ? "Cancel Subscription" : "Manage Plan",
  };

  // Combine regular items with subscription item
  const allItems = [...filteredData, subscriptionItem];

  return (
    <Box>
      {allItems.map((item) => {
        const isSubscriptionItem = item.name === "subscription";

        return (
          <Box
            key={item.name}
            sx={{
              width: "100%",
              boxShadow: "0px 0px 3px #00000040",
              border: "none",
              outline: "none",
              padding: "18px 20px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 300,
              lineHeight: "18px",
              color: "#222222",
              my: 2,
              // Special styling for subscription item
              ...(isSubscriptionItem && {
                background: `linear-gradient(135deg, ${subColors.bg}40 0%, #ffffff 100%)`,
                borderLeft: `4px solid ${subColors.text}`,
              }),
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                "@media (max-width: 520px)": {
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 2,
                },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: "14px", sm: "17px", md: "20px" },
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "#00305B",
                    textAlign: { xs: "center", sm: "start" },
                  }}
                >
                  {item?.title}
                </Typography>
                
                {/* Subscription item with chip */}
                {isSubscriptionItem ? (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 1,
                      flexWrap: "wrap",
                      justifyContent: { xs: "center", sm: "flex-start" },
                    }}
                  >
                    {loadingSubscription ? (
                      <CircularProgress size={16} />
                    ) : (
                      <>
                        <Chip
                          label={subscriptionInfo?.plan || "Freemium"}
                          size="small"
                          sx={{
                            backgroundColor: subColors.bg,
                            color: subColors.text,
                            fontWeight: 600,
                            fontSize: "12px",
                          }}
                        />
                        {subscriptionInfo?.is_on_trial && subscriptionInfo?.days_remaining > 0 && (
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: subscriptionInfo.days_remaining <= 7 ? "#dc2626" : "#d97706",
                              fontWeight: 500,
                            }}
                          >
                            ({subscriptionInfo.days_remaining} days left)
                          </Typography>
                        )}
                        {subscriptionInfo?.subscription_ends_at && !subscriptionInfo?.is_on_trial && (
                          <Typography
                            sx={{
                              fontSize: "11px",
                              color: "#6b7280",
                            }}
                          >
                            Renews: {new Date(subscriptionInfo.subscription_ends_at).toLocaleDateString()}
                          </Typography>
                        )}
                      </>
                    )}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                      fontWeight: 400,
                      lineHeight: "18px",
                      color: "#222222",
                      pb: { xs: "10px", md: "5px" },
                      pt: { xs: "0px", md: "5px" },
                      textAlign: { xs: "center", sm: "start" },
                    }}
                  >
                    {(() => {
                      if (!profile) return item?.placeHolder || "";
                      if (item?.name === "email" && profile?.email)
                        return profile.email;
                      if (item?.name === "signout" && profile?.email)
                        return profile.email;
                      if (item?.name === "phone" && profile?.phone)
                        return profile.phone;
                      if (item?.name === "profile")
                        return [
                          profile?.first_name,
                          profile?.middle_name,
                          profile?.last_name,
                        ]
                          .filter(Boolean)
                          .join(" ");
                      return item?.placeHolder || "";
                    })()}
                  </Typography>
                )}
              </Box>
              
              <Button
                sx={{
                  minWidth: { xs: "100%", sm: "222px" },
                  height: "46px",
                  borderRadius: "6px",
                  border: isSubscriptionItem && canCancelSubscription() 
                    ? "1px solid #dc2626" 
                    : "1px solid #00305B",
                  fontSize: { xs: "9px", sm: "12px", md: "14px" },
                  fontWeight: 700,
                  lineHeight: "21px",
                  color: isSubscriptionItem && canCancelSubscription() 
                    ? "#dc2626" 
                    : "#00305B",
                  backgroundColor: isSubscriptionItem && !canCancelSubscription()
                    ? "#189e33ff"
                    : "transparent",
                  ...(isSubscriptionItem && !canCancelSubscription() && {
                    color: "#fff",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "#147c2cff",
                    },
                  }),
                  ...(isSubscriptionItem && canCancelSubscription() && {
                    "&:hover": {
                      backgroundColor: "#fee2e2",
                    },
                  }),
                }}
                onClick={() => handleButtonClick(item)}
              >
                {item?.buttonLable}
              </Button>
            </Box>
          </Box>
        );
      })}

      {/* Deactivate Account Modal */}
      <ConfirmModal
        open={isConfirmModalOpen}
        title="Are You Sure?"
        onClose={handleDeleteCancel}
        onConfirm={handleDeactivateConfirm}
        onCancle={handleDeleteCancel}
      />

      {/* Cancel Subscription Modal */}
      <ConfirmModal
        open={isCancelSubModalOpen}
        title="Cancel Subscription?"
        subtitle={
          <Box sx={{ textAlign: "center", mt: 1 }}>
            <Typography sx={{ color: "#6b7280", fontSize: "14px", mb: 1 }}>
              Your subscription will remain active until the end of your current billing period.
            </Typography>
            <Typography sx={{ color: "#dc2626", fontSize: "13px", fontWeight: 500 }}>
              After cancellation, you'll lose access to premium features.
            </Typography>
          </Box>
        }
        confirmText={isCancelling ? "Cancelling..." : "Yes, Cancel Subscription"}
        cancelText="Keep Subscription"
        onClose={handleCancelSubClose}
        onConfirm={handleCancelSubscription}
        onCancle={handleCancelSubClose}
        confirmButtonColor="#dc2626"
        disabled={isCancelling}
      />
    </Box>
  );
};

export default ProfileSettings;