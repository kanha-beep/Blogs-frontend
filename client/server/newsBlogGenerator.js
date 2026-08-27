const cleanText = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/\s+/g, " ")
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const splitIntoSentences = (text = "") =>
  cleanText(text)
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

const normalizePiece = (value = "") =>
  cleanText(value)
    .replace(/\s*[-|:]\s*[^-:|]+$/, "")
    .trim();

const titleCase = (value = "") =>
  value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const buildGeneratedContent = (article = {}) => {
  const title = normalizePiece(article.title || "This latest development");
  const description = cleanText(article.description || article.content || "");
  const sourceName = cleanText(article?.source?.name || article.source_name || "the news report");
  const author = cleanText(article.author || "Editorial Desk");
  const publishedAt = article.publishedAt
    ? new Date(article.publishedAt).toLocaleString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "recently";

  const descriptionSentences = splitIntoSentences(description);
  const leadSentence =
    descriptionSentences[0] ||
    `${title} has started drawing attention because it points to a wider shift that readers should keep an eye on.`;
  const supportSentence =
    descriptionSentences[1] ||
    "Even with limited public details, the early signals already suggest that this update matters beyond a single headline.";

  return [
    `${titleCase(title)} is now part of the bigger conversation after being highlighted by ${sourceName} on ${publishedAt}. ${leadSentence}`,
    `At the center of this story is a simple question: why does this development matter right now? ${supportSentence}`,
    "When we combine the original headline with its short description, a clearer narrative appears. The update is not only about an isolated event, but also about momentum, reaction, and what people may need to watch next.",
    "For readers, the practical value lies in separating the headline from the underlying signal. If this trend continues, it could shape public discussion, business decisions, or day-to-day expectations in the near term.",
    "Another useful way to read this report is through context. News items like this usually grow in importance when follow-up details, official responses, and real-world impact begin to line up around the first announcement.",
    `For now, the strongest takeaway is straightforward: ${leadSentence.charAt(0).toLowerCase() + leadSentence.slice(1)} That is why this topic deserves more than a quick scroll past.`,
    `This article was drafted automatically from a news headline and description, then arranged into blog form for quicker publishing. Source credit: ${sourceName}. Compiled by ${author}.`,
  ].join("\n\n");
};

const extractTag = (item = "", tagName = "") => {
  const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)</${tagName}>`, "i");
  const match = item.match(regex);
  return cleanText(match?.[1] || "");
};

export const parseRssFeed = (xml = "") => {
  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];

  return items.map((item) => ({
    title: extractTag(item, "title"),
    description: extractTag(item, "description"),
    url: extractTag(item, "link"),
    publishedAt: extractTag(item, "pubDate"),
    author: extractTag(item, "dc:creator") || extractTag(item, "author"),
    source: {
      name: "The Hindu",
    },
  }));
};
