"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GoToHomePageButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        navigate("/");
      }}
      disabled={loading}
      className="w-full rounded-2xl bg-[#a8cb73] px-4 py-3 text-sm font-semibold text-[#24311f] transition hover:scale-[1.01] hover:bg-[#9fc46b] sm:w-auto"
    >
      {loading ? "Back to homepage..." : "Back to homepage"}
    </button>
  );
}
