import React from "react";
import { useNavigate } from "react-router-dom";

export default function AllBlogsCards({ blog }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card h-100 border-0 shadow-sm" style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
      <div className="position-relative overflow-hidden" style={{ height: '200px' }}>
        <img
          src={`http://localhost:3000/uploads/${blog.image}`}
          alt={blog.title}
          className="card-img-top w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
        {blog?.category && (
          <span className="position-absolute top-0 end-0 m-2 badge bg-primary">
            {blog.category}
          </span>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-center mb-2">
          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px', fontSize: '0.875rem', color: 'white' }}>
            {blog.author?.charAt(0).toUpperCase()}
          </div>
          <div>
            <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>{blog.author}</small>
            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{formatDate(blog?.createdAt)}</small>
          </div>
        </div>
        <h5 className="card-title fw-semibold mb-2" style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
          {blog.title.length > 60 ? blog.title.substring(0, 60) + '...' : blog.title}
        </h5>
        <p className="card-text text-muted flex-grow-1" style={{ fontSize: '0.9rem' }}>
          {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
        </p>
        <button
          className="btn btn-primary w-100 mt-2"
          onClick={() => navigate(`/${blog._id}/comments`)}
        >
          Read More
        </button>
      </div>
    </div>
  );
}
