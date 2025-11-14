import AllBlogsCards from "../cards/AllBlogsCards.jsx";
export default function AllBlogs({blogs}) {
  return (
    <div className="mb-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="fw-bold text-dark mb-0">All Blog Posts</h2>
        <span className="badge bg-primary px-3 py-2">{blogs?.length || 0} Posts</span>
      </div>
      {blogs && blogs.length > 0 ? (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="col-12 col-md-6 col-lg-4">
              <AllBlogsCards blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted mt-3">Loading blog posts...</p>
        </div>
      )}
    </div>
  );
}
