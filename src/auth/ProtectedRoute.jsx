"use client";

import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { authReady, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!authReady || isLoggedIn) {
      return;
    }

    navigate("/auth", {
      replace: true,
      state: { from: `${location.pathname}${location.search}${location.hash || ""}` },
    });
  }, [authReady, isLoggedIn, location.hash, location.pathname, location.search, navigate]);

  if (!authReady) {
    return (
      <div className="mx-auto mt-8 w-full max-w-3xl px-4">
        <div className="dashboard-panel p-5 text-center text-[#465240]">
          Checking your session...
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="mx-auto mt-8 w-full max-w-3xl px-4">
        <div className="dashboard-panel p-5 text-center text-[#465240]">
          Redirecting to sign in...
        </div>
      </div>
    );
  }

  return children;
}
