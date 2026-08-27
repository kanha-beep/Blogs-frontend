import { absoluteUrl } from "../../src/seo/site.js";
import { getAllPublicBlogs } from "../../server/blogs.js";
import { escapeXml, xmlResponse } from "../../src/seo/xml.js";

export const revalidate = 3600;

export async function GET() {
  const blogs = await getAllPublicBlogs();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${blogs
  .map(
    (blog) => `  <url>
    <loc>${escapeXml(absoluteUrl(blog.path))}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xmlResponse(xml);
}
