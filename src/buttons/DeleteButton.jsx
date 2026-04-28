"use client";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import { useToast } from "../components/ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";

export default function DeleteButton() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const deleteBlogs = async () => {
    try {
      setLoading(true);
      await api.delete(`/blogs/${id}/delete`);
      navigate("/");
    } catch (e) {
      showToast({ title: "Delete failed", message: getErrorMessage(e) });
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      className="w-full rounded-2xl border border-[#f0d49e] bg-[#fff1cd] px-4 py-3 text-sm font-medium text-[#8b5a2b] transition hover:bg-[#fde8b7] sm:w-auto"
      onClick={deleteBlogs}
    >
      {loading ? "Delete story..." : "Delete story"}
    </button>
  );
}
