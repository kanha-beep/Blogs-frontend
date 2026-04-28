"use client";

import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { SingleBlogsCards } from "../cards/SingleBlogsCards";
import { useToast } from "../components/ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export const SingleBlogs = () => {
  const [user, setUser] = useState("");
  const [blogs, setBlogs] = useState(null);
  const { id } = useParams();
  const { showToast } = useToast();

  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}/comments`);
        setUser(res?.data?.user?._id);
        setBlogs(res?.data);
      } catch (error) {
        console.log(error?.response?.data, "Single Blogs");
        showToast({ title: "Story failed", message: getErrorMessage(error) });
      }
    };

    getSingleBlog();
  }, [id, showToast]);

  return (
    <div>
      {blogs ? (
        <SingleBlogsCards blogs={blogs} user={user} />
      ) : (
        <div className="dashboard-panel rounded-none border-x-0 p-4 sm:rounded-[32px] sm:border sm:p-5">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-32 rounded-full bg-[#edf0d9]" />
            <div className="h-12 w-3/4 rounded-full bg-[#edf0d9]" />
            <div className="h-[22rem] rounded-[32px] bg-[#edf0d9]" />
            <div className="h-4 w-full rounded-full bg-[#edf0d9]" />
            <div className="h-4 w-5/6 rounded-full bg-[#edf0d9]" />
          </div>
        </div>
      )}
    </div>
  );
};
