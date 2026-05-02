import { connectDB } from "../../../../src/server/db.js";
import { ApiError, errorResponse, json, normalizeCategory, verifyRequest } from "../../../../src/server/api.js";
import { syncNewsFeed } from "../../../../src/server/newsIngestion.js";

export async function POST(request) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const body = await request.json();
    const query = body?.query || "";
    const category = normalizeCategory(body?.category || "news");
    const pageSize = Math.min(Math.max(parseInt(body?.limit, 10) || 5, 1), 25);
    const endpoint = process.env.NEWS_RSS_URL || "https://www.thehindu.com/feeder/default.rss";
    const result = await syncNewsFeed({
      endpoint,
      limit: pageSize,
      category: category[0] || "news",
      author: body?.author?.trim() || user?.name || "Editorial Desk",
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
