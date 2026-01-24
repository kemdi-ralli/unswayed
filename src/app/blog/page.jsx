"use client"
import React, { useEffect, useState, useCallback } from "react";
import Blogs from "@/components/common/blog/blogs";
import Container from "@/components/common/Container";
import { fetchBlogs } from "@/helper/blogGetApiHelper";

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  
  const getBlogs = useCallback(async () => {
    const data = await fetchBlogs();
    setBlogs(data);
  }, []);

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  return (
    <Container>
      <Blogs data={blogs} onRefresh={getBlogs} />
    </Container>
  );
};

export default Page;
