import React from "react";
import {
  Box,
  Button,
  Typography,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";

const Application = ({
  item = {},
  onDetailClick = () => { },
  anchorEl,
  setAnchorEl,
  handleMenuClose,
  handleArchived,
  setId,
  id
}) => {
  const date = item?.created_at ? new Date(item.created_at) : null;
  const formattedDate = date ? date.toLocaleString() : "Invalid Date";
  const isMenuOpen = Boolean(anchorEl);
  const handleMenuOpen = (event, id) => {
    setId(id);
    setAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const isArchived = item?.is_archived;

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => handleArchived(id, isArchived)}>
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            color: "#111111",
            px: "10px",
          }}
        >
          {isArchived ? "Unarchive" : "Archive"}
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box
        sx={{
          border: "0.6px solid #0000004D",
          borderRadius: "10px",
          p: 2,
          my: 2,
          cursor: "pointer",
          "&:hover": {
            border: "2px solid #FE4D82",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography
              sx={{
                fontSize: "16px",
                lineHeight: "18px",
                fontWeight: 600,
                color: "#222222",
              }}
            >
              {item?.ucn}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "16px", sm: "18px", md: "20px", lg: "26px" },
                lineHeight: { xs: "20px", md: "18px" },
                fontWeight: 700,
                color: "#00305B",
                py: 1,
              }}
            >
              {item.job_title}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0, md: 1 } }}>
            <Typography
              sx={{
                borderRadius: "5px",
                backgroundColor: isArchived ? "#FFD700" : "#E3F6E6",
                fontSize: "12px",
                p: "10px",
                color: "#111111",
              }}
            >
              {item?.status.toUpperCase()}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="options"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={(event) => handleMenuOpen(event, item?.id)}
              color="inherit"
            >
              <MoreVertRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ minHeight: "80px", overflowY: "scroll", scrollbarWidth: "none" }}>
          <Typography
            sx={{
              fontSize: "16px",
              fontWeight: 400,
              color: "#111111",
              py: 1,
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              overflowY: "auto",
              "&::-webkit-scrollbar": {
                width: "1px",
              },
              WebkitLineClamp: 3,
            }}
          >
            {item.job_description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 4,
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#00305B",
                }}
              >
                Date:
              </Typography>
              <Typography
                sx={{
                  fontWeight: 300,
                  fontSize: "16px",
                  lineHeight: "24px",
                  color: "#222222",
                }}
              >
                {formattedDate}
              </Typography>
            </Box>
          </Box>
          <Button
            sx={{
              backgroundColor: "#FE4D82",
              color: "#fff",
              fontSize: { xs: "8px", sm: "10px", md: "12px" },
              lineHeight: "24px",
              borderRadius: "5px",
              height: "34px",
              width: "auto",
              fontWeight: 700,
            }}
            onClick={() => onDetailClick(item?.id)}
          >
            Further Details
          </Button>
        </Box>
        {renderMenu}
      </Box>
    </>
  );
};

export default Application;

