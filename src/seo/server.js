import { connectDB } from "../server/db.js";
import { Blog } from "../server/models/Blog.js";
import { buildExcerpt, getBlogPath } from "./site.js";

export async function getAllPublicBlogs() {
  await connectDB();

  const blogs = await Blog.find({})
    .sort({ updatedAt: -1 })
    .select("title author content url category createdAt updatedAt sourceDescription")
    .lean();

  return blogs.map((blog) => ({
    ...blog,
    _id: blog._id.toString(),
    description: buildExcerpt(blog.sourceDescription || blog.content || blog.title, 170),
    path: getBlogPath({ _id: blog._id.toString(), title: blog.title }),
  }));
}

export async function getPublicBlogById(id) {
  await connectDB();

  const blog = await Blog.findById(id)
    .select("title author content url category createdAt updatedAt sourceDescription comments")
    .lean();

  if (!blog) {
    return null;
  }

  return {
    ...blog,
    _id: blog._id.toString(),
    description: buildExcerpt(blog.sourceDescription || blog.content || blog.title, 170),
    path: getBlogPath({ _id: blog._id.toString(), title: blog.title }),
  };
}
