import { connectDB } from "../../../../../../../src/server/db.js";
import { ApiError, errorResponse, json, verifyRequest } from "../../../../../../../src/server/api.js";
import Comment from "../../../../../../../src/server/models/Comment.js";

export async function POST(request, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const { id, commentId } = await params;
    const body = await request.json();
    const content = body?.content?.trim();

    if (!content) throw new ApiError(400, "Reply content is required");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "No comment found");
    if (comment.blog.toString() !== id) {
      throw new ApiError(400, "Comment does not belong to this blog");
    }

    comment.replies.push({
      content,
      user: user._id,
    });

    await comment.save();
    await comment.populate("replies.user", "name");

    return json(comment);
  } catch (error) {
    return errorResponse(error);
  }
}
