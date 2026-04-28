import { connectDB } from "../../../../src/server/db.js";
import { ApiError, errorResponse, json, normalizeCategory, verifyRequest } from "../../../../src/server/api.js";
import { Blog } from "../../../../src/server/models/Blog.js";
import { News } from "../../../../src/server/models/News.js";
import { buildGeneratedContent, parseRssFeed } from "../../../../src/server/newsBlogGenerator.js";

const HINDU_HOME_RSS = "https://www.thehindu.com/feeder/default.rss";

export async function POST(request) {
  try {
    await connectDB();
    const user = verifyRequest(request);
    const body = await request.json();
    const query = body?.query || "";
    const category = normalizeCategory(body?.category || "news");
    const pageSize = Math.min(Math.max(parseInt(body?.limit, 10) || 5, 1), 10);
    const endpoint = process.env.NEWS_RSS_URL || HINDU_HOME_RSS;

    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new ApiError(response.status, message || "Unable to fetch RSS news");
    }

    const payload = await response.text();
    const articles = parseRssFeed(payload).filter((article) => article?.title || article?.description);
    const filteredArticles = query?.trim()
      ? articles.filter((article) =>
          `${article.title} ${article.description}`.toLowerCase().includes(query.trim().toLowerCase())
        )
      : articles;

    if (!filteredArticles.length) {
      throw new ApiError(404, "No RSS news articles found for blog generation");
    }

    const importedBlogs = [];
    const skippedArticles = [];

    for (const article of filteredArticles.slice(0, pageSize)) {
      const sourceTitle = article.title?.trim();
      if (!sourceTitle) {
        skippedArticles.push({ reason: "Missing title" });
        continue;
      }

      const exists = await Blog.findOne({ user: user._id, sourceTitle });
      if (exists) {
        skippedArticles.push({ title: sourceTitle, reason: "Already imported" });
        continue;
      }

      const blog = await Blog.create({
        title: sourceTitle,
        content: buildGeneratedContent(article),
        author: body?.author?.trim() || user?.name || "Editorial Desk",
        category,
        user: user._id,
        url: article.urlToImage || article.image_url || "",
        sourceTitle,
        sourceDescription: article.description || "",
        sourceUrl: article.url || article.link || "",
        sourceName: article?.source?.name || article.source_name || "",
        generatedFromNews: true,
        publishedAtSource: article.publishedAt || article.pubDate || null,
      });

      if (article.url || article.link) {
        await News.updateOne({ link: article.url || article.link }, { $set: { blogId: blog._id } });
      }

      importedBlogs.push(blog);
    }

    return json({
      message: `${importedBlogs.length} blog(s) created from news`,
      importedBlogs,
      skippedArticles,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
