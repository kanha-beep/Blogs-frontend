import { absoluteUrl, normalizeSiteUrl, siteConfig } from "../../src/seo/site.js";
import { getAllPublicBlogs } from "../../src/seo/server.js";
import { escapeXml, xmlResponse } from "../../src/seo/xml.js";

export const revalidate = 3600;

export async function GET() {
  const blogs = (await getAllPublicBlogs()).slice(0, 20);
  const now = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(normalizeSiteUrl())}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${escapeXml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml" />
${blogs
  .map(
    (blog) => `    <item>
      <title>${escapeXml(blog.title)}</title>
      <link>${escapeXml(absoluteUrl(blog.path))}</link>
      <guid isPermaLink="true">${escapeXml(absoluteUrl(blog.path))}</guid>
      <description>${escapeXml(blog.description)}</description>
      <pubDate>${new Date(blog.createdAt || Date.now()).toUTCString()}</pubDate>
      <author>${escapeXml(blog.author || siteConfig.creator)}</author>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return xmlResponse(xml);
}
