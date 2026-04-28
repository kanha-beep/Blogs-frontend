"use client";

import Navbar from "./components/Navbar";
import AllBlogsFinal from "./components/AllBlogsFinal";
import { Routes, Route } from "react-router-dom";
import Auth from "./auth/Auth.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Profile from "./views/Profile.jsx";
import Contacts from "./views/Contacts.jsx";
import { BlogsForm } from "./views/BlogsForm.jsx";
// import { SingleBlogs } from "./views/SingleBlogs.jsx";
import SingleBlogsFinal from "./views/SingleBlogsFinal.jsx";
import { EditBlogs } from "./views/EditBlogs.jsx";
import { BlogsComments } from "./views/BlogsComments.jsx";
import { ToastProvider } from "./components/ToastProvider.jsx";
function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<AllBlogsFinal />} />
          <Route path="/:id" element={<SingleBlogsFinal />} />
          <Route
            path="/:id/edit"
            element={
              <ProtectedRoute>
                <EditBlogs />
              </ProtectedRoute>
            }
          />
          <Route path="/:id/comments" element={<SingleBlogsFinal />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/contacts" element={<Contacts />} />
          <Route
            path="/blogsform"
            element={
              <ProtectedRoute>
                <BlogsForm />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
