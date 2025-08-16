import React from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  MenuItem,
  Select,
  Button,
  Avatar,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import AssistantIcon from "@mui/icons-material/Assistant";

const FormField = ({
  item,
  form,
  index,
  handleChange,
  handleEnhanceAi,
  countries,
  states,
  cities,
  checkedLabel,
  totalExperience
}) => {
  if (item.name === "is_continue") {
    return (
      <>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 600,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: "10px",
            mt: "14px",
            textTransform: "capitalize",
          }}
        >
          {item?.title}
        </Typography>
        <Box
          sx={{
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0px 0px 3px 0.4px #00000040",
            border: "none",
            mb: "20px",
            padding: "6px 20px",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={form.is_continue || false}
                onChange={(e) =>
                  handleChange(index, "is_continue", e.target.checked)
                }
                sx={{
                  color: "#FE4D82",
                }}
              />
            }
            label={checkedLabel}
            sx={{
              "& .MuiTypography-root": {
                fontSize: { xs: "12px", sm: "15px", md: "16px" },
                fontWeight: 300,
                lineHeight: { xs: "12px", sm: "20px" },
                color: "#222222",
              },
            }}
          />
        </Box>
      </>
    );
  }

  if (item.name === "start_date" || item.name === "end_date") {
    return (
      <Box sx={{ py: 0.5, my: 0.5 }}>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 600,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: "10px",
            textTransform: "capitalize",
          }}
        >
          {item?.title}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            views={["month", "year"]}
            format="MM/YYYY"
            value={form[item?.name] ? dayjs(form[item.name], "MM/YYYY") : null}
            onChange={(newValue) =>
              handleChange(
                index,
                item.name,
                newValue ? dayjs(newValue).format("MM/YYYY") : null
              )
            }
            slotProps={{
              textField: {
                sx: {
                  width: "100%",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 3px 0.4px #00000040",
                  border: "none",
                  "& input": {
                    color: "#000",
                    padding: "13px 10px",
                    width: "100%",
                    border: "none",
                    outline: "none ",
                    fontSize: { xs: "12px", sm: "15px", md: "16px" },
                    fontWeight: 300,
                    lineHeight: { xs: "12px", sm: "20px" },
                    outline: "none",
                    border: "none",
                  },

                  "& input::placeholder": {
                    color: "#00000040",
                    fontSize: "16px",
                    opacity: 1,
                  },
                  "& fieldset": {
                    border: "none !important",
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
            }}
          />
        </LocalizationProvider>
      </Box>
    );
  }

  if (item?.name === "description") {
    return (
      <Box key={item.name} sx={{ position: "relative", py: 0.5, my: 0.5 }}>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 600,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: "10px",
            textTransform: "capitalize",
          }}
        >
          {item?.title}
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder={item?.placeHolder}
          value={form[item.name] || ""}
          onChange={(e) => handleChange(index, item.name, e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={() => handleEnhanceAi(index, form[item.name])}
                  sx={{
                    position: "absolute",
                    bottom: 4,
                    right: 0,
                    color: "#00305B",
                  }}
                  startIcon={
                    <Avatar
                      sx={{
                        width: { xs: 20, lg: 30 },
                        height: { xs: 20, lg: 30 },
                        color: "#00305B !important",
                      }}
                      alt="Profile Picture"
                      src={"/assets/images/AI.png"}
                    />
                  }
                >
                  Enhance With AI
                </Button>
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            borderRadius: "10px",
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "12px", sm: "20px" },
            boxShadow: "0px 0px 3px 0.4px #00000040",
            color: "#222222",
            "& .css-w4nesw-MuiInputBase-input-MuiOutlinedInput-input": {
              border: "none !important",
              outline: "none",
              color: "#222222",
              fontSize: { xs: "12px", sm: "15px", md: "16px" },
              fontWeight: 300,
              lineHeight: { xs: "12px", sm: "20px" },
            },
            "& input": {
              color: "#000",
              padding: "13px 10px",
              width: "100%",
              border: "none",
              outline: "none ",
              fontSize: { xs: "12px", sm: "15px", md: "16px" },
              fontWeight: 300,
              lineHeight: { xs: "12px", sm: "20px" },
            },
            "&:hover": {
              outline: "none",
              border: "none",
            },
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(0, 0, 0, 0.3)",
              opacity: 1,
              fontSize: "14px",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                border: "none",
              },
            },
          }}
          inputProps={{
            sx: {
              "&::placeholder": {
                fontSize: { xs: "12px", sm: "15px", md: "16px" },
                fontWeight: 300,
                lineHeight: { xs: "12px", sm: "20px" },
              },
            },
          }}
        />
      </Box>
    );
  }

  // if (item?.name === "state" || item?.name === "city" || item?.name === "country") {
  //     return (
  //         <Box
  //             key={item.name}
  //             sx={{ position: "relative", py: 0.5, my: 0.5 }}
  //         >
  //             <Typography
  //                 sx={{
  //                     fontSize: { xs: "12px", sm: "15px", md: "16px" },
  //                     fontWeight: 600,
  //                     lineHeight: { xs: "12px", sm: "20px" },
  //                     color: "#222222",
  //                     mb: "10px",
  //                     textTransform: "capitalize",
  //                 }}
  //             >
  //                 {item?.title}
  //             </Typography>
  //             <Select
  //                 value={form[item.name] || ""}
  //                 onChange={(e) => {
  //                     handleChange(index, item.name, e.target.value, e);
  //                 }}
  //                 displayEmpty
  //                 fullWidth
  //                 sx={{
  //                     ".MuiOutlinedInput-notchedOutline": { border: "none" },
  //                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //                         border: "none",
  //                     },
  //                     boxShadow: "0px 0px 3px 0.4px #00000040",
  //                     width: "100%",
  //                     borderRadius: "10px",
  //                     fontSize: { xs: "12px", sm: "15px", md: "16px" },
  //                     fontWeight: 400,
  //                     lineHeight: { xs: "12px", sm: "20px" },
  //                     fontWeight: 400,
  //                     color: "#222222",
  //                     backgroundColor: "#FFFFFF",
  //                     height: '54px',
  //                     pt: "-66px !important"
  //                 }}
  //             >
  //                 <MenuItem value="">
  //                     <em style={{
  //                         color: "rgba(0, 0, 0, 0.31)",
  //                     }}>Select {item.label}</em>
  //                 </MenuItem>
  //                 {(item.name === "state"
  //                     ? states
  //                     : item.name === "city"
  //                         ? cities
  //                         : ""
  //                 )?.map((option) => (
  //                     <MenuItem key={option.id} value={option.name}>
  //                         {option.name}
  //                     </MenuItem>
  //                 ))}
  //             </Select>
  //         </Box>
  //     );
  // }
