import { textResponse } from "../../src/seo/xml.js";

export const dynamic = "force-static";

export function GET() {
  const body = `/* TEAM */
Product: Blogscape
Role: Modern blog publishing platform
Stack: Next.js, React, MongoDB, Bootstrap, Tailwind CSS

/* THANKS */
Writers, readers, editors, and maintainers who keep the stories moving.

/* SITE */
Standards: HTML5, CSS3, JavaScript, structured data, XML feeds
`;

  return textResponse(body);
}
