import { connectDB } from "../../../../server/db.js";
import { verifyRequest } from "../../../../server/auth.js";
import { ApiError, errorResponse, json, normalizeCategory } from "../../../../server/http.js";
import { syncNewsFeed } from "../../../../server/newsIngestion.js";

export async function POST(req) {
  try {
    await connectDB();
    const user = verifyRequest(req);
    const {
      query = "",
      category: rawCategory = "news",
      limit: rawLimit,
      author: rawAuthor,
    } = (await req.json()) || {};
    const category = normalizeCategory(rawCategory);
    const pageSize = Math.min(Math.max(parseInt(rawLimit, 10) || 5, 1), 25);
    const endpoint = process.env.NEWS_RSS_URL || "https://www.thehindu.com/feeder/default.rss";
    const result = await syncNewsFeed({
      endpoint,
      limit: pageSize,
      category: category[0] || "news",
      author: rawAuthor?.trim() || user?.name || "Editorial Desk",
    });

    if (query?.trim()) {
      const loweredQuery = query.trim().toLowerCase();
      const filteredImportedBlogs = result.importedBlogs.filter((blog) =>
        `${blog.title} ${blog.sourceDescription || ""}`.toLowerCase().includes(loweredQuery)
      );

      if (!filteredImportedBlogs.length) {
        throw new ApiError(404, "No RSS news articles found for blog generation");
      }

      return json({
        ...result,
        message: `${filteredImportedBlogs.length} blog(s) created from news`,
        importedBlogs: filteredImportedBlogs,
      });
    }

    if (!result.scannedArticles) {
      throw new ApiError(404, "No RSS news articles found for blog generation");
    }
    return json(result);
  } catch (error) {
    return errorResponse(error);
  }
}

