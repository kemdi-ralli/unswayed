import Image from "next/image"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export function LargeTestimonial() {
  return (
    <Box
      component="section"
      sx={{
        width: "100%",
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        overflow="hidden"
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "1024px",
            p: { xs: 3, md: 6 },
            borderRadius: "12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            boxSizing: "border-box",
          }}
        >
          {/* Testimonial Text */}
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              color: "rgba(0,0,0,0.9)",
              fontWeight: 500,
              fontSize: "18px",
              lineHeight: "2rem",
              maxWidth: "800px",
            }}
          >
            Unswayed completely transformed the way I prepare for opportunities.
            Its AI-powered resume assistant gave me a professional draft in minutes,
            freeing me to focus on telling my story instead of formatting documents.
          </Typography>

          {/* Author */}
          <Box display="flex" alignItems="center" gap={2}>
            <Image
              src="/images/guillermo-rauch.png"
              alt="User avatar"
              width={48}
              height={48}
              style={{
                borderRadius: "50%",
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            />
            <Box display="flex" flexDirection="column">
              <Typography
                variant="subtitle1"
                sx={{
                  color: "rgba(0,0,0,0.9)",
                  fontWeight: 600,
                  lineHeight: "24px",
                }}
              >
                Alex Morgan
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(100,100,100,0.8)",
                  fontWeight: 400,
                  lineHeight: "20px",
                }}
              >
                Product Designer
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
