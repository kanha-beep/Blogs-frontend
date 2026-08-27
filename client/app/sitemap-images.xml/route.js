import { absoluteUrl } from "../../src/seo/site.js";
import { getAllPublicBlogs } from "../../server/blogs.js";
import { escapeXml, xmlResponse } from "../../src/seo/xml.js";

export const revalidate = 3600;

export async function GET() {
  const blogs = (await getAllPublicBlogs()).filter((blog) => blog.url);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${blogs
  .map(
    (blog) => `  <url>
    <loc>${escapeXml(absoluteUrl(blog.path))}</loc>
    <image:image>
      <image:loc>${escapeXml(blog.url)}</image:loc>
      <image:title>${escapeXml(blog.title)}</image:title>
      <image:caption>${escapeXml(blog.description || blog.title)}</image:caption>
    </image:image>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xmlResponse(xml);
}
