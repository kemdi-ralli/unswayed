import { useRef } from "react";
import { Cancel } from "@mui/icons-material";
import { Stack, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";

// Tag pill component
const Tag = ({ data, handleDelete }) => {
  return (
    <Box
      sx={{
        background: "#00305B",
        borderRadius: "20px",
        padding: "4px 10px",
        display: "flex",
        alignItems: "center",
        color: "#fff",
      }}
    >
      <Typography sx={{ fontSize: "12px", fontWeight: 500 }}>
        {data}
      </Typography>
      <Cancel
        sx={{ cursor: "pointer", fontSize: "16px", ml: 1 }}
        onClick={() => handleDelete(data)}
      />
    </Box>
  );
};

export default function TagInput({
  tags = [],
  setTags = () => {},
  placeholder = "Enter Skills Here",
}) {
  const tagRef = useRef();

  const handleDelete = (value) => {
    const newTags = tags.filter((tag) => tag !== value);
    setTags(newTags);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    const newTag = tagRef.current.value.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    tagRef.current.value = "";
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          p: 1,
          background: "#FFF",
          borderRadius: "5px",
          minHeight: "48px",
          alignItems: "center",
          boxShadow: "0px 0px 3px 1px #00000040",
        }}
      >
        {tags.map((tag, index) => (
          <Tag key={index} data={tag} handleDelete={handleDelete} />
        ))}

        <form onSubmit={handleOnSubmit} style={{ flexGrow: 1 }}>
          <TextField
            inputRef={tagRef}
            fullWidth
            variant="standard"
            placeholder={tags.length < 10 ? placeholder : ""}
            InputProps={{
              disableUnderline: true,
              style: {
                fontSize: "14px",
              },
            }}
            inputProps={{
              style: {
                padding: "4px",
              },
            }}
            sx={{
              minWidth: 100,
              "& input": {
                padding: "4px 8px",
              },
            }}
          />
        </form>
      </Box>
    </Box>
  );
}
