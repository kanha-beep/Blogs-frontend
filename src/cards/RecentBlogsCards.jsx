import React from "react";
import { useNavigate } from "react-router-dom";

export default function RecentBlogsCards({ blog }) {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="card h-100 border-0 shadow-sm" style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'pointer' }} onClick={() => navigate(`/${blog._id}/comments`)}>
      <div className="position-relative overflow-hidden" style={{ height: '180px' }}>
        <img
          src={`http://localhost:3000/uploads/${blog.image}`}
          alt={blog.title}
          className="card-img-top w-100 h-100"
          style={{ objectFit: 'cover' }}
        />
        {blog?.category && (
          <span className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-75">
            {blog.category}
          </span>
        )}
      </div>
      <div className="card-body">
        <h6 className="card-title fw-semibold mb-2" style={{ fontSize: '0.95rem', lineHeight: '1.4' }}>
          {blog.title.length > 50 ? blog.title.substring(0, 50) + '...' : blog.title}
        </h6>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">{blog.author}</small>
          <small className="text-muted">{formatDate(blog?.createdAt)}</small>
        </div>
      </div>
    </div>
  );
}
