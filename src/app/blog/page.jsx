"use client"
import React, { useEffect, useState } from "react";
import Blogs from "@/components/common/blog/blogs";
import Container from "@/components/common/Container";
import { fetchBlogs } from "@/helper/blogGetApiHelper";

const Page = () => {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    const getBlogs = async () => {
      const data = await fetchBlogs();
      setBlogs(data);
    };
    getBlogs();
  }, []);
  return (
    <Container>
      <Blogs data={blogs} />
    </Container>
  );
};

export default Page;
