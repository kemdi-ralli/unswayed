import React, { useState } from "react";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SendIcon from "@mui/icons-material/Send";
import styles from "./TextInput.module.css";

const TextInput = ({
  Label = "",
  placeholder = "",
  type = "text",
  value = "",
  setValue = () => {},
  onSend = () => {},
  ContainerStyle,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleKeyDown = (e) => {
    if (type === "send") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim()) {
          onSend();
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={styles.inputContainer} style={ContainerStyle}>
      {Label && (
        <p className={styles.label}>
          {Label} {required && <span style={{ color: "red" }}>*</span>}
        </p>
      )}
      <div className={styles.inputWrapper}>
        {type === "send" ? (
          <textarea
            className={styles.textarea}
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            style={{
              fontSize: "15px",
              color: "black",
              resize: "none",
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
          />
        ) : (
          <Input
            className={styles.input}
            placeholder={placeholder}
            disableUnderline={true}
            type={type === "password" && !showPassword ? "password" : "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            required={required}
            sx={{ fontSize: "15px", color: "black" }}
          />
        )}
        {type === "password" && (
          <IconButton
            onClick={handleTogglePasswordVisibility}
            className={styles.iconButton}
            aria-label="toggle password visibility"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        )}
        {type === "send" && (
          <IconButton
            onClick={() => value.trim() && onSend()}
            className={styles.iconButton}
            aria-label="send"
          >
            <SendIcon />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default TextInput;
