import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, Typography, Checkbox, ListItemText } from "@mui/material";

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      width: 250,
      fontSize: 13,
    },
  },
};

export default function RalliDropdown({
  names,
  label,
  selectedValue,
  multiple = false,
  onChange,
  required,
}) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    onChange(
      // If multiple, ensure it's an array (for autofill case)
      multiple ? (typeof value === "string" ? value.split(",") : value) : value
    );
  };

  return (
    <FormControl
      sx={{
        width: "100%",
        mb: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          alignItems: "center",
          py: 1,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>
          {label}
          {required && <span style={{ color: "red" }}>*</span>}
        </Typography>
      </Box>

      <Select
        sx={{
          ".MuiOutlinedInput-notchedOutline": { border: "none" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          fontSize: "16px",
          color: "#222222",
          boxShadow: "0px 0px 3px 1px #00000040",
          borderRadius: "5px",
          fontSize: "13px",
          fontWeight: 300,
          color: "#222222",
          py: 1,
          height: "54px",
          pt: "-66px !important",
        }}
        displayEmpty
        multiple={multiple}
        value={selectedValue}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (!selected || (multiple && selected.length === 0)) {
            return (
              <em style={{ color: "rgba(0, 0, 0, 0.59)" }}>Select item</em>
            );
          }

          if (multiple) {
            const selectedItems = names
              ?.filter((item) => selected.includes(item.id))
              ?.map((item) => item.name);
            return selectedItems.join(", ");
          }

          const selectedItem = names.find((item) => item.id === selected);
          return selectedItem ? selectedItem.name : selected;
        }}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
      >
        <MenuItem disabled value="" sx={{ color: "#222222", fontSize: "13px" }}>
          <em>Select Item</em>
        </MenuItem>

        {names?.map((item) => (
          <MenuItem key={item.id} value={item.id} sx={{ fontSize: "13px" }}>
            {multiple ? (
              <>
                <Checkbox
                  checked={selectedValue?.includes(item.id)}
                  size="small"
                  sx={{ mr: 1, p: 0.5 }}
                />
                <ListItemText primary={item.name} />
              </>
            ) : (
              item.name
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
