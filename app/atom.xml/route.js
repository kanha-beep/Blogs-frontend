import { absoluteUrl, normalizeSiteUrl, siteConfig } from "../../src/seo/site.js";
import { getAllPublicBlogs } from "../../src/seo/server.js";
import { escapeXml, xmlResponse } from "../../src/seo/xml.js";

export const revalidate = 3600;

export async function GET() {
  const blogs = (await getAllPublicBlogs()).slice(0, 20);
  const updated =
    blogs[0]?.updatedAt || blogs[0]?.createdAt || new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteConfig.name)}</title>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <link href="${escapeXml(normalizeSiteUrl())}" />
  <link href="${escapeXml(absoluteUrl("/atom.xml"))}" rel="self" />
  <updated>${new Date(updated).toISOString()}</updated>
  <id>${escapeXml(normalizeSiteUrl())}</id>
${blogs
  .map(
    (blog) => `  <entry>
    <title>${escapeXml(blog.title)}</title>
    <link href="${escapeXml(absoluteUrl(blog.path))}" />
    <id>${escapeXml(absoluteUrl(blog.path))}</id>
    <updated>${new Date(blog.updatedAt || blog.createdAt || Date.now()).toISOString()}</updated>
    <summary>${escapeXml(blog.description)}</summary>
    <author><name>${escapeXml(blog.author || siteConfig.creator)}</name></author>
  </entry>`
  )
  .join("\n")}
</feed>`;

  return xmlResponse(xml);
}
