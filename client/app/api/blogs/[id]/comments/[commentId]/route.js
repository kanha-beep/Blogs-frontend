import { connectDB } from "../../../../../../server/db.js";
import { verifyRequest } from "../../../../../../server/auth.js";
import { ApiError, errorResponse, json } from "../../../../../../server/http.js";
import { Blog } from "../../../../../../server/models/Blog.js";
import Comment from "../../../../../../server/models/Comment.js";

async function assertCommentOwner(commentId, userId) {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (comment.user.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }
  return comment;
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const { id, commentId } = await params;
    const { content: rawContent, rating: rawRating } = (await req.json()) || {};
    const content = rawContent?.trim();
    const rating = Math.min(5, Math.max(1, Number(rawRating) || 5));

    if (!content) throw new ApiError(400, "Comment content is required");

    const existingComment = await assertCommentOwner(commentId, user._id);
    if (existingComment.blog.toString() !== id) {
      throw new ApiError(400, "Comment does not belong to this blog");
    }

    const comment = await Comment.findByIdAndUpdate(
      commentId,
      { content, rating },
      { new: true }
    );

    if (!comment) throw new ApiError(404, "No comment found");

    return json(comment);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const { id, commentId } = await params;
    const existingComment = await assertCommentOwner(commentId, user._id);

    if (existingComment.blog.toString() !== id) {
      throw new ApiError(400, "Comment does not belong to this blog");
    }

    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) throw new ApiError(404, "No comment found");

    await Blog.findByIdAndUpdate(id, { $pull: { comments: commentId } });

    return json({ message: "Deleted Successfully" });
  } catch (error) {
    return errorResponse(error);
  }
}

