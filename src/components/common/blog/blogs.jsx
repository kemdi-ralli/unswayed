"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  Card,
  CardContent,
  Grid,
  Button,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import BackButton from "../BackButton/BackButton";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import CreateBlogModal from "./CreateBlogModal";
import { fetchBlogCategories } from "@/helper/blogGetApiHelper";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const Blogs = ({ data, onRefresh }) => {
  const router = useRouter();
  const pathName = usePathname();
  const { userData } = useSelector((state) => state.auth);
  const isLoggedIn = Object.keys(userData || {}).length > 0;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [myBlogsOnly, setMyBlogsOnly] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState(["all"]);

  useEffect(() => {
    const getCategories = async () => {
      const cats = await fetchBlogCategories();
      if (cats && cats.length > 0) {
        setDynamicCategories(["all", ...cats]);
      }
    };
    getCategories();
  }, []);

  useEffect(() => {
    onRefresh({
      search: searchQuery,
      category: selectedCategory,
      my_blogs: myBlogsOnly,
    });
  }, [searchQuery, selectedCategory, myBlogsOnly, onRefresh]);

  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = (text) => {
    if (!text) return 1;
    const wordCount = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / 200));
  };

  const handleViewDetails = (id) => {
    if (pathName.includes("employer")) {
      router.push(`/employer/blog-details/${id}`);
    } else {
      router.push(`/blog-details/${id}`);
    }
  };

  return (
    <Box>
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          background: "linear-gradient(135deg, #00305B 0%, #189e33ff 100%)",
          borderRadius: "16px",
          py: { xs: 4, md: 6 },
          px: 3,
          color: "#FFF",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "28px", sm: "36px", md: "48px", lg: "56px" },
            fontWeight: 700,
            mb: 2,
            textTransform: "capitalize",
            letterSpacing: "-0.5px",
          }}
        >
          Knowledge Hub
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "14px", sm: "16px", md: "18px" },
            fontWeight: 400,
            opacity: 0.95,
            maxWidth: "600px",
            mx: "auto",
            lineHeight: 1.6,
            mb: 3,
          }}
        >
          Discover insights, tips, and strategies to advance your career and
          excel in your professional journey
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          {isLoggedIn && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsModalOpen(true)}
              sx={{
                backgroundColor: "#FFF",
                color: "#00305B",
                fontWeight: 700,
                borderRadius: "8px",
                px: 4,
                py: 1.5,
                textTransform: "none",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Create Article
            </Button>
          )}

          {isLoggedIn && (
            <FormControlLabel
              control={
                <Switch
                  checked={myBlogsOnly}
                  onChange={(e) => setMyBlogsOnly(e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#FFF" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#FFF" },
                  }}
                />
              }
              label="My Articles"
              sx={{ color: "#FFF", "& .MuiTypography-root": { fontWeight: 600 } }}
            />
          )}
        </Box>
      </Box>

      <BackButton />

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search articles, topics, or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              backgroundColor: "#FFF",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
              },
              "&.Mui-focused": {
                boxShadow: "0px 4px 12px rgba(0, 48, 91, 0.2)",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#00305B" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Category Chips */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
            mb: 3,
          }}
        >
          {dynamicCategories.map((category) => (
            <Chip
              key={category}
              label={category === "all" ? "All Articles" : category}
              onClick={() => setSelectedCategory(category)}
              sx={{
                backgroundColor:
                  selectedCategory === category ? "#00305B" : "#F5F5F5",
                color: selectedCategory === category ? "#FFF" : "#333",
                fontWeight: 600,
                fontSize: "14px",
                px: 1,
                py: 2.5,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === category ? "#002040" : "#E0E0E0",
                  transform: "translateY(-2px)",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                },
              }}
            />
          ))}
        </Box>

        {/* Results Count */}
        <Typography
          sx={{
            fontSize: "14px",
            color: "#666",
            mb: 3,
            fontWeight: 500,
          }}
        >
          {data?.length || 0} {(data?.length || 0) === 1 ? "article" : "articles"} found
        </Typography>
      </Box>

      {/* Blog Grid */}
      {(!data || data.length === 0) ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 3,
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#666",
              mb: 2,
            }}
          >
            No articles found
          </Typography>
          <Typography
            sx={{
              fontSize: "16px",
              color: "#999",
            }}
          >
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {data.map((item) => {
            const readingTime = calculateReadingTime(item?.description);
            return (
              <Grid item xs={12} sm={6} md={4} key={item?.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.08)",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: "0px 12px 40px rgba(0, 48, 91, 0.2)",
                      "& .blog-image": {
                        transform: "scale(1.05)",
                      },
                      "& .read-more": {
                        color: "#189e33ff",
                        transform: "translateX(4px)",
                      },
                    },
                  }}
                  onClick={() => handleViewDetails(item?.id)}
                >
                  {/* Image */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: { xs: "220px", sm: "240px", md: "260px" },
                      overflow: "hidden",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    {item?.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item?.title || "Blog thumbnail"}
                        fill
                        className="blog-image"
                        style={{
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        sizes="(max-width: 600px) 100vw, (max-width: 960px) 50vw, 33vw"
                      />
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        animation="wave"
                      />
                    )}
                    {/* Category Badge */}
                    {item?.category && (
                      <Chip
                        label={item.category}
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          backgroundColor: "rgba(0, 48, 91, 0.9)",
                          color: "#FFF",
                          fontWeight: 600,
                          fontSize: "11px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      />
                    )}
                  </Box>

                  {/* Content */}
                  <CardContent
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      p: 3,
                    }}
                  >
                    {/* Title */}
                    <Typography
                      sx={{
                        fontSize: { xs: "18px", sm: "20px", md: "22px" },
                        fontWeight: 700,
                        color: "#00305B",
                        mb: 1.5,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "56px",
                      }}
                    >
                      {item?.title}
                    </Typography>

                    {/* Short Description */}
                    <Typography
                      sx={{
                        fontSize: "14px",
                        color: "#666",
                        lineHeight: 1.6,
                        mb: 2,
                        flexGrow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "66px",
                      }}
                    >
                      {item?.short_description || "Read more to discover insights..."}
                    </Typography>

                    {/* Meta Information */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      {item?.author && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            mr: 1,
                          }}
                        >
                          <PersonIcon
                            sx={{ fontSize: "14px", color: "#00305B" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#00305B",
                              fontWeight: 600,
                            }}
                          >
                            {item.author.name || "User"}
                          </Typography>
                        </Box>
                      )}
                      {item?.created_at && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CalendarTodayIcon
                            sx={{ fontSize: "14px", color: "#999" }}
                          />
                          <Typography
                            sx={{
                              fontSize: "12px",
                              color: "#999",
                              fontWeight: 500,
                            }}
                          >
                            {dayjs(item.created_at).format("MMM DD, YYYY")}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        <AccessTimeIcon
                          sx={{ fontSize: "14px", color: "#999" }}
                        />
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#999",
                            fontWeight: 500,
                          }}
                        >
                          {readingTime} min read
                        </Typography>
                      </Box>
                    </Box>

                    {/* Social Stats */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 2,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ThumbUpIcon sx={{ fontSize: "14px", color: item?.is_liked ? "#189e33ff" : "#999" }} />
                        <Typography sx={{ fontSize: "12px", color: "#666", fontWeight: 600 }}>
                          {item?.likes_count || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ChatBubbleOutlineIcon sx={{ fontSize: "14px", color: "#999" }} />
                        <Typography sx={{ fontSize: "12px", color: "#666", fontWeight: 600 }}>
                          {item?.comments_count || 0}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <ShareIcon sx={{ fontSize: "14px", color: "#999" }} />
                        <Typography sx={{ fontSize: "12px", color: "#666", fontWeight: 600 }}>
                          {item?.shares_count || 0}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Read More Button */}
                    <Button
                      className="read-more"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        color: "#00305B",
                        fontWeight: 600,
                        fontSize: "14px",
                        textTransform: "none",
                        justifyContent: "flex-start",
                        px: 0,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          backgroundColor: "transparent",
                        },
                      }}
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <CreateBlogModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
      />
    </Box>
  );
};

export default Blogs;
