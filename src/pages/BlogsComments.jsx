import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useParams } from "react-router-dom";

export const BlogsComments = () => {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editComment, setEditComment] = useState(null); // ✅ track selected comment
  const [newText, setNewText] = useState("");
  const [showModal, setShowModal] = useState(false); // ✅ control modal visibility

  // ✅ fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get(`/blogs/${id}/comments`);
      setComments(res.data.comments);
    } catch (e) {
      console.log("Error fetching comments:", e?.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // ✅ add comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/blogs/${id}/comments`, { content: commentText });
      setCommentText("");
      fetchComments();
    } catch (e) {
      console.log("Error adding comment:", e?.response?.data?.message);
    }
  };

  // ✅ delete comment
  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/blogs/${id}/comments/${commentId}`);
      fetchComments();
    } catch (e) {
      console.log("Error deleting comment:", e?.response?.data?.message);
      alert(e?.response?.data?.message)
    }
  };

  // ✅ save edited comment
  const handleSave = async () => {
    try {
      await api.patch(`/blogs/${id}/comments/${editComment?._id}`, {
        content: newText,
      });
      fetchComments();
      setShowModal(false);
      setEditComment(null); // ✅ reset states
    } catch (e) {
      console.log("Error updating comment:", e?.response?.data?.message);
      alert(e?.response?.data?.message);
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4>Comments</h4>

      {/* ✅ add comment form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <textarea
          name="content"
          className="form-control mb-2"
          placeholder="Write your comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows="3"
        />
        <button type="submit" className="btn btn-primary">
          Add Comment
        </button>
      </form>

      {/* ✅ comments list */}
      <div>
        {comments.length === 0 && "No Comments Yet..."}
        {comments.map((c) => (
          <div
            key={c._id}
            className="border p-2 mb-2 rounded d-flex justify-content-between"
          >
            <div>
              Name: <b>{c?.user?.name || "Anonymous"}</b>
            </div>
            <div>Comment: {c?.content}</div>
            <div
              className="d-flex justify-content-evenly"
              style={{ width: "12rem" }}
            >
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setEditComment(c); // ✅ store selected comment
                  setNewText(c.content);
                  setShowModal(true);
                }}
              >
                Edit
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => handleDelete(c?._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ single modal outside map, uses editComment */}
      {showModal && editComment && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content p-3">
              <h5>Edit Comment</h5>
              <textarea
                className="form-control mb-3"
                rows="3"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowModal(false);
                    setEditComment(null); // ✅ close modal properly
                  }}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
