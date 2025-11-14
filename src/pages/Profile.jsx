import React, { useState, useEffect } from "react";
import api from "../utils/api.js";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res?.data?.user);
      } catch (error) {
        console.log("error user: ", error?.response?.data?.message);
      }
    };
    getCurrentUser();
  }, []);

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '100px', height: '100px', fontSize: '2.5rem' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <h2 className="fw-bold mb-1">{user?.name || 'User'}</h2>
                  <p className="text-muted">{user?.email || 'user@example.com'}</p>
                </div>

                <hr className="my-4" />

                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Full Name</label>
                  <div className="form-control bg-light">{user?.name || 'Loading...'}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label text-muted small fw-semibold">Email Address</label>
                  <div className="form-control bg-light">{user?.email || 'Loading...'}</div>
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted small fw-semibold">User ID</label>
                  <div className="form-control bg-light" style={{ fontSize: '0.875rem' }}>{user?._id || 'Loading...'}</div>
                </div>

                <button className="btn btn-primary w-100">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
