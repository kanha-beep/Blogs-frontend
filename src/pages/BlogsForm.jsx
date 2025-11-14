import React, { useState } from "react";
import api from "../utils/api.js";
export const BlogsForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    image: null,
    category: [],
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageFormData = new FormData();
    if (formData.image) {
      imageFormData.append("image", formData.image);
    }
    imageFormData.append("title", formData.title);
    imageFormData.append("author", formData.author);
    imageFormData.append("content", formData.content);
    imageFormData.append("category", formData.category);
    console.log(formData);
    try {
      const res = await api.post("/blogs/new", imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("image uploaded: ", res?.data);
      window.location.href = "/";
    } catch (e) {
      console.log("error uploading image: ", e?.response?.data?.message);
    }
  };
  const handleCategory = (e) => {
    const { value } = e.target;
    if (!formData.category.includes(value)) {
      setFormData({
        ...formData,
        category: [...formData.category, value],
      });
    }
  };
  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h3 className="text-center mb-4 fw-bold">Create New Blog Post</h3>

                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-12 col-md-6 mb-3 mb-md-0">
                      <label className="form-label fw-semibold">Title</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Enter blog title"
                        value={formData.title}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold">Author</label>
                      <input
                        type="text"
                        name="author"
                        placeholder="Your name"
                        value={formData.author}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Content</label>
                    <textarea
                      name="content"
                      placeholder="Write your blog content here..."
                      value={formData.content}
                      onChange={handleChange}
                      className="form-control"
                      rows="6"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleCategory}
                      className="form-select"
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      <option value="design">Design</option>
                      <option value="research">Research</option>
                      <option value="software">Software</option>
                    </select>
                    {formData.category?.length > 0 && (
                      <div className="mt-2">
                        {formData.category.map((cat) => (
                          <span key={cat} className="badge bg-primary me-2">{cat}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Blog Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary px-5 fw-semibold">
                      Publish Blog
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
