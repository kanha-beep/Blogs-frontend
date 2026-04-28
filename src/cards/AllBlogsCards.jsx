"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SmartImage from "../components/SmartImage.jsx";

export default function AllBlogsCards({ blog }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[30px] border border-[#dbe6b8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,232,0.96))] transition duration-300 hover:-translate-y-1 hover:border-[#c8d79f]">
      <div className="relative h-56 overflow-hidden">
        <SmartImage
          src={blog.url}
          alt={blog.title}
          fallbackLabel={blog.author ? `${blog.author}'s story` : "Story visual"}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {blog?.category && (
          <span className="absolute right-4 top-4 rounded-full border border-[#cae1a8] bg-[#eef7cc] px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#547047]">
            {Array.isArray(blog.category) ? blog.category.join(" / ") : blog.category}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#fff8dc] via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef7cc] text-sm font-semibold text-[#547047]">
            {blog.author?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-slate-900">{blog.author}</p>
            <p className="text-xs uppercase tracking-[0.18em] text-[#465240]">
              {formatDate(blog?.createdAt)}
            </p>
          </div>
        </div>
        <h3 className="font-display text-2xl leading-tight text-slate-900">
          {blog.title.length > 72 ? `${blog.title.substring(0, 72)}...` : blog.title}
        </h3>
        <p className="mt-3 flex-grow text-sm leading-6 text-[#42503d]">
          {blog.content.length > 120 ? `${blog.content.substring(0, 120)}...` : blog.content}
        </p>
        <button
          disabled={loading}
          className="mt-5 rounded-2xl bg-[#a8cb73] px-4 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
          onClick={() => {
            setLoading(true);
            navigate(`/${blog._id}`);
          }}
        >
          {loading ? "Read story..." : "Read story"}
        </button>
      </div>
    </article>
  );
}
