import { absoluteUrl } from "../../src/seo/site.js";
import { getAllPublicBlogs } from "../../server/blogs.js";
import { escapeXml, xmlResponse } from "../../src/seo/xml.js";

export const revalidate = 3600;

export async function GET() {
  const blogs = await getAllPublicBlogs();
  const staticPages = [
    { path: "/", lastModified: new Date().toISOString(), changefreq: "daily", priority: "1.0" },
    { path: "/contacts", lastModified: new Date().toISOString(), changefreq: "monthly", priority: "0.6" },
  ];

  const urls = [
    ...staticPages.map(
      (page) => `  <url>
    <loc>${escapeXml(absoluteUrl(page.path))}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    ),
    ...blogs.map(
      (blog) => `  <url>
    <loc>${escapeXml(absoluteUrl(blog.path))}</loc>
    <lastmod>${new Date(blog.updatedAt || blog.createdAt || Date.now()).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return xmlResponse(xml);
}
