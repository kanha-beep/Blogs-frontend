import { connectDB } from "../../../../server/db.js";
import {verifyRequest} from "../../../../server/auth.js"
import { ApiError, errorResponse, json } from "../../../../server/http.js";
import { Blog } from "../../../../server/models/Blog.js";

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(_request)
    const { id } = await params;
    const blog = await Blog.findById(id)
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name",
        },
      })
      .populate("user", "name");

    if (!blog) throw new ApiError(404, "No blog found");

    await Blog.populate(blog, {
      path: "comments.replies.user",
      select: "name",
    });

    return json(blog);
  } catch (error) {
    return errorResponse(error);
  }
}
