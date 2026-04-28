import { connectDB } from "../../../../../src/server/db.js";
import { ApiError, errorResponse, json, verifyRequest } from "../../../../../src/server/api.js";
import { Blog } from "../../../../../src/server/models/Blog.js";

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const { id } = await params;
    const existingBlog = await Blog.findById(id).populate("user");

    if (!existingBlog) throw new ApiError(404, "Blog not found");
    if (!existingBlog.user?._id || existingBlog.user._id.toString() !== user._id.toString()) {
      throw new ApiError(403, "Not authorized");
    }

    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) throw new ApiError(404, "No blog found");

    return json({ message: "Deleted Successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}
