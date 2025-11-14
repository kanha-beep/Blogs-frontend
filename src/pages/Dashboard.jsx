import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { useState } from "react";
export default function Dashboard() {
  const [blogsNumber, setBlogsNumber] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const getNumbers = async () => {
      const res = await api.get("/blogs/all");
      console.log(res?.data);
      setBlogsNumber(res?.data?.totalBlogs);
    };
    getNumbers();
  }, []);
  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold mb-3">Dashboard</h1>
              <p className="text-muted">Manage your blog and explore content</p>
            </div>

            <div className="row g-4">
              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="card border-0 shadow-sm h-100 text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  <div className="card-body py-4">
                    <div className="mb-3">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                        style={{ width: "60px", height: "60px" }}
                      >
                        <i className="bi bi-journal-text text-primary fs-4"></i>
                      </div>
                    </div>
                    <h5 className="card-title fw-semibold mb-2">All Blogs</h5>
                    <p className="text-muted small mb-0">
                      Browse <b>{blogsNumber}</b> posts
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="card border-0 shadow-sm h-100 text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/blogsform")}
                >
                  <div className="card-body py-4">
                    <div className="mb-3">
                      <div
                        className="rounded-circle bg-success bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                        style={{ width: "60px", height: "60px" }}
                      >
                        <i className="bi bi-plus-circle text-success fs-4"></i>
                      </div>
                    </div>
                    <h5 className="card-title fw-semibold mb-2">Create Blog</h5>
                    <p className="text-muted small mb-0">Write new post</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="card border-0 shadow-sm h-100 text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/profile")}
                >
                  <div className="card-body py-4">
                    <div className="mb-3">
                      <div
                        className="rounded-circle bg-info bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                        style={{ width: "60px", height: "60px" }}
                      >
                        <i className="bi bi-person text-info fs-4"></i>
                      </div>
                    </div>
                    <h5 className="card-title fw-semibold mb-2">Profile</h5>
                    <p className="text-muted small mb-0">View your profile</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-3">
                <div
                  className="card border-0 shadow-sm h-100 text-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/contacts")}
                >
                  <div className="card-body py-4">
                    <div className="mb-3">
                      <div
                        className="rounded-circle bg-warning bg-opacity-10 d-inline-flex align-items-center justify-content-center"
                        style={{ width: "60px", height: "60px" }}
                      >
                        <i className="bi bi-envelope text-warning fs-4"></i>
                      </div>
                    </div>
                    <h5 className="card-title fw-semibold mb-2">Contacts</h5>
                    <p className="text-muted small mb-0">Get in touch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
