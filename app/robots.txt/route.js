import { absoluteUrl } from "../../src/seo/site.js";
import { textResponse } from "../../src/seo/xml.js";

export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    `Sitemap: ${absoluteUrl("/sitemap-index.xml")}`,
    `Sitemap: ${absoluteUrl("/sitemap.xml")}`,
    `Sitemap: ${absoluteUrl("/feed.xml")}`,
  ].join("\n");

  return textResponse(body);
}
