"use client";

import React, { useState } from "react";
import api from "../utils/api.js";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import { useAuth } from "./AuthContext.jsx";

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation();
  const { showToast } = useToast();
  const { isLoggedIn, setAuthenticatedUser } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((p) => ({ ...p, [name]: value }));
  };
  const redirectPath = location.state?.from || "/";

  React.useEffect(() => {
    if (isLoggedIn) {
      navigate(redirectPath, { replace: true });
    }
  }, [isLoggedIn, navigate, redirectPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // login
    if (isLogin) {
      try {
        const res = await api.post("/auth/login", {
          email: user.email.trim(),
          password: user.password,
        });
        if (res?.data?.token) {
          window.localStorage.setItem("token", res.data.token);
        }
        setAuthenticatedUser(res?.data?.user || null);
        navigate(redirectPath, { replace: true });
      } catch (e) {
        console.log("error login: ", e?.response?.data?.message);
        window.localStorage.removeItem("token");
        setIsLogin(true);
        setAuthenticatedUser(null);
        showToast({ title: "Login failed", message: getErrorMessage(e, "Unable to log in") });
      } finally {
        setSubmitting(false);
      }
      //register
    } else {
      try {
        if (user.password !== user.confirmPassword) {
          showToast({
            title: "Registration failed",
            message: "Passwords do not match",
          });
          return;
        }

        await api.post("/auth/register", {
          name: user.name.trim(),
          email: user.email.trim(),
          password: user.password,
        });
        setIsLogin(true);
        setAuthenticatedUser(null);
        setUser({ name: "", email: "", password: "", confirmPassword: "" });
        showToast({
          title: "Registration successful",
          message: "Account created. Please log in to continue.",
          type: "success",
        });
      } catch (e) {
        console.log("error register: ", e?.response?.data?.message);
        window.localStorage.removeItem("token");
        setIsLogin(false);
        setAuthenticatedUser(null);
        showToast({
          title: "Registration failed",
          message: getErrorMessage(e, "Unable to create your account"),
        });
      } finally {
        setSubmitting(false);
      }
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-dark bg-gradient">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "380px" }}>
        <h3 className="text-center text-primary mb-3 fw-bold">
          {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
        </h3>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                name="name"
                onChange={handleChange}
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              name="password"
              onChange={handleChange}
            />
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm password"
                name="confirmPassword"
                value={user.confirmPassword}
                onChange={handleChange}
              />
            </div>
          )}

          <button className="btn btn-primary w-100 mt-2" disabled={submitting}>
            {submitting ? (isLogin ? "Login..." : "Register...") : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </small>
          <br />
          <button
            onClick={() => {
              setSwitching(true);
              setIsLogin(!isLogin);
              setTimeout(() => setSwitching(false), 300);
            }}
            className="btn btn-link text-decoration-none fw-semibold text-primary"
          >
            {switching ? (isLogin ? "Create One..." : "Login Instead...") : isLogin ? "Create One" : "Login Instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
