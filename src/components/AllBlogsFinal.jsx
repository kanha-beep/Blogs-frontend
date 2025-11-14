import { useState } from "react";
import React, { useEffect } from "react";
import RecentBlogs from "./RecentBlogs.jsx";
import AllBlogs from "./AllBlogs.jsx";
import api from "../utils/api.js";
export default function AllBlogsFinal() {
  const [currentUser, setCurrentUser] = useState({ name: "", id: "" });
  const [totalPage, setTotalPage] = useState(0);
  const [page, setPage] = useState(1);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [sort, setSort] = useState("");
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setCurrentUser(res?.data?.user);
        // console.log("current user: ", res?.data?.user);
      } catch (error) {
        console.log("error user: ", error?.response?.data?.message);
      }
    };
    getCurrentUser();
  }, []);
  useEffect(() => {
    const getRecentBlogs = async () => {
      try {
        const res = await api.get(`/blogs/recent?sort=${sort}`);
        console.log("recent blogs final: ", res?.data);
        setRecentBlogs(res?.data);
      } catch (error) {
        console.log("error: ", error?.response?.data?.message);
      }
    };
    getRecentBlogs();
  }, [sort]);
  useEffect(() => {
    const getAllBlogs = async () => {
      try {
        const res = await api.get(`/blogs/all?sort=${sort}&page=${page}`);
        console.log("all blogs final: ", res?.data);
        setBlogs(res?.data?.blogs);
        setTotalPage(Math.ceil(res?.data?.totalBlogs / 3));
        setPage(parseInt(res?.data?.page));
      } catch (error) {
        console.log("error: ", error?.response?.data?.message);
      }
    };
    getAllBlogs();
  }, [sort, page]);
  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container-fluid py-4">
        {currentUser.name && (
          <div className="alert alert-info border-0 shadow-sm mb-4" role="alert">
            <div className="d-flex align-items-center">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: "50px", height: "50px", fontSize: "1.5rem" }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h6 className="mb-0 fw-semibold">Welcome back, {currentUser.name}!</h6>
                <small className="text-muted">Start exploring and sharing your stories</small>
              </div>
            </div>
          </div>
        )}

        <div className="row mb-4">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <label className="form-label fw-semibold text-dark mb-2">
                  <i className="bi bi-funnel"></i> Filter by Category
                </label>
                <select
                  name="category"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="form-select shadow-sm"
                >
                  <option value="" disabled>
                    Select Category
                  </option>
                  <option value="all">All Categories</option>
                  <option value="design">Design</option>
                  <option value="research">Research</option>
                  <option value="software">Software</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <RecentBlogs blogs={recentBlogs} />
        <AllBlogs blogs={blogs} />

        <div className="d-flex justify-content-center align-items-center gap-3 my-5">
          <button
            className="btn btn-primary px-4 shadow-sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            <i className="bi bi-arrow-left"></i> Previous
          </button>
          <span className="badge bg-dark px-4 py-2 fs-6">Page {page} of {totalPage}</span>
          <button
            className="btn btn-primary px-4 shadow-sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPage))}
            disabled={page === totalPage}
          >
            Next <i className="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
