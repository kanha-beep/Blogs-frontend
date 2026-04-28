"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { setUnauthorizedHandler } from "../utils/api.js";
import { useToast } from "../components/ToastProvider.jsx";

const AuthContext = createContext(null);

const protectedPaths = ["/dashboard", "/profile", "/blogsform"];

function isProtectedPath(pathname = "") {
  return protectedPaths.includes(pathname) || /^\/[^/]+\/edit$/.test(pathname);
}

function normalizeUnauthorizedMessage(message) {
  if (!message || message === "Authorization header missing") {
    return "Session expired. Please log in again.";
  }

  return message;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  const handleUnauthorized = useCallback(
    (error) => {
      window.localStorage.removeItem("token");
      setUser(null);
      setAuthReady(true);

      if (location.pathname !== "/auth") {
        showToast({
          title: "Session expired",
          message: normalizeUnauthorizedMessage(error?.response?.data?.message),
        });
        navigate("/auth", {
          replace: true,
          state: { from: `${location.pathname}${location.search}${location.hash}` },
        });
      }
    },
    [location.hash, location.pathname, location.search, navigate, showToast],
  );

  const refreshAuth = useCallback(
    async ({ redirectOnFail = false } = {}) => {
      const token = window.localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setAuthReady(true);
        return null;
      }

      try {
        const res = await api.get("/auth/me", {
          skipAuthRedirect: true,
        });
        setUser(res?.data?.user || null);
        return res?.data?.user || null;
      } catch (error) {
        window.localStorage.removeItem("token");
        setUser(null);

        if (redirectOnFail) {
          handleUnauthorized(error);
        } else {
          setAuthReady(true);
        }

        return null;
      } finally {
        setAuthReady(true);
      }
    },
    [handleUnauthorized],
  );

  useEffect(() => {
    setUnauthorizedHandler(handleUnauthorized);
    return () => setUnauthorizedHandler(null);
  }, [handleUnauthorized]);

  useEffect(() => {
    refreshAuth({ redirectOnFail: isProtectedPath(location.pathname) });
  }, [location.pathname, refreshAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", null, { skipAuthRedirect: true });
    } catch (error) {
      console.log("logout error:", error?.response?.data?.message || error.message);
    } finally {
      window.localStorage.removeItem("token");
      setUser(null);
      setAuthReady(true);
      navigate("/auth", { replace: true });
    }
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      authReady,
      refreshAuth,
      setAuthenticatedUser: setUser,
      logout,
    }),
    [authReady, logout, refreshAuth, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

