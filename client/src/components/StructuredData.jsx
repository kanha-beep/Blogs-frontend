import { toJsonLd } from "../seo/structured-data.js";

export default function StructuredData({ data }) {
  if (!data) return null;

  const payload = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: toJsonLd(payload.length === 1 ? payload[0] : payload) }}
    />
  );
}
