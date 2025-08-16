import React from "react";
import { Box, Typography } from "@mui/material";

export default function JobTypeTab({ Icon, TypeLabel, TypeDetail }) {
  const isDetailArray = Array.isArray(TypeDetail);
  return (
    <>
      {TypeDetail && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            py: "15px",
            flexWrap: isDetailArray ? "wrap" : "nowrap",
            // pb: isDetailArray ? "10px" : 0,
          }}
        >
          {Icon}
          <Typography
            sx={{
              fontSize: { xs: "10px", sm: "12px", md: "16px" },
              fontWeight: 500,
              lineHeight: {
                xs: "25px",
                sm: "30px",
                md: "25px",
                lg: "20px",
              },
              color: "#111111",
              px: { xs: "3px", sm: 2 },
            }}
          >
            {TypeLabel}:
          </Typography>
          {!isDetailArray ? (
            <Typography
              sx={{
                backgroundColor: "#FDF7F7",
                border: "0.4px solid #0000004D",
                borderRadius: "6px",
                color: "#222222",
                fontSize: { xs: "11px", sm: "14px", md: "16px" },
                fontWeight: 400,
                lineHeight: "18px",
                textAlign: "center",
                p: "7px",
              }}
            >
              {TypeDetail || ""}
            </Typography>
          ) : (
            TypeDetail.map((item, index) => (
              <Typography
                key={item?.id || index}
                sx={{
                  backgroundColor: "#FDF7F7",
                  border: "0.4px solid #0000004D",
                  borderRadius: "6px",
                  color: "#222222",
                  fontSize: { xs: "11px", sm: "14px", md: "16px" },
                  fontWeight: 400,
                  lineHeight: "18px",
                  textAlign: "center",
                  p: "7px",
                  mb: "5px",
                  ml: index > 0 ? "5px" : 0,
                }}
              >
                {item?.name || ""}
              </Typography>
            ))
          )}
        </Box>
      )}
    </>
  );
}
