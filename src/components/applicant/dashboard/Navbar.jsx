"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import apiInstance from "@/services/apiService/apiServiceInstance";
import { LOGOUT } from "@/services/apiService/apiEndPoints";
import Link from "next/link";
import { echo } from "@/helper/webSockets";

import Cookie from "js-cookie";
import HomeIcon from "@mui/icons-material/Home";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDataLogout } from "@/redux/slices/authSlice";
import { Toast } from "@/components/Toast/Toast";
import { useEffect } from "react";
import { Avatar, Badge } from "@mui/material";
import { setType } from "@/redux/slices/NotificationSlice";
import { object } from "yup";

const iconStyle = { color: "#189e33ff", fontSize: "16px" };

const profileMenuItems = [
  { heading: "Home", icon: <HomeIcon /> },
  {
    name: "Profile",
    link: "/applicant/profile",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Dashboard",
    link: "/applicant/dashboard",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Settings",
    link: "/applicant/settings",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  { divider: true },
  { heading: "Help Center", icon: <HelpCenterIcon /> },
  {
    name: "FAQ's",
    link: "/applicant/faqs",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Feedback",
    link: "/feedback",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Interview Tips",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Privacy Policy",
    link: "/privacy-and-policy",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Terms & Conditions",
    link: "/terms-and-conditions",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Contact Us: Contact@Rallitechnologies.online",
    link: "mailto:Contact@Rallitechnologies.online",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  { divider: true },
  {
    heading: "HR Insights",
    icon: <GroupsIcon />,
  },
  {
    name: "Microaggressions",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Personality Traits",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  { name: "Blog", link: "/blog", icon: <PanoramaFishEyeIcon sx={iconStyle} /> },
  { divider: true },
  { heading: "Toolkits", icon: <SettingsIcon /> },
  {
    name: "Effective Communication",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "How to prepare and ask for a promotion or raise",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Handling Work Stress",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Work Life Balance",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "How to: Shortcuts & Tips",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Career Transition - When is it time for a new job?",
    link: "/applicant/upcoming",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
  {
    name: "Sign Out",
    link: "/applicant/login",
    icon: <PanoramaFishEyeIcon sx={iconStyle} />,
  },
];

function Navbar({ data }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElProfile, setAnchorElProfile] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isProfilePic, setIsProfilePic] = React.useState(null);
  const { userData } = useSelector((state) => state.auth);
  const type = useSelector((state) => state?.notificationTye);

  const showChatDot = type?.isChat;
  const showNotificationDot = type?.isNotification;

  useEffect(() => {
    setIsProfilePic(userData?.user?.photo);
  }, [userData]);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenProfileMenu = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfileMenu = () => {
    setAnchorElProfile(null);
  };
  const handleSignOut = async () => {
    try {
      const token = Cookie.get("token");

      if (!token) {
        throw new Error("No authentication token found.");
      }
      const response = await apiInstance.post(
        LOGOUT,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.status === "success") {
        Cookie.remove("token");
        Cookie.remove("isVerified");
        Cookie.remove("userType");
        Cookie.remove("is_completed");
        dispatch(clearUserDataLogout());
        router.push("/");
        Toast("success", response?.data?.message);
      } else {
        throw new Error(response?.data?.message || "Logout failed.");
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
      Toast("error", error?.response?.data?.message || "Failed to logout");
    } finally {
      setAnchorElProfile(null);
    }
  };

  const handleMenuItemClick = (link) => {
    router.push(link);
    handleCloseProfileMenu();
  };
  useEffect(() => {
    const channel = echo.channel(`ralli.notify.${userData?.user?.id}`);
    channel.listen("NotifyUser", (event) => {
      dispatch(setType(event));
    });
    return () => {
      echo.leaveChannel(`ralli.notify.${userData?.user?.id}`);
    };
  }, []);

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#e8faf0ff",
        boxShadow: "none",
        borderBottom: "0.4px solid #0000004D",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              mr: 1,
              borderRadius: "50%",
              overflow: "hidden", // ensures the image respects round shape
              width: 50,
              height: 50,
            }}
          >
            <Image
              src={data?.logo}
              width={50}
              height={50}
              priority
              alt="nav img"
              style={{
                borderRadius: "50%", // makes it round
                objectFit: "cover", // prevents stretching
              }}
            />
          </Box>

          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              textDecoration: "none",
            }}
          ></Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {data?.items?.map((page, index) => (
                <Link href={page.path} prefetch={true} key={index}>
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    sx={{ display: "block", my: 2 }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Image
                        src={page?.navImg}
                        width={25}
                        height={25}
                        priority
                        alt="nav img"
                        sx={{ border: "2px solid red" }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "16px",
                        fontWeight: 400,
                        lineHeight: "18px",
                        color: "#222222",
                        textAlign: "center",
                      }}
                    >
                      {page.navTitle}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }} />
          <Box
            sx={{
              mr: 2,
              display: { xs: "none", sm: "flex", md: "none" },
              flexGrow: 1,
            }}
          >
            <Image
              src={data?.logo}
              width={50}
              height={50}
              priority
              alt="nav img"
              style={{
                borderRadius: "50%", // makes it round
                objectFit: "cover", // prevents stretching
              }}
            />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {data?.items.map((page, index) => {
              const isActive = pathname === page.path;

              return (
                <Link href={page.path} prefetch={true} key={index}>
                  <Box
                    sx={{
                      textAlign: "center",
                      my: "5px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{
                        backgroundColor: "transparent",
                        my: "2px",
                        px: { lg: "25px" },
                        display: "block",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      <Image
                        src={page?.navImg}
                        width={20}
                        height={20}
                        priority
                        alt="nav img"
                      />
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 400,
                          lineHeight: "18px",
                          color: "#222222",
                        }}
                      >
                        {page.navTitle}
                      </Typography>
                    </Button>
                    {isActive && (
                      <Box
                        sx={{
                          width: "60px",
                          height: "2px",
                          backgroundColor: "#189e33ff",
                        }}
                      />
                    )}
                  </Box>
                </Link>
              );
            })}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", sm: "flex" },
                justifyContent: "center",
              }}
            >
              {data?.profile?.map((page, index) => (
                <Box key={index} sx={{ my: 0.5, px: { xs: "5px" } }}>
                  <Box
                    sx={{
                      backgroundColor:
                        index === 0 || index === 1 ? "#FFF" : "transparent",
                      width: "52.36px",
                      height: "52.36px",
                      boxShadow: "1px 0px 5px 1px #00000040",
                      borderRadius: "50%",
                      my: 0.7,
                      px: { sm: "5px" },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      alignContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <Button
                      disableRipple
                      sx={{
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                      onClick={(event) => {
                        if (page?.path) {
                          router.push(page.path, undefined, { shallow: true });
                        } else {
                          handleOpenProfileMenu(event);
                        }
                      }}
                    >
                      {index === 0 ? (
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={!showChatDot}
                        >
                          <MailIcon sx={{ fontSize: 25, color: "#000" }} />
                        </Badge>
                      ) : index === 1 ? (
                        <Badge
                          color="error"
                          variant="dot"
                          invisible={!showNotificationDot}
                        >
                          <NotificationsIcon
                            sx={{ fontSize: 25, color: "#000" }}
                          />
                        </Badge>
                      ) : (
                        <Avatar
                          src={isProfilePic ? isProfilePic : page?.navImg}
                          sx={{ width: 60.36, height: 60.36 }}
                          alt="Profile"
                        />
                      )}
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
            <Menu
              id="menu-profile"
              sx={{ mt: "60px" }}
              anchorEl={anchorElProfile}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElProfile)}
              onClose={handleCloseProfileMenu}
            >
              {profileMenuItems.map((item, index) => {
                if (item.heading) {
                  return (
                    <Box
                      key={index}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        px: "16px",
                        py: "8px",
                        fontWeight: 700,
                        color: "#000",
                      }}
                    >
                      {item.icon}
                      <Typography
                        sx={{
                          ml: 1,
                          fontWeight: 700,
                          color: "#00305B",
                          fontSize: {
                            xs: "14px",
                            sm: "14px",
                            md: "16px",
                            lg: "18px",
                          },
                          lineHeight: { xs: "20px", md: "25px" },
                        }}
                      >
                        {item.heading}
                      </Typography>
                    </Box>
                  );
                } else if (item.divider) {
                  return (
                    <hr
                      key={index}
                      style={{ width: "100%", margin: "8px 0" }}
                    />
                  );
                } else {
                  return (
                    <MenuItem
                      key={index}
                      onClick={
                        item.name === "Sign Out"
                          ? handleSignOut
                          : () => handleMenuItemClick(item.link)
                      }
                      sx={{
                        minWidth: { md: "400px" },
                        px: "45px",
                        height: "30px",
                      }}
                    >
                      {item.icon}
                      <Typography
                        sx={{
                          fontSize: {
                            xs: "14px",
                            sm: "12px",
                            md: "14px",
                            lg: "16px",
                          },
                          lineHeight: { xs: "12px", md: "25px" },
                          color: "#111111",
                          textAlign: "center",
                          ml: 0.5,
                        }}
                      >
                        {item.name}
                      </Typography>
                    </MenuItem>
                  );
                }
              })}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