if (["country", "state", "city"].includes(item?.name)) {
  return (
    <Box key={item.name} sx={{ position: "relative", py: 0.5, my: 0.5 }}>
      <Typography
        sx={{
          fontSize: { xs: "12px", sm: "15px", md: "16px" },
          fontWeight: 600,
          lineHeight: { xs: "12px", sm: "20px" },
          color: "#222222",
          mb: "10px",
          textTransform: "capitalize",
        }}
      >
        {item?.title}
      </Typography>

      <Select
        value={form[item.name] || ""}
        onChange={(e) => {
          handleChange(index, item.name, e.target.value, e);
        }}
        displayEmpty
        fullWidth
        sx={{
          ".MuiOutlinedInput-notchedOutline": { border: "none" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          boxShadow: "0px 0px 3px 0.4px #00000040",
          width: "100%",
          borderRadius: "10px",
          fontSize: { xs: "12px", sm: "15px", md: "16px" },
          fontWeight: 400,
          lineHeight: { xs: "12px", sm: "20px" },
          color: "#222222",
          backgroundColor: "#FFFFFF",
          height: "54px",
          pt: "-66px !important",
        }}
      >
        <MenuItem value="">
          <em style={{ color: "rgba(0, 0, 0, 0.31)" }}>
            Select {item.label}
          </em>
        </MenuItem>

        {(
          item.name === "state"
            ? states
            : item.name === "city"
            ? cities
            : item.name === "country"
            ? countries
            : []
        )?.map((option) => (
          <MenuItem key={option.id} value={option.name}>
            {option.name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

  if (item.type === "field") {
    return (
      <Box key={item.name} sx={{ mb: "20px" }}>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 600,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: "10px",
            textTransform: "capitalize",
          }}
        >
          {item?.title}
        </Typography>
        <Box
          component="input"
          sx={{
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0px 0px 3px 0.4px #00000040",
            border: "none",
            padding: "16px 20px",
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            "&::placeholder": {
              color: "#00000040",
              fontSize: "16px",
              fontWeight: 400,
            },
          }}
          placeholder={item?.placeHolder}
          value={form[item.name] || ""}
          onChange={(e) => handleChange(index, item.name, e.target.value)}
        />
      </Box>
    );
  }
  if (item.type === "text") {
    return (
      <Box key={item.name} sx={{ mb: "20px" }}>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 600,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: "10px",
            textTransform: "capitalize",
          }}
        >
          {item?.title}
        </Typography>
        <Box
          component="input"
          sx={{
            width: "100%",
            borderRadius: "10px",
            boxShadow: "0px 0px 3px 0.4px #00000040",
            border: "none",
            padding: "18px 20px",
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 300,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            "&::placeholder": {
              color: "#00000040",
              fontSize: "16px",
              fontWeight: 400,
            },
          }}
          placeholder={item?.placeHolder}
          value={form[item?.name] || ""}
          onChange={(e) => handleChange(index, item.name, e.target.value)}
        />
      </Box>
    );
  }
  if (item.type === "dropdown") {
    return (
      <Box key={item.name} sx={{ position: "relative", py: 0.5, my: 0.5 }}>
        <Typography
          sx={{
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 600,
            lineHeight: { xs: "12px", sm: "20px" },
            color: "#222222",
            mb: "10px",
            textTransform: "capitalize",
          }}
        >
          {item?.title}
        </Typography>
        <Select
          value={form[item.name] || ""}
          onChange={(e) => {
            handleChange(index, item.name, e.target.value, e);
          }}
          displayEmpty
          fullWidth
          sx={{
            ".MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
            boxShadow: "0px 0px 3px 0.4px #00000040",
            width: "100%",
            borderRadius: "10px",
            fontSize: { xs: "12px", sm: "15px", md: "16px" },
            fontWeight: 400,
            lineHeight: { xs: "12px", sm: "20px" },
            fontWeight: 400,
            color: "#222222",
            backgroundColor: "#FFFFFF",
            height: "54px",
            pt: "-66px !important",
          }}
        >
          <MenuItem value="">
            <em
              style={{
                color: "rgba(0, 0, 0, 0.31)",
              }}
            >
              Select {item.label}
            </em>
          </MenuItem>
          {totalExperience?.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
    );
  }

  return null;
};

export default FormField;
