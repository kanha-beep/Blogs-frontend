import { textResponse } from "../../src/seo/xml.js";

export const dynamic = "force-static";

export function GET() {
  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);

  const body = `Contact: mailto:kanhashree2223@gmail.com
Expires: ${nextYear.toISOString()}
Preferred-Languages: en
Canonical: https://blogs-frontend-omega.vercel.app/security.txt
Policy: https://blogs-frontend-omega.vercel.app/contacts
`;

  return textResponse(body);
}
