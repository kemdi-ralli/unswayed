
import React from "react";
import { Menu, MenuItem, Typography } from "@mui/material";

const renderMenu = ({ anchorEl, isMenuOpen, handleMenuClose, menuId, menuItems }) => (
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
    {menuItems.map((item, index) => (
      <MenuItem key={index} onClick={item.onClick || handleMenuClose}>
        {item.icon && React.cloneElement(item.icon, { sx: { color: "#111111" } })}
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 400,
            lineHeight: "18px",
            color: "#111111",
            px: "10px",
          }}
        >
          {item.label}
        </Typography>
      </MenuItem>
    ))}
  </Menu>
);

export default renderMenu;
