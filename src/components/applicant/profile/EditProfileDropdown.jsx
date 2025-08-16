import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Box, Typography } from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditProfileDropdown = ({
  names,
  label,
  selectedValue,
  multiple = false,
  onChange,
}) => {
  const handleChange = (event) => {
    onChange(event.target.value);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "16px",
            fontWeight: 500,
            lineHeight: "18px",
            color: "#222222",
            mb: "10px",
          }}
        >
          {label && label}
        </Typography>
      </Box>
      <FormControl
        sx={{
          width: "100%",
          boxShadow: "0px 0px 3px 1px #00000040",
          border: "none",
          padding: "3px 5px",
          borderRadius: "10px",
          fontSize: "16px",
          fontWeight: 300,
          lineHeight: "18px",
          color: "#222222",
          mb: 1,
        }}
      >
        <Select
          sx={{
            textDecoration: "none",
            border: "none",
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            fontSize: "16px",
            color: "#222222",
            height: '54px',
            pt: "-66px !important"
          }}
          displayEmpty
          multiple={multiple}
          value={selectedValue}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (!selected || (multiple && selected.length === 0)) {
              return <em>Select item</em>;
            }
            if (multiple) {
              const selectedItems = names
                ?.filter((item) => selected?.includes(item.id))
                ?.map((item) => item.name);
              return selectedItems.join(", ");
            }
            const selectedItem = names?.find((item) => item?.id === selected);
            return selectedItem ? selectedItem.name : selected;
          }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem disabled value="" sx={{ color: "#222222" }}>
            <em>Select Item</em>
          </MenuItem>
          {names?.map((item) => (
            <MenuItem key={item.id} value={item.id} sx={{ color: "#222222" }}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};
export default EditProfileDropdown;
