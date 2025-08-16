"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Container from "@/components/common/Container";
import BackButtonWithTitle from "@/components/applicant/dashboard/BackButtonWithTitle";
import { fetchBlogs } from "@/helper/blogGetApiHelper";
import dayjs from "dayjs";

const sanitizeHTML = (html) => {
  if (!html) return "";
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  tempDiv.querySelectorAll("input").forEach((el) => el.remove());
  tempDiv.querySelectorAll(".ql-tooltip").forEach((el) => el.remove());
  return tempDiv.innerHTML;
};

const BlogDetails = ({ params }) => {
  const [blog, setBlog] = useState(null);
  const [blogDetail, setBlogDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlogs = async () => {
      const data = await fetchBlogs();
      setBlogDetail(data);
    };
    getBlogs();
  }, []);

  useEffect(() => {
    if (blogDetail.length > 0 && params?.id) {
      const selectedBlog = blogDetail.find(
        (item) => item.id === parseInt(params.id)
      );

      if (selectedBlog) {
        setBlog(selectedBlog);
      }
      setLoading(false);
    }
  }, [blogDetail, params.id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Blog not found.</Typography>
      </Box>
    );
  }
  const cleanedDescription = sanitizeHTML(blog?.description);

  return (
    <Container>
      <BackButtonWithTitle label="Blogs" />

      <Box
        sx={{
          width: "100%",
          height: { xs: "200px", sm: "300px", md: "400px" },
          backgroundImage: `url(${blog?.thumbnail})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "8px",
        }}
      />

      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "19px", lg: "24px" },
          lineHeight: { xs: "22px", md: "18px" },
          fontWeight: 600,
          color: "#00305B",
          pt: 4,
          pb: 2,
        }}
      >
        {blog?.title}
      </Typography>

      <Typography
        sx={{
          fontSize: { xs: "14px", sm: "16px", md: "19px", lg: "24px" },
          lineHeight: { xs: "22px", md: "18px" },
          fontWeight: 600,
          color: "#FE4D82",
        }}
      >
        {dayjs(blog?.created_at).format("MMMM D, YYYY, h:mm A")}
      </Typography>


      <Box
        sx={{
          fontSize: { xs: "12px", sm: "14px", md: "16px", lg: "16px" },
          lineHeight: { xs: "28px", md: "26px" },
          color: "#111111",
          py: 2,
        }}
        dangerouslySetInnerHTML={{ __html: cleanedDescription }}
      />
    </Container>
  );
};

export default BlogDetails;
