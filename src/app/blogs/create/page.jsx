"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import BlogForm from "@/components/blog/BlogForm";

const Page = () => {
  const router = useRouter();
  const token = Cookie.get("token");
  const isAuthenticated = !!token;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!token) {
      router.replace(`/applicant/login?redirect=${encodeURIComponent("/blogs/create")}`);
    }
  }, [token, router]);

  const handleSuccess = (blog) => {
    const id = blog?.id ?? blog?.data?.id;
    if (id) {
      router.push(`/blogs/${id}`);
    } else {
      router.push("/blogs");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <BlogForm
      onSuccess={handleSuccess}
      onCancel={() => router.push("/blogs")}
    />
  );
};

export default Page;
