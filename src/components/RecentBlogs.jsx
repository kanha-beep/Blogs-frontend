import RecentBlogsCards from "../cards/RecentBlogsCards";
export default function RecentBlogs({ blogs }) {
  return (
    <div className="mb-5">
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Recent Stories</h2>
        <p className="text-muted">Fresh perspectives from our community</p>
      </div>
      {blogs && blogs.length > 0 ? (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
              <RecentBlogsCards blog={blog} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-muted">No recent blogs available</p>
        </div>
      )}
    </div>
  );
}
