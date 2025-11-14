import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../utils/api";
import { SingleBlogsCards } from "../cards/SingleBlogsCards";
export const SingleBlogs = ({ setID }) => {
  const [user, setUser] = useState("")
  const [blogs, setBlogs] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    setID(id);
  }, [id]);
  // console.log("ID", id, "of single blogs");

  // console.log("ID", ID, "old")
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}/comments`);
        console.log("single blog: ", res?.data);
        setUser(res?.data?.user?._id)
        setBlogs(res?.data);
      } catch (error) {
        console.log(error?.response?.data, "Single Blogs");
      }
    };
    getSingleBlog();
  }, []);

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-4">
        {blogs ? (
          <>
            <SingleBlogsCards blogs={blogs} user={user}/>
          </>
        ) : (
          "Loading..."
        )}
      </div>
    </div>
  );
};
