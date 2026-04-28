"use client";

import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { BlogsComments } from "./BlogsComments";
import { SingleBlogs } from "./SingleBlogs";

export default function SingleBlogsFinal() {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--dashboard-bg)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[4%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(125,211,252,0.22),_transparent_72%)] blur-2xl" />
        <div className="absolute right-[-10%] top-[18%] h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(251,146,60,0.16),_transparent_72%)] blur-3xl" />
        <div className="absolute bottom-[-12%] left-[28%] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(45,212,191,0.12),_transparent_72%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-4 px-0 py-4 sm:gap-6 sm:px-5 sm:py-7 lg:px-7">
        <SingleBlogs />
        <BlogsComments />
      </div>
    </div>
  );
}
