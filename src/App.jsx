import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AllBlogsFinal from "./components/AllBlogsFinal";
import { Routes, Route } from "react-router-dom";
import Auth from "./auth/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Contacts from "./pages/Contacts.jsx";
import { BlogsForm } from "./pages/BlogsForm.jsx";
// import { SingleBlogs } from "./pages/SingleBlogs.jsx";
import SingleBlogsFinal from "./pages/SingleBlogsFinal.jsx";
import { EditBlogs } from "./pages/EditBlogs.jsx";
import { BlogsComments } from "./pages/BlogsComments.jsx";
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    }
  }, [isLoggedIn, token]);
  useEffect(() => {
    console.log("app: ", isLoggedIn);
  }, []);
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path="/" element={<AllBlogsFinal />} />
        <Route path="/:id/comments" element={<SingleBlogsFinal />} />
        <Route path="/:id/edit" element={<EditBlogs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/blogsform" element={<BlogsForm />} />
        <Route
          path="/auth"
          element={
            <Auth isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
      </Routes>
    </>
  );
}

export default App;
