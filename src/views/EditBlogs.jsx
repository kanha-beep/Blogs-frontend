"use client";

import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";
import { getErrorMessage } from "../utils/getErrorMessage.js";
import SmartImage from "../components/SmartImage.jsx";
export const EditBlogs = () => {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { showToast } = useToast();
  // const [catgoryArray, setCategoryArray] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    image: null,
    imageUrl: "",
    removeImage: false,
    category: [],
  });

  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}/edit`);
        const blog = res?.data || {};
        setFormData({
          title: blog.title || "",
          author: blog.author || "",
          content: blog.content || "",
          image: null,
          imageUrl: blog.url || "",
          removeImage: false,
          category: Array.isArray(blog.category) ? blog.category : [],
        });
      } catch (e) {
        const message = getErrorMessage(e);
        setMsg(message);
        showToast({ title: "Blog load failed", message });
      } finally {
        setLoading(false);
      }
    };
    getSingleBlog();
  }, [id, showToast]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files && files.length > 0 ? files[0] : value,
      ...(name === "image" ? { removeImage: false } : {}),
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim() || !formData.content.trim() || formData.category.length === 0) {
      showToast({ title: "Update failed", message: "Please complete all required fields" });
      return;
    }

    const imageFormData = new FormData();
    if (formData.image) {
      imageFormData.append("image", formData.image);
    }
    imageFormData.append("removeImage", String(formData.removeImage));
    imageFormData.append("title", formData.title.trim());
    imageFormData.append("author", formData.author.trim());
    imageFormData.append("content", formData.content.trim());
    formData.category.forEach((item) => imageFormData.append("category", item));
    try {
      setSubmitting(true);
      await api.patch(`/blogs/${id}/edit`, imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (e) {
      showToast({ title: "Update failed", message: getErrorMessage(e) });
    } finally {
      setSubmitting(false);
    }
  };
  const handleCategory = (e) => {
    const { value } = e.target;
    if (value && !formData.category.includes(value)) {
      setFormData({
        ...formData,
        category: [...formData.category, value],
      });
    }
  };
  const handleRemoveImage = () => {
    setFormData((current) => ({
      ...current,
      image: null,
      imageUrl: "",
      removeImage: true,
    }));
  };
  return (
    <div className="min-vh-100 px-3 py-4 sm:px-4" style={{ backgroundColor: "#f8f9fa" }}>
      {loading ? null : msg !== "" ? (
        `${msg}`
      ) : (
        <>
          <div className="mx-auto w-full max-w-5xl">
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4 p-md-5">
                    <h3 className="text-center mb-4 fw-bold">Edit Blog Post</h3>

                    <form onSubmit={handleSubmit}>
                      <div className="row mb-3">
                        <div className="col-12 col-md-6 mb-3 mb-md-0">
                          <label className="form-label fw-semibold">
                            Title
                          </label>
                          <input
                            type="text"
                            name="title"
                            placeholder="Blog title"
                            value={formData.title}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">
                            Author
                          </label>
                          <input
                            type="text"
                            name="author"
                            placeholder="Author name"
                            value={formData.author}
                            onChange={handleChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Content
                        </label>
                        <textarea
                          name="content"
                          placeholder="Write your content here..."
                          value={formData.content}
                          onChange={handleChange}
                          className="form-control"
                          rows="6"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Category
                        </label>
                        <select
                          name="category"
                          value=""
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
                            {formData.category.map((cat, idx) => (
                              <span key={idx} className="badge bg-primary me-2">
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-semibold">
                          Blog Image
                        </label>
                        {formData.imageUrl && !formData.removeImage && (
                          <div className="mb-3 overflow-hidden rounded-4 border">
                            <SmartImage
                              src={formData.imageUrl}
                              alt={formData.title || "Current blog image"}
                              fallbackLabel="Current image"
                              className="h-[16rem] w-full object-cover"
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className="form-control"
                        />
                        <div className="mt-2 d-flex flex-wrap gap-2 align-items-center">
                          <small className="text-muted">
                            Leave empty to keep current image
                          </small>
                          {formData.imageUrl && !formData.removeImage && (
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={handleRemoveImage}
                            >
                              Remove current image
                            </button>
                          )}
                          {formData.removeImage && (
                            <small className="text-danger">
                              Current image will be removed when you update the blog.
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          type="submit"
                          disabled={submitting}
                          className="btn btn-primary px-5 fw-semibold"
                        >
                          {submitting ? "Updating..." : "Update Blog"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary px-4"
                          onClick={() => navigate("/")}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
