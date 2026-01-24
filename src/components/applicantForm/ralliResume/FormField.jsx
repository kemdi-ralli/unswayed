import React, { useState, useRef, useEffect } from "react";
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
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const DEBOUNCE_MS = 300;

/**
 * FormField Component with Immediate Field-Level Validation
 * 
 * New Props:
 * - handleBlur: Function to handle blur events for validation
 * - error: Boolean indicating if field has error
 * - errorMessage: Error message to display
 * - loadingStates: Boolean for state dropdown loading
 * - loadingCities: Boolean for city dropdown loading
 */
const FormField = ({
  item,
  form,
  index,
  handleChange,
  handleBlur,
  handleEnhanceAi,
  countries,
  states,
  cities,
  checkedLabel,
  totalExperience,
  loadingStates = false,
  loadingCities = false,
  error = false,
  errorMessage = "",
}) => {
  // ========== University Autocomplete State (for institution_name) ==========
  const [univOptions, setUnivOptions] = useState([]);
  const [uLoading, setULoading] = useState(false);
  const [uError, setUError] = useState(null);
  const fetchAbortRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Fetch universities from API
  const fetchUniversities = async (q) => {
    try {
      if (fetchAbortRef.current) {
        fetchAbortRef.current.abort();
      }
      fetchAbortRef.current = new AbortController();
      setULoading(true);
      setUError(null);

      const url = `/api/universities?q=${encodeURIComponent(q)}`;
      const res = await fetch(url, { signal: fetchAbortRef.current.signal });
      if (!res.ok) throw new Error("Failed to fetch universities");
      const resp = await res.json();
      setUnivOptions(
        resp.map((u) => ({ label: u.name, country: u.country || "" }))
      );
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("fetchUniversities error", err);
        setUError("Unable to load schools");
        setUnivOptions([]);
      }
    } finally {
      setULoading(false);
    }
  };

  // Debounced input handler
  const onUnivInputChange = (value) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    if (value && value.length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        fetchUniversities(value);
      }, DEBOUNCE_MS);
    } else {
      setUnivOptions([]);
    }
  };

  // Get error styling for inputs
  const getErrorSx = () => ({
    boxShadow: error
      ? "0px 0px 3px 2px #ff000040"
      : "0px 0px 3px 0.4px #00000040",
    border: error ? "1px solid #ff0000" : "none",
  });

  // Handle blur event
  const onBlur = (e) => {
    if (handleBlur) {
      handleBlur(index, item.name, e?.target?.value ?? form[item.name]);
    }
  };

  // Error message component
  const ErrorMessage = () => {
    if (!error || !errorMessage) return null;
    return (
      <Typography
        sx={{
          color: "red",
          fontSize: "12px",
          mt: "5px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        ⚠ {errorMessage}
      </Typography>
    );
  };

  // ========== CHECKBOX (is_continue) ==========
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
            ...getErrorSx(),
            mb: "10px",
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
                onBlur={onBlur}
                sx={{
                  color: "#189e33ff",
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
        <ErrorMessage />
      </>
    );
  }

  // ========== DATE PICKER (start_date, end_date) ==========
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
          {item?.required && (
            <Typography component="span" sx={{ color: "red" }}>
              *
            </Typography>
          )}
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
                onBlur: onBlur,
                error: error,
                sx: {
                  width: "100%",
                  borderRadius: "10px",
                  ...getErrorSx(),
                  "& input": {
                    color: "#000",
                    padding: "13px 10px",
                    width: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: { xs: "12px", sm: "15px", md: "16px" },
                    fontWeight: 300,
                    lineHeight: { xs: "12px", sm: "20px" },
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
        <ErrorMessage />
      </Box>
    );
  }

  // ========== TEXTAREA (description) ==========
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
          {item?.required && (
            <Typography component="span" sx={{ color: "red" }}>
              *
            </Typography>
          )}
        </Typography>
        <TextField
          multiline
          rows={4}
          fullWidth
          placeholder={item?.placeHolder}
          value={form[item.name] || ""}
          onChange={(e) => handleChange(index, item.name, e.target.value)}
          onBlur={onBlur}
          error={error}
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
            ...getErrorSx(),
            color: "#222222",
            "& .MuiInputBase-input": {
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
              outline: "none",
              fontSize: { xs: "12px", sm: "15px", md: "16px" },
              fontWeight: 300,
              lineHeight: { xs: "12px", sm: "20px" },
            },
            "&:hover": {
              outline: "none",
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
            "&:focus-within": {
              boxShadow: error
                ? "0px 0px 3px 2px #ff000060"
                : "0px 0px 5px #00305B80",
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
        <ErrorMessage />
      </Box>
    );
  }

  // ========== LOCATION DROPDOWNS (country, state, city) ==========
  if (["country", "state", "city"].includes(item?.name)) {
    const isLoading = 
      (item.name === "state" && loadingStates) || 
      (item.name === "city" && loadingCities);

    const options = 
      item.name === "state"
        ? states
        : item.name === "city"
        ? cities
        : item.name === "country"
        ? countries
        : [];

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
          {item?.required && (
            <Typography component="span" sx={{ color: "red" }}>
              *
            </Typography>
          )}
        </Typography>

        <Box sx={{ position: "relative" }}>
          <Select
            value={form[item.name] || ""}
            onChange={(e) => {
              handleChange(index, item.name, e.target.value, e);
            }}
            onBlur={onBlur}
            displayEmpty
            fullWidth
            disabled={isLoading}
            error={error}
            sx={{
              ".MuiOutlinedInput-notchedOutline": { 
                border: error ? "1px solid #ff0000" : "none" 
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: error ? "1px solid #ff0000" : "none",
              },
              ...getErrorSx(),
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
                {isLoading ? "Loading..." : `Select ${item.label}`}
              </em>
            </MenuItem>

            {options?.map((option) => (
              <MenuItem key={option.id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </Select>
          
          {isLoading && (
            <CircularProgress
              size={20}
              sx={{
                position: "absolute",
                right: 40,
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />
          )}
        </Box>
        <ErrorMessage />
      </Box>
    );
  }

  // ========== TEXT INPUT (type: "field") ==========
  if (item.type === "field") {
    // ===== SPECIAL: Institution Name with Autocomplete =====
    if (item.name === "institution_name") {
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
            {item?.required && (
              <Typography component="span" sx={{ color: "red" }}>
                *
              </Typography>
            )}
          </Typography>

          {uError ? (
            // Fallback to regular TextField if API fails
            <Box
              component="input"
              sx={{
                width: "100%",
                borderRadius: "10px",
                ...getErrorSx(),
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
                "&:focus": {
                  outline: "none",
                  boxShadow: error
                    ? "0px 0px 3px 2px #ff000060"
                    : "0px 0px 5px #00305B80",
                },
              }}
              placeholder={item?.placeHolder}
              value={form[item.name] || ""}
              onChange={(e) => handleChange(index, item.name, e.target.value)}
              onBlur={onBlur}
            />
          ) : (
            // Autocomplete with university search
            <Autocomplete
              freeSolo
              options={univOptions}
              getOptionLabel={(opt) =>
                typeof opt === "string" ? opt : opt.label
              }
              filterOptions={(x) => x} // Server-side filtering
              inputValue={form[item.name] || ""}
              onInputChange={(e, newValue, reason) => {
                handleChange(index, item.name, newValue);
                if (reason === "input") onUnivInputChange(newValue);
              }}
              onChange={(e, value) => {
                const val = typeof value === "string" ? value : value?.label || "";
                handleChange(index, item.name, val);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={item?.placeHolder || "Start typing your school..."}
                  error={error}
                  onBlur={onBlur}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {uLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    width: "100%",
                    borderRadius: "10px",
                    ...getErrorSx(),
                    "& input": {
                      color: "#222222",
                      padding: "16px 20px",
                      fontSize: { xs: "12px", sm: "15px", md: "16px" },
                      fontWeight: 300,
                      lineHeight: { xs: "12px", sm: "20px" },
                    },
                    "& input::placeholder": {
                      color: "#00000040",
                      fontSize: "16px",
                      fontWeight: 400,
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        border: "none",
                      },
                    },
                    "&:focus-within": {
                      boxShadow: error
                        ? "0px 0px 3px 2px #ff000060"
                        : "0px 0px 5px #00305B80",
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.label}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "8px 4px",
                    }}
                  >
                    <Typography sx={{ fontSize: "14px", fontWeight: 500 }}>
                      {option.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        color: "#6b7280",
                        fontStyle: "italic",
                      }}
                    >
                      {option.country}
                    </Typography>
                  </Box>
                </li>
              )}
              ListboxProps={{
                sx: {
                  maxHeight: "300px",
                  "& .MuiAutocomplete-option": {
                    padding: "8px 16px",
                    "&:hover": {
                      backgroundColor: "rgba(24, 158, 51, 0.08)",
                    },
                  },
                },
              }}
            />
          )}
          <ErrorMessage />
          <Typography
            sx={{
              fontSize: "11px",
              color: "#6b7280",
              mt: "5px",
              fontStyle: "italic",
            }}
          >
            💡 Start typing to search universities worldwide
          </Typography>
        </Box>
      );
    }

    // ===== REGULAR TEXT INPUT (non-institution fields) =====
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
          {item?.required && (
            <Typography component="span" sx={{ color: "red" }}>
              *
            </Typography>
          )}
        </Typography>
        <Box
          component="input"
          sx={{
            width: "100%",
            borderRadius: "10px",
            ...getErrorSx(),
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
            "&:focus": {
              outline: "none",
              boxShadow: error
                ? "0px 0px 3px 2px #ff000060"
                : "0px 0px 5px #00305B80",
            },
          }}
          placeholder={item?.placeHolder}
          value={form[item.name] || ""}
          onChange={(e) => handleChange(index, item.name, e.target.value)}
          onBlur={onBlur}
        />
        <ErrorMessage />
      </Box>
    );
  }

  // ========== TEXT INPUT (type: "text") ==========
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
          {item?.required && (
            <Typography component="span" sx={{ color: "red" }}>
              *
            </Typography>
          )}
        </Typography>
        <Box
          component="input"
          sx={{
            width: "100%",
            borderRadius: "10px",
            ...getErrorSx(),
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
            "&:focus": {
              outline: "none",
              boxShadow: error
                ? "0px 0px 3px 2px #ff000060"
                : "0px 0px 5px #00305B80",
            },
          }}
          placeholder={item?.placeHolder}
          value={form[item?.name] || ""}
          onChange={(e) => handleChange(index, item.name, e.target.value)}
          onBlur={onBlur}
        />
        <ErrorMessage />
      </Box>
    );
  }

  // ========== DROPDOWN (type: "dropdown" - for years of experience and job type) ==========
  if (item.type === "dropdown") {
    // Determine options source: item.options for job type, totalExperience for years
    const dropdownOptions = item.options || totalExperience || [];
    
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
          {item?.required && (
            <Typography component="span" sx={{ color: "red" }}>
              *
            </Typography>
          )}
        </Typography>
        <Select
          value={form[item.name] || ""}
          onChange={(e) => {
            handleChange(index, item.name, e.target.value, e);
          }}
          onBlur={onBlur}
          displayEmpty
          fullWidth
          error={error}
          sx={{
            ".MuiOutlinedInput-notchedOutline": { 
              border: error ? "1px solid #ff0000" : "none" 
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: error ? "1px solid #ff0000" : "none",
            },
            ...getErrorSx(),
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
            <em
              style={{
                color: "rgba(0, 0, 0, 0.31)",
              }}
            >
              {item.placeHolder || `Select ${item.label || item.title}`}
            </em>
          </MenuItem>
          {dropdownOptions?.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        </Select>
        <ErrorMessage />
      </Box>
    );
  }

  return null;
};

export default FormField;