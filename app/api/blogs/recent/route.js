import { connectDB } from "../../../../src/server/db.js";
import { errorResponse, json } from "../../../../src/server/api.js";
import { Blog } from "../../../../src/server/models/Blog.js";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, parseInt(searchParams.get("limit"), 10) || 3);
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(limit).populate("comments");

    return json(blogs);
  } catch (error) {
    return errorResponse(error);
  }
}
