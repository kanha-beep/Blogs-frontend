import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useNavigate, useParams } from "react-router-dom";
export const EditBlogs = () => {
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    content: "",
    image: null,
    category: [],
  });
  console.log("id", id);
  console.log("formData", formData);
  //single blog
  useEffect(() => {
    const getSingleBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}/edit`);
        console.log("single blog: ", res?.data);
        setFormData(res?.data);
      } catch (e) {
        console.log(
          "error fetching single blog to edit: ",
          e?.response?.data?.message
        );
        setMsg(e?.response?.data?.message);
      }
    };
    getSingleBlog();
  }, []);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files && files.length > 0 ? files[0] : value,
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
    imageFormData.append("category", formData.category.join(""));
    console.log(formData);
    try {
      const res = await api.patch(`/blogs/${id}/edit`, imageFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("updated: ", res?.data);
      navigate("/");
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
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#f8f9fa" }}>
      {msg !== "" ? (
        `${msg}`
      ) : (
        <>
          <div className="container">
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
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className="form-control"
                        />
                        <small className="text-muted">
                          Leave empty to keep current image
                        </small>
                      </div>

                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          type="submit"
                          className="btn btn-primary px-5 fw-semibold"
                        >
                          Update Blog
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
