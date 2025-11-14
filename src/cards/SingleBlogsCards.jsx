import GoToHomePageButton from "../buttons/GoToHomePageButton";
import EditButton from "../buttons/EditButton.jsx";
import DeleteButton from "../buttons/DeleteButton.jsx";

export const SingleBlogsCards = ({ blogs, user }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  const currentUser = JSON.parse(localStorage.getItem("user") || "null"); // ✅ shorter, safe version
  // console.log("current user:", currentUser?._id);
  // const storedUser = localStorage.getItem("user");
  // let currentUser = null;
  // if (storedUser && storedUser !== "undefined") {
  //   try {
  //     currentUser = JSON.parse(storedUser);
  //   } catch (err) {
  //     console.error("Error parsing user:", err);
  //     currentUser = null;
  //   }
  // }
  // console.log("need this", user);
  console.log(user, "===", currentUser?._id);
  return (
    <div className="card shadow-lg border-0">
      <img
        src={`http://localhost:3000/uploads/${blogs?.image}`}
        className="card-img-top img-fluid"
        alt={blogs?.title}
        style={{ maxHeight: "450px", objectFit: "cover" }}
      />
      <div className="card-body p-4 p-md-5">
        <div className="mb-4">
          <h1 className="fw-bold mb-3">{blogs?.title}</h1>

          <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                style={{ width: "40px", height: "40px" }}
              >
                {blogs?.author?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="fw-semibold small">By {blogs?.author}</div>
                <small className="text-muted">
                  {formatDate(blogs?.createdAt)}
                </small>
              </div>
            </div>

            {blogs?.category && (
              <span className="badge bg-primary px-3 py-2">
                {blogs?.category}
              </span>
            )}
          </div>
        </div>

        <hr className="my-4" />

        <div className="blog-content">
          <p className="fs-5 text-secondary" style={{ lineHeight: 1.8 }}>
            {blogs?.content}
          </p>
        </div>

        <hr className="my-4" />

        <div className="d-flex flex-wrap gap-2">
          {currentUser?._id === user && (
            <>
              <EditButton id={blogs._id} />
              <DeleteButton />
            </>
          )}
          <GoToHomePageButton />
        </div>
      </div>
    </div>
  );
};
