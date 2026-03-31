import Navbar from "./components/Navbar";
import AllBlogsFinal from "./components/AllBlogsFinal";
import { Routes, Route } from "react-router-dom";
import Auth from "./auth/Auth.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Contacts from "./pages/Contacts.jsx";
import { BlogsForm } from "./pages/BlogsForm.jsx";
// import { SingleBlogs } from "./pages/SingleBlogs.jsx";
import SingleBlogsFinal from "./pages/SingleBlogsFinal.jsx";
import { EditBlogs } from "./pages/EditBlogs.jsx";
import { BlogsComments } from "./pages/BlogsComments.jsx";
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
