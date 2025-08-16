import { Box, Typography } from "@mui/material";

const UserDetail = ({ label, value, isAddEdu }) => {
  if (!value) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#FFF",
        border: "none",
        outline: "none",
        width: "100%",
        ...(isAddEdu !== true && {
          mb: "20px",
          boxShadow: "0px 0px 3px #00000040",
          padding: "18px 20px",
          borderRadius: "10px",
        }),
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "10px", sm: "14px", md: "16px" },
          lineHeight: { xs: "19px", sm: "22px", md: "25px" },
          fontWeight: 500,
          color: "#222222",
          "@media (max-width: 340px)": {
            fontSize: "9px",
            lineHeight:  "19px",
          },
        }}  
      >
        {label}:
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: "10px", sm: "14px", md: "16px" },
          lineHeight: { xs: "19px", sm: "22px", md: "25px" },
          fontWeight: 500,
          color: "#222222",
          "@media (max-width: 340px)": {
            fontSize: "9px",
            lineHeight:  "19px",
          },
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

export default UserDetail;
