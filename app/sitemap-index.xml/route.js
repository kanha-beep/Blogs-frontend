import { absoluteUrl } from "../../src/seo/site.js";
import { xmlResponse } from "../../src/seo/xml.js";

export const revalidate = 3600;

export function GET() {
  const now = new Date().toISOString();
  const sitemaps = [
    absoluteUrl("/sitemap-pages.xml"),
    absoluteUrl("/sitemap-posts.xml"),
    absoluteUrl("/sitemap-images.xml"),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((url) => `  <sitemap><loc>${url}</loc><lastmod>${now}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return xmlResponse(xml);
}
