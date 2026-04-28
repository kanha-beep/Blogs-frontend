"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import SmartImage from "../components/SmartImage.jsx";

export default function RecentBlogsCards({ blog }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-[28px] border border-[#dbe6b8] bg-[#fffdf4] transition duration-300 hover:-translate-y-1 hover:border-[#c8d79f]"
      onClick={() => navigate(`/${blog._id}`)}
    >
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          src={blog.url}
          alt={blog.title}
          fallbackLabel={blog.author ? `${blog.author}'s pick` : "Featured visual"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {blog?.category && (
          <span className="absolute left-4 top-4 rounded-full border border-[#f0d49e] bg-[#fff3c8] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#8b6a31]">
            {Array.isArray(blog.category) ? blog.category.join(" / ") : blog.category}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fff8dc] via-transparent to-transparent" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.2em] text-[#465240]">
          <span>{blog.author}</span>
          <span>{formatDate(blog?.createdAt)}</span>
        </div>
        <h3 className="mt-3 font-display text-2xl leading-tight text-slate-900">
          {blog.title.length > 64 ? `${blog.title.substring(0, 64)}...` : blog.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[#42503d]">
          {blog.content?.length > 120
            ? `${blog.content.substring(0, 120)}...`
            : blog.content}
        </p>
      </div>
    </article>
  );
}
