import { connectDB } from "../../../../server/db.js";
import { errorResponse, json } from "../../../../server/http.js";
import { Blog } from "../../../../server/models/Blog.js";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = Math.max(1, parseInt(searchParams.get("limit"), 10) || 3);
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).limit(limit).populate("comments");

    return json(blogs);
  } catch (error) {
    return errorResponse(error);
  }
}

