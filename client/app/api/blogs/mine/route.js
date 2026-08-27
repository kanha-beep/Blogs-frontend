import { connectDB } from "../../../../server/db.js";
import { verifyRequest } from "../../../../server/auth.js";
import { errorResponse, json } from "../../../../server/http.js";
import { Blog } from "../../../../server/models/Blog.js";

export async function GET(req) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit"), 10) || 100;
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const skip = (page - 1) * limit;
    const filter = { user: user._id };

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("comments");
    const totalBlogs = await Blog.countDocuments(filter);

    return json({ blogs, totalBlogs, page });
  } catch (error) {
    return errorResponse(error);
  }
}

