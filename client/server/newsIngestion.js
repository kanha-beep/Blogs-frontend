import { Blog } from "./models/Blog.js";
import { News } from "./models/News.js";
import { buildGeneratedContent, parseRssFeed } from "./newsBlogGenerator.js";

const HINDU_HOME_RSS = "https://www.thehindu.com/feeder/default.rss";

function toDateOrNull(value) {
  if (!value) return null;
  const next = new Date(value);
  return Number.isNaN(next.getTime()) ? null : next;
}

function toDateKey(date) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

function toMonthKey(date) {
  if (!date) return "";
  return date.toISOString().slice(0, 7);
}

async function fetchRssArticles(endpoint) {
  const response = await fetch(endpoint, {
    headers: {
      Accept: "application/rss+xml, application/xml, text/xml",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Unable to fetch RSS news");
  }

  const payload = await response.text();
  return parseRssFeed(payload).filter((article) => article?.title || article?.description);
}

export async function syncNewsFeed({
  endpoint = process.env.NEWS_RSS_URL || HINDU_HOME_RSS,
  limit = Math.min(Math.max(parseInt(process.env.AUTO_BLOG_LIMIT || "10", 10) || 10, 1), 25),
  category = (process.env.AUTO_BLOG_CATEGORY || "news").trim() || "news",
  author = (process.env.AUTO_BLOG_AUTHOR || "Editorial Desk").trim() || "Editorial Desk",
} = {}) {
  const articles = await fetchRssArticles(endpoint);
  const selectedArticles = articles.slice(0, limit);
  const importedBlogs = [];
  const skippedArticles = [];
  let syncedNewsCount = 0;

  for (const article of selectedArticles) {
    const title = article.title?.trim();
    const link = (article.url || article.link || "").trim();
    const description = article.description?.trim() || "";
    const publishedAt = toDateOrNull(article.publishedAt || article.pubDate || null);

    if (!title || !link) {
      skippedArticles.push({ title: title || "", reason: "Missing title or link" });
      continue;
    }

    const newsRecord = await News.findOneAndUpdate(
      { link },
      {
        $set: {
          title,
          description,
          pubDate: article.publishedAt || article.pubDate || "",
          publishedAt,
          publishedDateKey: toDateKey(publishedAt),
          publishedMonthKey: toMonthKey(publishedAt),
          category,
        },
        $setOnInsert: {
          tags: [],
        },
      },
      { upsert: true, new: true }
    );

    syncedNewsCount += 1;

    if (newsRecord.blogId) {
      skippedArticles.push({ title, reason: "Blog already linked" });
      continue;
    }

    const existingBlog = await Blog.findOne({
      $or: [{ sourceUrl: link }, { sourceTitle: title }],
    });

    if (existingBlog) {
      await News.updateOne({ _id: newsRecord._id }, { $set: { blogId: existingBlog._id } });
      skippedArticles.push({ title, reason: "Existing blog linked" });
      continue;
    }

    const blog = await Blog.create({
      title,
      content: buildGeneratedContent(article),
      author,
      category: [category],
      url: article.urlToImage || article.image_url || "",
      sourceTitle: title,
      sourceDescription: description,
      sourceUrl: link,
      sourceName: article?.source?.name || article.source_name || "",
      generatedFromNews: true,
      publishedAtSource: article.publishedAt || article.pubDate || null,
    });

    await News.updateOne({ _id: newsRecord._id }, { $set: { blogId: blog._id } });
    importedBlogs.push(blog);
  }

  return {
    message: `${importedBlogs.length} blog(s) created from news`,
    importedBlogs,
    skippedArticles,
    syncedNewsCount,
    scannedArticles: selectedArticles.length,
  };
}
