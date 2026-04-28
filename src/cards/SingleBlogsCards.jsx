"use client";

import { useMemo, useState } from "react";
import GoToHomePageButton from "../buttons/GoToHomePageButton";
import EditButton from "../buttons/EditButton.jsx";
import DeleteButton from "../buttons/DeleteButton.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import SmartImage from "../components/SmartImage.jsx";

export const SingleBlogsCards = ({ blogs, user }) => {
  const { user: currentUser } = useAuth();
  const [readerMode, setReaderMode] = useState("focus");
  const [activeParagraph, setActiveParagraph] = useState(0);
  const comments = blogs?.comments || [];
  const paragraphs = useMemo(
    () => blogs?.content?.split(/\n+/).filter(Boolean) || [],
    [blogs?.content]
  );
  const readingTime = Math.max(
    1,
    Math.ceil((blogs?.content || "").trim().split(/\s+/).filter(Boolean).length / 180)
  );
  const uniqueVoices = new Set(
    comments.map((comment) => comment?.user?.name || "Anonymous")
  ).size;
  const averageRating = comments.length
    ? (
        comments.reduce((sum, comment) => sum + (Number(comment?.rating) || 0), 0) /
        comments.length
      ).toFixed(1)
    : 0;
  const latestComment = comments.length
    ? [...comments].sort(
        (a, b) => new Date(b?.createdAt || 0).getTime() - new Date(a?.createdAt || 0).getTime()
      )[0]
    : null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCommentDate = (value) => {
    if (!value) return "Just now";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const groupedSections = useMemo(() => {
    if (!paragraphs.length) return [];

    const sectionCount = Math.min(3, paragraphs.length);
    const chunkSize = Math.ceil(paragraphs.length / sectionCount);

    return Array.from({ length: sectionCount }, (_, index) => {
      const chunk = paragraphs.slice(index * chunkSize, (index + 1) * chunkSize);
      const combined = chunk.join(" ").trim();
      const parts = combined.split(/(?<=[.:!?])\s+/).filter(Boolean);

      return {
        heading: parts[0] || `Part ${index + 1}`,
        summary: parts.slice(1).join(" ").trim(),
      };
    }).filter((section) => section.heading);
  }, [paragraphs]);

  const readerModes = [
    { id: "focus", label: "Default" },
    { id: "wide", label: "Wide" },
    { id: "immersive", label: "Expanded" },
  ];

  const storyWidthClass =
    readerMode === "wide"
      ? "max-w-4xl"
      : readerMode === "immersive"
        ? "max-w-5xl"
        : "max-w-3xl";
  const storyToneClass =
    readerMode === "immersive"
      ? "bg-[#fffef8]"
      : readerMode === "wide"
        ? "bg-[#fffdf7]"
        : "bg-transparent";

  return (
    <article className="dashboard-panel overflow-hidden rounded-none border-x-0 sm:rounded-[32px] sm:border">
      <div className="p-3 sm:p-5 lg:p-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-[#dbe6b8] bg-[#fff9df] px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#465240]">
            Blog Post
          </span>
          {blogs?.category && (
            <span className="rounded-full border border-[#cae1a8] bg-[#eef7cc] px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#547047]">
              {Array.isArray(blogs.category) ? blogs.category.join(" / ") : blogs.category}
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-5 sm:mt-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              {blogs?.title}
            </h1>

            <div className="mt-4 grid gap-2 sm:mt-6 sm:flex sm:flex-wrap sm:gap-4">
              <div className="flex items-center gap-2 rounded-2xl border border-[#dbe6b8] bg-[#fffdf4] px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#eef7cc] text-xs font-semibold text-[#547047] sm:h-11 sm:w-11 sm:text-sm">
                  {blogs?.author?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">By {blogs?.author}</p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#465240] sm:text-xs sm:tracking-[0.18em]">
                    Published {formatDate(blogs?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#dbe6b8] bg-[#fffdf4] px-3 py-2 sm:px-4 sm:py-3">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#465240] sm:text-xs sm:tracking-[0.18em]">
                  Read Time
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">{readingTime} min read</p>
              </div>
{/* 
              <div className="rounded-2xl border border-[#dbe6b8] bg-[#fffdf4] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[#465240]">
                  Discussion
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {blogs?.comments?.length || 0} comments
                </p>
              </div> */}
            </div>

            <div className="mt-5 rounded-[24px] border border-[#dbe6b8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,232,0.96))] p-3 sm:mt-6 sm:rounded-[28px] sm:p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#465240]">
                Comments Overview
              </p>

              <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="rounded-full border border-[#dbe6b8] bg-[#fffdf4] px-3 py-2 text-sm text-[#364331]">
                    {comments.length} comment{comments.length === 1 ? "" : "s"}
                  </div>
                  <div className="rounded-full border border-[#c9ddd5] bg-[#e5f2ed] px-3 py-2 text-sm text-[#2d4b3f]">
                    {uniqueVoices} people
                  </div>
                  <div className="rounded-full border border-[#ecd8a0] bg-[#fff3c8] px-3 py-2 text-sm text-[#7a5621]">
                    {averageRating} avg rating
                  </div>
                </div>

                <div className="rounded-[18px] border border-[#dbe6b8] bg-[#f6f7e8] p-3 sm:rounded-[22px] sm:p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#465240]">
                    Latest comment
                  </p>
                  {latestComment ? (
                    <>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                          {latestComment?.user?.name || "Anonymous"}
                        </p>
                        <span className="text-[11px] uppercase tracking-[0.14em] text-[#465240] sm:text-xs sm:tracking-[0.18em]">
                          {formatCommentDate(latestComment?.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-5 text-[#42503d] sm:leading-6">
                        {latestComment?.content?.length > 90
                          ? `${latestComment.content.slice(0, 90)}...`
                          : latestComment?.content}
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-[#465240]">
                      No comments yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-[30px] border border-[#dbe6b8] bg-[#fffdf4] p-4">
            <div className="overflow-hidden rounded-[24px]">
              <SmartImage
                src={blogs.url}
                alt={blogs?.title}
                fallbackLabel={blogs?.author ? `${blogs.author}'s article` : "Article visual"}
                className="h-[20rem] w-full object-cover sm:h-[24rem]"
              />
            </div>
            <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
              {currentUser?._id === user && (
                <>
                  <EditButton id={blogs._id} />
                  <DeleteButton />
                </>
              )}
              {/* <GoToHomePageButton /> */}
            </div>
          </aside>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(245,247,232,0.92))] px-3 pb-5 pt-2 sm:px-5 sm:pb-6 lg:px-5">
        <div className={`mx-auto ${storyWidthClass}`}>
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-[#dbe6b8]" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#465240]">Article</span>
              <span className="h-px flex-1 bg-[#dbe6b8]" />
            </div>

            <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:overflow-visible">
              {readerModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setReaderMode(mode.id)}
                  className={`shrink-0 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] transition ${
                    readerMode === mode.id
                      ? "bg-[#eef7cc] text-[#304122]"
                      : "border border-[#dbe6b8] bg-[#fffdf4] text-[#465240] hover:bg-[#f4efcf]"
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`${storyToneClass} p-1 sm:p-2`}>
            <div className="space-y-6 text-[1.05rem] leading-8 text-[#2e3a29]">
              {groupedSections.map((block, index) => (
                <div
                  key={`${blogs._id}-${index}`}
                  onClick={() => setActiveParagraph(index)}
                  className={`block w-full cursor-pointer rounded-[22px] px-3 py-4 text-left transition sm:px-4 ${
                    activeParagraph === index
                      ? "bg-[#eef7cc] shadow-[0_14px_32px_rgba(168,203,115,0.12)]"
                      : "hover:bg-[#fff9df]"
                  }`}
                >
                  <p className="font-display text-xl font-semibold leading-tight text-slate-900 sm:text-[1.35rem]">
                    {block.heading}
                  </p>
                  {block.summary ? (
                    <p className="mt-3 border-l-2 border-[#dbe6b8] pl-5 text-[1rem] leading-8 text-[#42503d]">
                      {block.summary}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
