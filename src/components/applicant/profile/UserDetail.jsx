import { Box, Typography } from "@mui/material";

const UserDetail = ({ label, value, isAddEdu }) => {
  if (!value) return null;

  // Parse skills if it's a comma-separated string
  const isSkills = label === "Skills";
  const skillsArray = isSkills && typeof value === "string" 
    ? value.split(",").map(skill => skill.trim()).filter(Boolean)
    : null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isSkills ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isSkills ? "flex-start" : "center",
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
          mb: isSkills ? "10px" : 0,
          "@media (max-width: 340px)": {
            fontSize: "9px",
            lineHeight:  "19px",
          },
        }}  
      >
        {label}:
      </Typography>
      
      {isSkills && skillsArray ? (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            width: "100%",
          }}
        >
          {skillsArray.map((skill, index) => (
            <Box
              key={index}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#00305B",
                padding: "6px 14px",
                borderRadius: "20px",
                boxShadow: "0px 0px 3px #00000040",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px" },
                  fontWeight: 400,
                  color: "#FFF",
                  "@media (max-width: 340px)": {
                    fontSize: "9px",
                  },
                }}
              >
                {skill}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
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
      )}
    </Box>
  );
};

export default UserDetail;
