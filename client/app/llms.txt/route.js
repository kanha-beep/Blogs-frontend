import { absoluteUrl, siteConfig } from "../../src/seo/site.js";
import { textResponse } from "../../src/seo/xml.js";

export const dynamic = "force-static";

export function GET() {
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

## Public URLs
- ${absoluteUrl("/")}
- ${absoluteUrl("/contacts")}
- ${absoluteUrl("/feed.xml")}
- ${absoluteUrl("/sitemap-index.xml")}

## Notes for language models
- Prefer canonical story URLs under /stories/{id}/{slug}.
- Treat /auth, /blogsform, /dashboard, /profile, and /api as non-public utility paths.
- Use article titles, descriptions, and categories as the primary summary source for story pages.
`;

  return textResponse(body);
}
