"use client";

import { useRef, useState } from "react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecentBlogs from "./RecentBlogs.jsx";
import AllBlogs from "./AllBlogs.jsx";
import api from "../utils/api.js";
import { useToast } from "./ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import SmartImage from "./SmartImage.jsx";

const formatCount = (value) => value.toString().padStart(2, "0");

export default function AllBlogsFinal() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [sort, setSort] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const hasLoadedRecentRef = useRef(false);
  const { showToast } = useToast();
  useEffect(() => {
    const getRecentBlogs = async () => {
      try {
        const res = await api.get(`/blogs/recent?sort=${sort}`);
        console.log("recent blogs final: ", res?.data);
        setRecentBlogs(res?.data);
      } catch (error) {
        console.log("error: ", error?.response?.data?.message);
        if (hasLoadedRecentRef.current) {
          showToast({ title: "Recent blogs failed", message: getErrorMessage(error) });
        }
      } finally {
        hasLoadedRecentRef.current = true;
      }
    };
    getRecentBlogs();
  }, [sort, showToast]);
  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/all?sort=${sort}&page=${page}`);
        console.log("all blogs final: ", res?.data);
        setLoading(false);
        setBlogs(res?.data?.blogs);
        setTotalPage(Math.ceil(res?.data?.totalBlogs / 3));
        setPage(parseInt(res?.data?.page));
      } catch (error) {
        console.log("error: ", error?.response?.data?.message);
        setLoading(false);
        showToast({ title: "Blog feed failed", message: getErrorMessage(error) });
      } finally {
        setLoading(false);
      }
    };
    getAllBlogs();
  }, [sort, page]);

  const featuredBlog = recentBlogs?.[0];
  const heroMetrics = [
    {
      label: "Fresh drops",
      value: formatCount(recentBlogs?.length || 0),
      note: "Latest stories highlighted first",
    },
    {
      label: "Visible now",
      value: formatCount(blogs?.length || 0),
      note: "Posts on the current discovery page",
    },
    {
      label: "Category",
      value: (sort || "all").toUpperCase(),
      note: "Your current editorial lane",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--dashboard-bg)] text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[6%] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,196,94,0.18),_transparent_72%)] blur-2xl" />
        <div className="absolute right-[-10%] top-[20%] h-96 w-96 rounded-full bg-[radial-gradient(circle,_rgba(94,234,212,0.16),_transparent_72%)] blur-3xl" />
        <div className="absolute bottom-[-12%] left-[35%] h-80 w-80 rounded-full bg-[radial-gradient(circle,_rgba(96,165,250,0.14),_transparent_72%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-7 sm:px-5 lg:px-7">
        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="dashboard-panel p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#dbe6b8] bg-[#fff9df] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#4f5c46]">
                Modern Editorial Frontpage
              </span>
              <span className="rounded-full bg-[#fff1cd] px-3 py-1 text-xs text-[#8b6a31]">
                Discovery inspired by today&apos;s best blog platforms
              </span>
            </div>

            <div className="mt-6 max-w-3xl">
              <h1 className="font-display text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Read fresh blogs, discover ideas, and follow the stories worth your time.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#42503d] sm:text-base">
                This blog homepage brings featured posts, recent writing, and category-based
                discovery together so readers can move naturally from one article to the next.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {heroMetrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-[#dbe6b8] bg-[#fffdf4] p-4"
                >
                  <p className="text-xs uppercase tracking-[0.22em] text-[#4f5c46]">
                    {item.label}
                  </p>
                  <p className="mt-3 font-display text-3xl font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            </div>

          <aside className="dashboard-panel p-4 sm:p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-[#465240]">
              Featured Story
            </p>
            {featuredBlog ? (
              <div className="mt-4 overflow-hidden rounded-[28px] border border-[#dbe6b8] bg-[#fffdf4]">
                <div className="relative h-44 sm:h-48">
                  <SmartImage
                    src={featuredBlog.url}
                    alt={featuredBlog.title}
                    fallbackLabel="Lead story"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#fff8dc] via-transparent to-transparent" />
                  <div className="absolute left-4 top-4 rounded-full border border-[#f0d49e] bg-[#fff3c8] px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#8b6a31]">
                    Lead pick
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#465240]">
                    {Array.isArray(featuredBlog.category)
                      ? featuredBlog.category.join(" / ")
                      : featuredBlog.category}
                  </p>
                  <h2 className="mt-2 font-display text-xl text-slate-900 sm:text-2xl">
                    {featuredBlog.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#42503d]">
                    {featuredBlog.content.slice(0, 100)}
                    {featuredBlog.content.length > 100 ? "..." : ""}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-[#42503d]">
                    <span>{featuredBlog.author}</span>
                    <span>{featuredBlog.comments?.length || 0} comments</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-[28px] border border-[#dbe6b8] bg-[#fffdf4] p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-40 rounded-3xl bg-[#edf0d9]" />
                  <div className="h-4 w-28 rounded-full bg-[#edf0d9]" />
                  <div className="h-8 w-3/4 rounded-full bg-[#edf0d9]" />
                  <div className="h-4 w-full rounded-full bg-[#edf0d9]" />
                </div>
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => {
                  setActionLoading("Start writing");
                  navigate("/blogsform");
                }}
                disabled={actionLoading === "Start writing"}
                className="rounded-2xl bg-[#a8cb73] px-4 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b]"
              >
                {actionLoading === "Start writing" ? "Start writing..." : "Start writing"}
              </button>
              <button
                onClick={() => {
                  setActionLoading("Open dashboard");
                  navigate("/dashboard");
                }}
                disabled={actionLoading === "Open dashboard"}
                className="rounded-2xl border border-[#dbe6b8] px-4 py-3 text-sm font-semibold text-[#364331] transition hover:bg-[#f4efcf]"
              >
                {actionLoading === "Open dashboard" ? "Open dashboard..." : "Open dashboard"}
              </button>
            </div>
          </aside>
        </section>

        <RecentBlogs blogs={recentBlogs} />
        <AllBlogs
          blogs={blogs}
          loading={loading}
          sort={sort}
          setSort={setSort}
          setPage={setPage}
        />

        <section className="flex flex-col items-center justify-center gap-4 pb-4 sm:flex-row">
          <button
            className="w-full rounded-2xl border border-[#dbe6b8] px-5 py-3 text-sm font-semibold text-[#364331] transition hover:bg-[#f4efcf] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            onClick={() => {
              setActionLoading("Previous page");
              setPage((prev) => Math.max(prev - 1, 1));
            }}
            disabled={page === 1 || loading}
          >
            {loading && actionLoading === "Previous page" ? "Previous page..." : "Previous page"}
          </button>
          <div className="rounded-full border border-[#dbe6b8] bg-[#fff9df] px-4 py-2 text-sm text-[#364331]">
            Page {page} of {totalPage || 1}
          </div>
          <button
            className="w-full rounded-2xl bg-[#a8cb73] px-5 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            onClick={() => {
              setActionLoading("Next page");
              setPage((prev) => Math.min(prev + 1, totalPage));
            }}
            disabled={page === totalPage || totalPage === 0 || loading}
          >
            {loading && actionLoading === "Next page" ? "Next page..." : "Next page"}
          </button>
        </section>

      </div>
    </div>
  );
}
