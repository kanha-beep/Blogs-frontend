import { connectDB } from "../../../../server/db.js";
import { verifyRequest } from "../../../../server/auth.js";
import { ApiError, errorResponse, json, normalizeCategory } from "../../../../server/http.js";
import { uploadToCloudinary } from "../../../../server/cloudinary.js";
import { Blog } from "../../../../server/models/Blog.js";
import { News } from "../../../../server/models/News.js";

export async function POST(req) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const formData = await req.formData();
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
      url: uploadedImage?.secure_url || "",
      imageUrl: uploadedImage?.secure_url || "",
      category,
      user: user._id,
      sourceUrl,
      sourceTitle: title,
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

