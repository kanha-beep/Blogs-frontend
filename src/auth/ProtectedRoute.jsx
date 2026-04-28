"use client";

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { authReady, isLoggedIn } = useAuth();

  if (!authReady) {
    return null;
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/auth"
        replace
        state={{ from: `${location.pathname}${location.search}${location.hash}` }}
      />
    );
  }

  return children;
}

