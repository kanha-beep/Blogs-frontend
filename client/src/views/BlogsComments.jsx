"use client";

import React, { useEffect, useMemo, useState } from "react";
import api from "../utils/api.js";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import { useAuth } from "../auth/AuthContext.jsx";

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
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [editComment, setEditComment] = useState(null);
  const [newText, setNewText] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [replyingTo, setReplyingTo] = useState("");
  const [replyTextByComment, setReplyTextByComment] = useState({});
  const [replySubmittingId, setReplySubmittingId] = useState("");

  const fetchComments = async () => {
    try {
      const res = await api.get(`/blogs/${id}/comments`);
      setComments(res.data.comments || []);
    } catch (e) {
      console.log("Error fetching comments:", e?.response?.data?.message);
      showToast({ title: "Comments failed", message: getErrorMessage(e) });
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
      setRedirecting(true);
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
      showToast({ title: "Comment failed", message: getErrorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      setDeletingId(commentId);
      await api.delete(`/blogs/${id}/comments/${commentId}`);
      fetchComments();
    } catch (e) {
      console.log("Error deleting comment:", e?.response?.data?.message);
      showToast({ title: "Delete failed", message: getErrorMessage(e) });
    } finally {
      setDeletingId("");
    }
  };

  const handleReplySubmit = async (commentId) => {
    const replyText = replyTextByComment[commentId]?.trim();

    if (!currentUser) {
      setRedirecting(true);
      navigate("/auth");
      return;
    }

    if (!replyText) return;

    try {
      setReplySubmittingId(commentId);
      await api.post(`/blogs/${id}/comments/${commentId}/replies`, {
        content: replyText,
      });
      setReplyTextByComment((prev) => ({ ...prev, [commentId]: "" }));
      setReplyingTo("");
      fetchComments();
    } catch (e) {
      console.log("Error adding reply:", e?.response?.data?.message);
      showToast({ title: "Reply failed", message: getErrorMessage(e) });
    } finally {
      setReplySubmittingId("");
    }
  };

  const handleSave = async () => {
    if (!newText.trim()) {
      showToast({ title: "Update failed", message: "Comment content is required" });
      return;
    }

    try {
      setSavingEdit(true);
      await api.patch(`/blogs/${id}/comments/${editComment?._id}`, {
        content: newText.trim(),
        rating: editRating,
      });
      fetchComments();
      setShowModal(false);
      setEditComment(null);
      setNewText("");
      setEditRating(5);
    } catch (e) {
      console.log("Error updating comment:", e?.response?.data?.message);
      showToast({ title: "Update failed", message: getErrorMessage(e) });
      setShowModal(false);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <section className="dashboard-panel rounded-none border-x-0 p-3 sm:rounded-[32px] sm:border sm:p-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="rounded-full border border-[#dbe6b8] bg-[#fff9df] px-4 py-2 text-sm text-[#364331]">
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </div>
          <div className="rounded-full border border-[#c9ddd5] bg-[#e5f2ed] px-4 py-2 text-sm text-[#2d4b3f]">
            {uniqueVoices} people{uniqueVoices === 1 ? "" : "s"}
          </div>
          <div className="rounded-full border border-[#ecd8a0] bg-[#fff3c8] px-4 py-2 text-sm text-[#7a5621]">
            {averageRating} avg rating
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#dbe6b8] bg-[#fffdf4] px-3 py-2">
            <span className="text-[11px] uppercase tracking-[0.16em] text-[#465240]">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-sm text-slate-900 outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:mt-6 sm:gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <aside className="space-y-5">
          <div className="rounded-[30px] border border-[#dbe6b8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,232,0.96))] p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#465240]">
                  Add a comment
                </p>
              </div>
              <div className="rounded-2xl border border-[#dbe6b8] bg-[#fff9df] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[#465240]">
                {commentText.trim().length}/500
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-3 sm:mt-4">
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
                className="min-h-[150px] w-full rounded-[24px] border border-[#dbe6b8] bg-[#fffdf4] px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-[#5c6756] focus:border-[#a8cb73] sm:min-h-[170px] sm:rounded-[28px] sm:px-4 sm:py-4 sm:leading-7"
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
                <p className="text-xs leading-5 text-[#4f5c46]">Keep it clear and respectful.</p>
                <button
                  type="submit"
                  disabled={submitting || (!currentUser ? false : !commentText.trim())}
                  className="rounded-2xl bg-[#a8cb73] px-5 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {currentUser
                    ? submitting
                      ? "Publishing..."
                      : "Publish comment"
                    : redirecting
                      ? "Sign in to comment..."
                      : "Sign in to comment"}
                </button>
              </div>
            </form>
          </div>

        </aside>

        <div className="space-y-4 sm:space-y-5">
          {sortedComments.length === 0 ? (
            <div className="rounded-[30px] border border-dashed border-[#dbe6b8] bg-[#fffdf4] p-4 text-center">
              <p className="font-display text-2xl text-slate-900">No comments yet</p>
              <p className="mt-2 text-sm text-[#465240]">
                Be the first to comment.
              </p>
            </div>
          ) : (
            sortedComments.map((comment, index) => {
              const isAuthor = currentUser?._id && comment?.user?._id === currentUser?._id;

              return (
                <article
                  key={comment._id}
                  className="group rounded-[24px] border border-[#dbe6b8] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,247,232,0.96))] p-3 transition hover:border-[#c8d79f] sm:rounded-[30px] sm:p-5"
                >
                  <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#eef7cc] text-xs font-semibold text-[#547047] sm:h-12 sm:w-12 sm:text-sm">
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

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#4f5c46] sm:gap-3 sm:text-xs sm:tracking-[0.16em]">
                          <span>{formatCommentDate(comment?.createdAt)}</span>
                          <span>{Number(comment?.rating) || 5}/5 stars</span>
                          <span>{comment?.content?.length || 0} chars</span>
                        </div>

                        <div className="mt-2 flex items-center gap-1 text-amber-200 sm:mt-3">
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

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#2e3a29] sm:mt-4 sm:leading-7">
                          {comment?.content}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setReplyingTo((prev) => (prev === comment._id ? "" : comment._id))
                            }
                            className="rounded-full border border-[#dbe6b8] px-3 py-1.5 text-xs font-medium text-[#53604f] transition hover:bg-[#f4efcf]"
                          >
                            Reply
                          </button>
                          {comment?.replies?.length > 0 && (
                            <span className="text-xs text-[#465240]">
                              {comment.replies.length} repl{comment.replies.length === 1 ? "y" : "ies"}
                            </span>
                          )}
                        </div>

                        {replyingTo === comment._id && (
                          <div className="mt-4 rounded-[22px] border border-[#dbe6b8] bg-[#fffdf4] p-3">
                            <textarea
                              value={replyTextByComment[comment._id] || ""}
                              onChange={(e) =>
                                setReplyTextByComment((prev) => ({
                                  ...prev,
                                  [comment._id]: e.target.value,
                                }))
                              }
                              maxLength={300}
                              rows="3"
                              placeholder="Write a reply..."
                              className="w-full rounded-[18px] border border-[#dbe6b8] bg-white px-3 py-3 text-sm text-slate-900 outline-none transition focus:border-[#a8cb73]"
                            />
                            <div className="mt-3 flex items-center justify-between gap-3">
                              <p className="text-xs text-[#465240]">
                                {(replyTextByComment[comment._id] || "").trim().length}/300
                              </p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyingTo("");
                                    setReplyTextByComment((prev) => ({
                                      ...prev,
                                      [comment._id]: "",
                                    }));
                                  }}
                                  className="rounded-2xl border border-[#dbe6b8] px-3 py-2 text-sm text-[#364331] transition hover:bg-[#f4efcf]"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    replySubmittingId === comment._id ||
                                    !(replyTextByComment[comment._id] || "").trim()
                                  }
                                  onClick={() => handleReplySubmit(comment._id)}
                                  className="rounded-2xl bg-[#a8cb73] px-4 py-2 text-sm font-semibold text-[#24311f] transition hover:bg-[#9fc46b] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  {replySubmittingId === comment._id ? "Posting..." : "Post reply"}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {comment?.replies?.length > 0 && (
                          <div className="mt-4 space-y-3 border-l-2 border-[#dbe6b8] pl-4">
                            {comment.replies.map((reply) => (
                              <div
                                key={reply._id}
                                className="rounded-[20px] border border-[#dbe6b8] bg-[#fffdf4] p-3"
                              >
                                <div className="flex flex-wrap items-center gap-2 text-xs text-[#465240]">
                                  <span className="font-medium text-slate-900">
                                    {reply?.user?.name || "Anonymous"}
                                  </span>
                                  <span>{formatCommentDate(reply?.createdAt)}</span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-[#2e3a29]">
                                  {reply?.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {isAuthor && (
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <button
                          disabled={savingEdit}
                          className="rounded-2xl border border-[#dbe6b8] px-3 py-2 text-sm text-[#53604f] transition hover:bg-[#f4efcf] sm:px-4"
                          onClick={() => {
                            setEditComment(comment);
                            setNewText(comment.content);
                            setEditRating(Number(comment?.rating) || 5);
                            setShowModal(true);
                          }}
                          type="button"
                        >
                          {savingEdit && editComment?._id === comment._id ? "Edit..." : "Edit"}
                        </button>

                        <button
                          disabled={deletingId === comment?._id}
                          className="rounded-2xl border border-[#f0d49e] bg-[#fff1cd] px-3 py-2 text-sm text-[#8b5a2b] transition hover:bg-[#fde8b7] sm:px-4"
                          onClick={() => handleDelete(comment?._id)}
                          type="button"
                        >
                          {deletingId === comment?._id ? "Delete..." : "Delete"}
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
              Update your comment before saving.
            </p>
            <div className="mt-5">
              <div className="mb-4">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#465240]">
                  Change rating
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
                      setNewText("");
                      setEditRating(5);
                    }}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={savingEdit}
                    className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
                    onClick={handleSave}
                    type="button"
                  >
                    {savingEdit ? "Save changes..." : "Save changes"}
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
