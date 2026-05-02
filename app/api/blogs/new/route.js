import { connectDB } from "../../../../src/server/db.js";
import { ApiError, errorResponse, json, normalizeCategory, verifyRequest } from "../../../../src/server/api.js";
import { uploadToCloudinary } from "../../../../src/server/cloudinary.js";
import { Blog } from "../../../../src/server/models/Blog.js";
import { News } from "../../../../src/server/models/News.js";

export async function POST(request) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const formData = await request.formData();
    const title = String(formData.get("title") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const sourceUrl = String(formData.get("sourceUrl") || "").trim();
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

    const newBlog = await Blog.create({
      title,
      content,
      author,
      url: uploadedImage?.secure_url,
      category,
      user: user._id,
      sourceUrl,
    });

    if (sourceUrl) {
      await News.updateOne(
        { $or: [{ link: sourceUrl }, { title }] },
        { $set: { blogId: newBlog._id } }
      );
    }

    return json({ message: "New Blog Created Successfully", newBlog });
  } catch (error) {
    return errorResponse(error);
  }
}
