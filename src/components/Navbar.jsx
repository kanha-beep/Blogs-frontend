// ✅ Navbar.jsx (Corrected)
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";

export default function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  console.log("navbar: ", isLoggedIn);
  const [open, setOpen] = useState(false);
  const handleNav = (path) => {
    setOpen(false);
    navigate(path);
  };
  return (
    <>
      <nav className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-cyan-400">
            Blog Posts
          </Link>

          <button className="lg:hidden text-2xl" onClick={() => setOpen(!open)}>
            {open ? "✕" : "☰"}
          </button>

          <ul className="hidden lg:flex gap-6 items-center">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => handleNav("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/profile" onClick={() => handleNav("/profile")}>
                  Profile
                </Link>
                <Link to="/blogsform" onClick={() => handleNav("/blogsform")}>
                  Create
                </Link>
                <Link to="/contacts" onClick={() => handleNav("/contacts")}>
                  Contacts
                </Link>
                <button
                  onClick={() => {
                    localStorage.clear();
                    setIsLoggedIn(false);
                    navigate("/auth");
                  }}
                  className="bg-gray-700 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => handleNav("/auth")}>
                  Register
                </Link>
                <Link to="/auth" onClick={() => handleNav("/auth")}>
                  Login
                </Link>
              </>
            )}
          </ul>
        </div>

        {open && (
          <ul className="lg:hidden flex flex-col gap-3 px-4 pb-4">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard" onClick={() => handleNav("/dashboard")}>
                  Dashboard
                </Link>
                <Link to="/profile" onClick={() => handleNav("/profile")}>
                  Profile
                </Link>
                <Link to="/blogsform" onClick={() => handleNav("/blogsform")}>
                  Create
                </Link>
                <Link to="/contacts" onClick={() => handleNav("/contacts")}>
                  Contacts
                </Link>
                <button
                  onClick={() => {
                    localStorage.clear();
                    setIsLoggedIn(false);
                    navigate("/auth");
                  }}
                  className="bg-gray-700 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => handleNav("/auth")}>
                  Register
                </Link>
                <Link to="/auth" onClick={() => handleNav("/auth")}>
                  Login
                </Link>
              </>
            )}
          </ul>
        )}
      </nav>
    </>
  );
}
