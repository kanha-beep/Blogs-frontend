import { connectDB } from "../../../../../src/server/db.js";
import { ApiError, errorResponse, json, normalizeCategory, verifyRequest } from "../../../../../src/server/api.js";
import { uploadToCloudinary } from "../../../../../src/server/cloudinary.js";
import { Blog } from "../../../../../src/server/models/Blog.js";

async function assertBlogOwner(id, userId) {
  const blog = await Blog.findById(id).populate("user");
  if (!blog) throw new ApiError(404, "Blog not found");
  if (!blog.user?._id || blog.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }
  return blog;
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const { id } = await params;
    const blog = await assertBlogOwner(id, user._id);

    return json(blog);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const { id } = await params;
    const existingBlog = await assertBlogOwner(id, user._id);
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const category = normalizeCategory(formData.getAll("category"));
    const image = formData.get("image");

    if (!title || !content || !author || category.length === 0) {
      throw new ApiError(400, "All fields are required");
    }

    const imageBuffer =
      image && typeof image.arrayBuffer === "function"
        ? Buffer.from(await image.arrayBuffer())
        : null;
    const uploadedImage = imageBuffer?.length ? await uploadToCloudinary(imageBuffer) : null;

    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        author,
        category,
        url: uploadedImage?.secure_url || existingBlog.url || "",
      },
      { new: true }
    );

    if (!blog) throw new ApiError(404, "No blog found");

    return json({ message: "Updated Successfully", blog });
  } catch (error) {
    return errorResponse(error);
  }
}
