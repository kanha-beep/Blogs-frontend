import React, { useState } from "react";

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-vh-100 py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold mb-3">Get In Touch</h1>
              <p className="text-muted">
                Have questions? We'd love to hear from you.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-12 col-lg-5">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Contact Information</h5>

                    <div className="d-flex align-items-start mb-4">
                      <div
                        className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "48px",
                          height: "48px",
                          minWidth: "48px",
                        }}
                      >
                        <i className="bi bi-envelope text-primary fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Email</h6>
                        <p className="text-muted mb-0 small">
                          <a
                            href="https://mail.google.com/mail/?view=cm&to=kanhashree2223@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none text-muted"
                          >
                            kanhashree2223@gmail.com
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start mb-4">
                      <div
                        className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "48px",
                          height: "48px",
                          minWidth: "48px",
                        }}
                      >
                        <i className="bi bi-telephone text-success fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Phone</h6>
                        <p className="text-muted mb-0 small">
                          <a
                            href="tel:+919131395725"
                            className="text-decoration-none text-muted"
                          >
                            +91 (91) 9131395725
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-start">
                      <div
                        className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center me-3"
                        style={{
                          width: "48px",
                          height: "48px",
                          minWidth: "48px",
                        }}
                      >
                        <i className="bi bi-geo-alt text-info fs-5"></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1">Office</h6>
                        <p className="text-muted mb-0 small">
                          58 Om Shiv Nagar
                          <br />
                          Lalghati, Bhopal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-lg-7">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-4">Send us a Message</h5>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="your@email.com"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-semibold">
                          Message
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="form-control"
                          rows="5"
                          placeholder="Write your message here..."
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary w-100 fw-semibold"
                      >
                        Send Message
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
