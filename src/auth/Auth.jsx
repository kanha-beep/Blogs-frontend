import React, { useState } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
export default function Auth({ setIsLoggedIn }) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((p) => ({ ...p, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // login
    if (isLogin) {
      try {
        console.log("login user", user);
        const res = await api.post("/auth/login", user);
        console.log("user logged in: ", res.data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setIsLoggedIn(true);
        navigate("/")
      } catch (e) {
        console.log("error login: ", e?.response?.data?.message);
        setIsLogin(false);
        setIsLoggedIn(false);
      }
      //register
    } else {
      try {
        console.log("register user", user);
        const res = await api.post("/auth/register", user);
        console.log("user registered in: ", res.data);
        setIsLogin(true);
        setIsLoggedIn(true);
      } catch (e) {
        console.log("error register: ", e?.response?.data?.message);
        setIsLogin(true);
        setIsLoggedIn(false);
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
                name="password"
                onChange={handleChange}
              />
            </div>
          )}

          <button className="btn btn-primary w-100 mt-2">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </small>
          <br />
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="btn btn-link text-decoration-none fw-semibold text-primary"
          >
            {isLogin ? "Create One" : "Login Instead"}
          </button>
        </div>
      </div>
    </div>
  );
}
