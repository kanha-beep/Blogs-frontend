import { absoluteUrl } from "../../src/seo/site.js";
import { escapeXml, xmlResponse } from "../../src/seo/xml.js";

export const dynamic = "force-static";

export function GET() {
  const pages = [
    { path: "/", changefreq: "daily", priority: "1.0" },
    { path: "/contacts", changefreq: "monthly", priority: "0.6" },
  ];
  const now = new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${escapeXml(absoluteUrl(page.path))}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return xmlResponse(xml);
}
