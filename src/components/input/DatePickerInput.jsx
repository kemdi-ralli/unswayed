import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function DatePickerInput({
  label = "",
  value = null,
  onChange = () => { },
  styles = {},
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          value={value}
          onChange={onChange}
          minDate={dayjs()}
          slotProps={{
            textField: {
              placeholder: "Select application deadline",
              sx: {
                width: "100%",
                borderRadius: "10px",
                "& input": {
                  color: "rgba(0, 0, 0, 0.3)",
                  padding: "13px 10px",
                  width: "100%",
                  border: "none",
                  outline: "none",

                },
                "& fieldset": {
                  outline: "none",
                  borderColor: " #00000040  !important",
                  boxShadow: "0px 0px 3px 0px #00000040 !important",

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
      </DemoContainer>
    </LocalizationProvider>
  );
}
