import { connectDB } from "../../../../src/server/db.js";
import { errorResponse, json, verifyRequest } from "../../../../src/server/api.js";
import { Blog } from "../../../../src/server/models/Blog.js";

export async function GET(request) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const { searchParams } = new URL(request.url);
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
