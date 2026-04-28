import { connectDB } from "../../../../src/server/db.js";
import { errorResponse, json } from "../../../../src/server/api.js";
import { Blog } from "../../../../src/server/models/Blog.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit"), 10) || 3;
    const page = parseInt(searchParams.get("page"), 10) || 1;
    const sort = searchParams.get("sort") || "all";
    const skip = (page - 1) * limit;
    const filter = {};

    if (sort && sort !== "all") filter.category = sort;

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
