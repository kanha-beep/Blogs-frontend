import { connectDB } from "../../../../../../../server/db.js";
import { verifyRequest } from "../../../../../../../server/auth.js";
import { ApiError, errorResponse, json } from "../../../../../../../server/http.js";
import Comment from "../../../../../../../server/models/Comment.js";

export async function POST(req, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const { id, commentId } = await params;
    const { content: rawContent } = (await req.json()) || {};
    const content = rawContent?.trim();

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

