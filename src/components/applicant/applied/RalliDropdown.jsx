import React, { useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, Typography, Checkbox, ListItemText, Button } from "@mui/material";

const ITEM_HEIGHT = 60;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
      width: 250,
      fontSize: 13,
      display: "flex",
      flexDirection: "column",
    },
  },
};

export default function RalliDropdown({
  names,
  label,
  selectedValue,
  multiple = false,
  onChange,
  onAdd, // new callback for Add button
  required,
}) {
  const [open, setOpen] = useState(false); // control dropdown open/close

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    onChange(
      multiple ? (typeof value === "string" ? value.split(",") : value) : value
    );
  };

  const handleAdd = () => {
    if (onAdd) onAdd(selectedValue);
    setOpen(false); // close dropdown after add
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
      <Box sx={{ alignItems: "center", py: 1 }}>
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
          fontSize: "13px",
          fontWeight: 300,
          color: "#222222",
          boxShadow: "0px 0px 3px 1px #00000040",
          borderRadius: "5px",
          py: 1,
          height: "54px",
        }}
        displayEmpty
        multiple={multiple}
        value={selectedValue}
        onChange={handleChange}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
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
        <MenuItem disabled value="" sx={{ fontSize: "13px" }}>
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

        {/* Sticky Add Button for multiple selection */}
        {multiple && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              backgroundColor: "white",
              borderTop: "1px solid #eee",
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
            }}
          >
            <Button
              size="small"
              variant="contained"
              sx={{ fontSize: "12px", borderRadius: "6px", px: 2 }}
              onClick={handleAdd}
            >
              Add
            </Button>
          </Box>
        )}
      </Select>
    </FormControl>
  );
}
