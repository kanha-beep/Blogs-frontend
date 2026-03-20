import React from "react";
import { BlogsComments } from "./BlogsComments";
import { SingleBlogs } from "./SingleBlogs";
import { useState } from "react";

export default function SingleBlogsFinal() {
  const [ID, setID] = useState("");

  return (
    <div className="container">
      <div className="min-vh-100 py-8" style={{ backgroundColor: "#f8f9fa" }}>
        <SingleBlogs ID={ID} setID={setID} />
        <BlogsComments ID={ID} setID={setID} />
      </div>
    </div>
  );
}
