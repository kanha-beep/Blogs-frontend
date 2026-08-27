import { connectDB } from "../../../../../server/db.js";
import { verifyRequest } from "../../../../../server/auth.js";
import { ApiError, errorResponse, json } from "../../../../../server/http.js";
import { Blog } from "../../../../../server/models/Blog.js";
import Comment from "../../../../../server/models/Comment.js";

export async function GET(_request, { params }) {
  try {
    await connectDB();
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

export async function POST(req, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const { id } = await params;
    const { content: rawContent, rating: rawRating } = (await req.json()) || {};
    const content = rawContent?.trim();
    const rating = Math.min(5, Math.max(1, Number(rawRating) || 5));

    if (!content) throw new ApiError(400, "Comment content is required");

    const comment = await Comment.create({
      content,
      rating,
      user: user._id,
      blog: id,
    });

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      { new: true }
    ).populate("comments");

    if (!blog) throw new ApiError(404, "No blog found");

    return json(blog);
  } catch (error) {
    return errorResponse(error);
  }
}

