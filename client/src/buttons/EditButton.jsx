"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Edit({ id }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        navigate(`/${id}/edit`);
      }}
      disabled={loading}
      className="w-full rounded-2xl border border-[#dbe6b8] bg-[#fffdf4] px-4 py-3 text-sm font-medium text-[#364331] transition hover:bg-[#f4efcf] sm:w-auto"
    >
      {loading ? "Edit story..." : "Edit story"}
    </button>
  );
}
