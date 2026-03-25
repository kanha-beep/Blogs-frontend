import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api.js";
import { useNavigate, useParams } from "react-router-dom";

const sortOptions = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "A-Z names", value: "authors" },
];

const STAR_VALUES = [1, 2, 3, 4, 5];

const formatCommentDate = (value) => {
  if (!value) return "Just now";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const BlogsComments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [editComment, setEditComment] = useState(null);
  const [newText, setNewText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/blogs/${id}/comments`);
      setComments(res.data.comments || []);
    } catch (e) {
      console.log("Error fetching comments:", e?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  const sortedComments = useMemo(() => {
    const next = [...comments];

    if (sortBy === "authors") {
      return next.sort((a, b) =>
        (a?.user?.name || "Anonymous").localeCompare(b?.user?.name || "Anonymous")
      );
    }

    return next.sort((a, b) => {
      const left = new Date(a?.createdAt || 0).getTime();
      const right = new Date(b?.createdAt || 0).getTime();
      return sortBy === "oldest" ? left - right : right - left;
    });
  }, [comments, sortBy]);

  const uniqueVoices = useMemo(
    () => new Set(comments.map((comment) => comment?.user?.name || "Anonymous")).size,
    [comments]
  );

  const averageRating = useMemo(() => {
    if (!comments.length) return 0;
    return (
      comments.reduce((sum, comment) => sum + (Number(comment?.rating) || 0), 0) / comments.length
    ).toFixed(1);
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      navigate("/auth");
      return;
    }

    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      await api.post(`/blogs/${id}/comments`, {
        content: commentText.trim(),
        rating,
      });
      setCommentText("");
      setRating(5);
      fetchComments();
    } catch (e) {
      console.log("Error adding comment:", e?.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/blogs/${id}/comments/${commentId}`);
      fetchComments();
    } catch (e) {
      console.log("Error deleting comment:", e?.response?.data?.message);
      alert(e?.response?.data?.message);
    }
  };

  const handleSave = async () => {
    try {
      await api.patch(`/blogs/${id}/comments/${editComment?._id}`, {
        content: newText.trim(),
        rating: editRating,
      });
      fetchComments();
      setShowModal(false);
      setEditComment(null);
    } catch (e) {
      console.log("Error updating comment:", e?.response?.data?.message);
      alert(e?.response?.data?.message);
      setShowModal(false);
    }
  };

  return (
    <section className="dashboard-panel p-4 sm:p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[#465240]">
            Discussion System
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
            Built like a conversation layer, not a leftover comments box
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#42503d]">
            Inspired by Ghost&apos;s member-comment emphasis, Substack&apos;s creator-reader
            dialogue, and WordPress-style discussion controls, this section turns feedback
            into a visible, readable stream.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-full border border-[#dbe6b8] bg-[#fff9df] px-4 py-2 text-sm text-[#364331]">
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </div>
          <div className="rounded-full border border-[#c9ddd5] bg-[#e5f2ed] px-4 py-2 text-sm text-[#2d4b3f]">
            {uniqueVoices} active voice{uniqueVoices === 1 ? "" : "s"}
          </div>
          <div className="rounded-full border border-[#ecd8a0] bg-[#fff3c8] px-4 py-2 text-sm text-[#7a5621]">
            {averageRating} avg stars
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <aside className="space-y-5">
          <div className="rounded-[30px] border border-[#dbe6b8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,232,0.96))] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#465240]">
                  Write a reply
                </p>
              </div>
              <div className="rounded-2xl border border-[#dbe6b8] bg-[#fff9df] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#465240]">
                {commentText.trim().length}/500
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#465240]">
                  Star rating
                </p>
                <div className="flex flex-wrap gap-2">
                  {STAR_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition ${
                        value <= rating
                          ? "border-[#ecd8a0] bg-[#fff3c8] text-[#7a5621]"
                          : "border-[#dbe6b8] bg-[#fffdf4] text-[#5c6756] hover:bg-[#f4efcf]"
                      }`}
                      aria-label={`Set ${value} star rating`}
                    >
                      *
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                name="content"
                className="min-h-[170px] w-full rounded-[28px] border border-[#dbe6b8] bg-[#fffdf4] px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition placeholder:text-[#5c6756] focus:border-[#a8cb73]"
                placeholder={
                  currentUser
                    ? "Share a thoughtful response, an example, or a counterpoint..."
                    : "Sign in to join the conversation..."
                }
                value={commentText}
                maxLength={500}
                onChange={(e) => setCommentText(e.target.value)}
                rows="5"
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs leading-5 text-[#4f5c46]">
                  Cleaner, member-style discussion inspired by current blog products.
                </p>
                <button
                  type="submit"
                  disabled={submitting || (!currentUser ? false : !commentText.trim())}
                  className="rounded-2xl bg-[#a8cb73] px-5 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentUser
                    ? submitting
                      ? "Publishing..."
                      : "Publish comment"
                    : "Sign in to comment"}
                </button>
              </div>
            </form>
          </div>

        </aside>

        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-[28px] border border-[#dbe6b8] bg-[#fffdf4] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#465240]">
                Stream controls
              </p>
              <p className="mt-1 text-sm text-[#42503d]">
                Reorder the thread the way readers expect from a modern discussion UI.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-[0.18em] text-[#465240]">
                Sort
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-2xl border border-[#dbe6b8] bg-[#fffdf4] px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-[#a8cb73]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {sortedComments.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-[#dbe6b8] bg-[#fffdf4] p-4 text-center">
              <p className="font-display text-2xl text-slate-900">No comments yet</p>
              <p className="mt-2 text-sm text-[#465240]">
                Start the discussion with a useful insight, question, or critique.
              </p>
            </div>
          ) : (
            sortedComments.map((comment, index) => {
              const isAuthor = currentUser?._id && comment?.user?._id === currentUser?._id;

              return (
                <article
                  key={comment._id}
                  className="group rounded-[30px] border border-[#dbe6b8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,232,0.96))] p-5 transition hover:border-[#c8d79f]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef7cc] text-sm font-semibold text-[#547047]">
                        {(comment?.user?.name || "A").charAt(0).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-slate-900">
                            {comment?.user?.name || "Anonymous"}
                          </p>
                          {index === 0 && sortBy === "newest" && (
                            <span className="rounded-full bg-[#e5f2ed] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#2d4b3f]">
                              New
                            </span>
                          )}
                          {isAuthor && (
                            <span className="rounded-full bg-[#eef7cc] px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-[#365027]">
                              You
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-[#4f5c46]">
                          <span>{formatCommentDate(comment?.createdAt)}</span>
                          <span>{Number(comment?.rating) || 5}/5 stars</span>
                          <span>{comment?.content?.length || 0} chars</span>
                        </div>

                        <div className="mt-3 flex items-center gap-1 text-amber-200">
                          {STAR_VALUES.map((value) => (
                            <span
                              key={`${comment._id}-${value}`}
                              className={
                                value <= (Number(comment?.rating) || 5)
                                  ? "opacity-100"
                                  : "opacity-25"
                              }
                            >
                              *
                            </span>
                          ))}
                        </div>

                        <p className="mt-4 max-w-3xl text-sm leading-7 text-[#2e3a29]">
                          {comment?.content}
                        </p>
                      </div>
                    </div>

                    {isAuthor && (
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <button
                          className="rounded-2xl border border-[#dbe6b8] px-4 py-2 text-sm text-[#53604f] transition hover:bg-[#f4efcf]"
                          onClick={() => {
                            setEditComment(comment);
                            setNewText(comment.content);
                            setEditRating(Number(comment?.rating) || 5);
                            setShowModal(true);
                          }}
                          type="button"
                        >
                          Edit
                        </button>

                        <button
                          className="rounded-2xl border border-[#f0d49e] bg-[#fff1cd] px-4 py-2 text-sm text-[#8b5a2b] transition hover:bg-[#fde8b7]"
                          onClick={() => handleDelete(comment?._id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {showModal && editComment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#e9e8da]/80 px-4 backdrop-blur-sm"
          role="dialog"
        >
          <div className="w-full max-w-xl rounded-[32px] border border-[#dbe6b8] bg-[rgba(255,252,242,0.96)] p-5 shadow-[0_24px_60px_rgba(181,194,126,0.18)]">
            <h3 className="font-display text-2xl text-slate-900">Refine your comment</h3>
            <p className="mt-2 text-sm text-[#465240]">
              Keep the conversation sharp, clear, and useful before saving it back.
            </p>
            <div className="mt-5">
              <div className="mb-4">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#465240]">
                  Update star rating
                </p>
                <div className="flex flex-wrap gap-2">
                  {STAR_VALUES.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setEditRating(value)}
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-lg transition ${
                        value <= editRating
                          ? "border-[#ecd8a0] bg-[#fff3c8] text-[#7a5621]"
                          : "border-[#dbe6b8] bg-[#fffdf4] text-[#5c6756] hover:bg-[#f4efcf]"
                      }`}
                      aria-label={`Set ${value} star rating`}
                    >
                      *
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className="w-full rounded-3xl border border-[#dbe6b8] bg-[#fffdf4] px-4 py-4 text-sm leading-7 text-slate-900 outline-none transition focus:border-[#a8cb73]"
                rows="4"
                value={newText}
                maxLength={500}
                onChange={(e) => setNewText(e.target.value)}
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-[#465240]">{newText.trim().length}/500 characters</p>
                <div className="flex gap-3">
                  <button
                    className="rounded-2xl border border-[#dbe6b8] px-4 py-3 text-sm text-[#364331] transition hover:bg-[#f4efcf]"
                    onClick={() => {
                      setShowModal(false);
                      setEditComment(null);
                      setEditRating(5);
                    }}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                    onClick={handleSave}
                    type="button"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
