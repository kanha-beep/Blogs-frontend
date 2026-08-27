const fallbackSiteUrl = "https://blogs-frontend-omega.vercel.app";

export const siteConfig = {
  name: "Blogscape",
  shortName: "Blogscape",
  creator: "Blogscape Editorial Team",
  publisher: "Blogscape",
  locale: "en_US",
  defaultTitle: "Blogscape | Modern Blog Publishing, News Writing, and Editorial Stories",
  description:
    "Blogscape is a modern blog publishing platform for editorial stories, news-based articles, thoughtful reader comments, and creator-led publishing.",
  keywords: [
    "blog publishing platform",
    "modern blog platform",
    "editorial stories",
    "news blog publishing",
    "online writing platform",
    "blog discovery",
    "article publishing website",
    "reader comments blog",
    "creator publishing dashboard",
    "digital magazine style blog",
  ],
  category: "blogging",
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    fallbackSiteUrl,
  socialImagePath: "/og-image.svg",
  iconPath: "/favicon.svg",
};

export function normalizeSiteUrl(url = siteConfig.siteUrl) {
  return url.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/") {
  if (!path) {
    return normalizeSiteUrl();
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeSiteUrl()}${normalizedPath}`;
}

export function slugify(value = "") {
  return value
    .toString()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "story";
}

export function stripHtml(value = "") {
  return value.replace(/<[^>]+>/g, " ");
}

export function collapseWhitespace(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

export function truncate(value = "", maxLength = 160) {
  if (!value) return "";
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function buildExcerpt(value = "", maxLength = 160) {
  return truncate(collapseWhitespace(stripHtml(value)), maxLength);
}

export function getBlogPath(blogOrId, title) {
  if (typeof blogOrId === "object" && blogOrId) {
    return `/stories/${blogOrId._id}/${slugify(blogOrId.title || title || "story")}`;
  }

  return `/stories/${blogOrId}/${slugify(title || "story")}`;
}

export function getLegacyBlogPath(id) {
  return `/${id}`;
}

export function getBlogCommentsPath(blogOrId, title) {
  if (typeof blogOrId === "object" && blogOrId) {
    return `${getBlogPath(blogOrId)}/comments`;
  }

  return `${getBlogPath(blogOrId, title)}/comments`;
}

export function getBlogEditPath(id) {
  return `/${id}/edit`;
}

export function buildPageTitle(title) {
  return title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
}
