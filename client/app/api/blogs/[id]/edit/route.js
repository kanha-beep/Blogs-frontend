import { connectDB } from "../../../../../server/db.js";
import { verifyRequest } from "../../../../../server/auth.js";
import { ApiError, errorResponse, json, normalizeCategory } from "../../../../../server/http.js";
import { uploadToCloudinary } from "../../../../../server/cloudinary.js";
import { Blog } from "../../../../../server/models/Blog.js";
import { News } from "../../../../../server/models/News.js";

async function assertBlogOwner(id, userId) {
  const blog = await Blog.findById(id).populate("user");
  if (!blog) throw new ApiError(404, "Blog not found");
  if (!blog.user?._id || blog.user._id.toString() !== userId.toString()) {
    throw new ApiError(403, "Not authorized");
  }
  return blog;
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const { id } = await params;
    const blog = await assertBlogOwner(id, user._id);

    return json(blog);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const { id } = await params;
    const existingBlog = await assertBlogOwner(id, user._id);
    const formData = await req.formData();
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const sourceUrl = String(formData.get("sourceUrl") || "").trim();
    const category = normalizeCategory(formData.getAll("category"));
    const image = formData.get("image");
    const removeImage = String(formData.get("removeImage") || "").toLowerCase() === "true";

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
        url: removeImage ? "" : uploadedImage?.secure_url || existingBlog.url || "",
        imageUrl: removeImage
          ? ""
          : uploadedImage?.secure_url || existingBlog.imageUrl || existingBlog.url || "",
        sourceUrl: sourceUrl || existingBlog.sourceUrl || "",
        sourceTitle: title,
      },
      { new: true }
    );

    if (!blog) throw new ApiError(404, "No blog found");

    const nextSourceUrl = sourceUrl || existingBlog.sourceUrl || "";
    if (nextSourceUrl) {
      await News.updateOne(
        { $or: [{ link: nextSourceUrl }, { title }] },
        { $set: { blogId: blog._id } }
      );
    }

    return json({ message: "Updated Successfully", blog });
  } catch (error) {
    return errorResponse(error);
  }
}

