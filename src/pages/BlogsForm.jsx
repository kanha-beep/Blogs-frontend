import React, { useState } from "react";
import api from "../utils/api.js";
import { useToast } from "../components/ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";
export const BlogsForm = () => {
  const { showToast } = useToast();
  const [importing, setImporting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    image: null,
    category: [],
  });
  const [newsImport, setNewsImport] = useState({
    query: "",
    category: "news",
    limit: 5,
  });
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files && files.length > 0 ? files[0] : value,
    });
  };
  const handleNewsImportChange = (e) => {
    const { name, value } = e.target;
    setNewsImport((current) => ({
      ...current,
      [name]: name === "limit" ? Number(value) : value,
    }));
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
      const res = await api.post("/blogs/new", imageFormData);
      console.log("image uploaded: ", res?.data);
      window.location.href = "/";
    } catch (e) {
      console.log("error uploading image: ", e?.response?.data?.message);
      showToast({ title: "Publish failed", message: getErrorMessage(e) });
    }
  };
  const handleImportBlogs = async () => {
    try {
      setImporting(true);
      const res = await api.post("/blogs/import-news", {
        query: newsImport.query,
        category: newsImport.category,
        limit: newsImport.limit,
        author: formData.author,
      });
      showToast({
        title: "News imported",
        message: res?.data?.message || "Blogs created from news successfully",
        type: "success",
      });
      window.location.href = "/";
    } catch (e) {
      showToast({ title: "Import failed", message: getErrorMessage(e) });
    } finally {
      setImporting(false);
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
    <div className="min-vh-100 px-3 py-4 sm:px-4" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="mx-auto w-full max-w-5xl">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h3 className="text-center mb-4 fw-bold">
                  Create New Blog Post
                </h3>

                <div className="mb-4 rounded-3 border bg-light p-3">
                  <div className="mb-3">
                    <h5 className="mb-1 fw-bold">Import blogs from news API</h5>
                    <p className="mb-0 text-muted">
                      News title aur description ko combine karke har article ka auto blog create
                      hoga. OpenAI ki zarurat nahi hai.
                    </p>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-5">
                      <label className="form-label fw-semibold">Topic keyword</label>
                      <input
                        type="text"
                        name="query"
                        placeholder="AI, startup, cricket..."
                        value={newsImport.query}
                        onChange={handleNewsImportChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-6 col-md-4">
                      <label className="form-label fw-semibold">Category</label>
                      <input
                        type="text"
                        name="category"
                        placeholder="news"
                        value={newsImport.category}
                        onChange={handleNewsImportChange}
                        className="form-control"
                      />
                    </div>

                    <div className="col-6 col-md-3">
                      <label className="form-label fw-semibold">Count</label>
                      <input
                        type="number"
                        name="limit"
                        min="1"
                        max="10"
                        value={newsImport.limit}
                        onChange={handleNewsImportChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={handleImportBlogs}
                      disabled={importing}
                      className="btn btn-dark px-4 fw-semibold"
                    >
                      {importing ? "Importing blogs..." : "Generate blogs from news"}
                    </button>
                  </div>
                </div>

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
                          <span key={cat} className="badge bg-primary me-2">
                            {cat}
                          </span>
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
                    />
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary px-5 fw-semibold"
                    >
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
