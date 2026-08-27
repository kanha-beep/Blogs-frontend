import AllBlogsFinal from "../src/components/AllBlogsFinal.jsx";
import StructuredData from "../src/components/StructuredData.jsx";
import { buildMetadata } from "../src/seo/metadata.js";
import { buildCollectionPageSchema } from "../src/seo/structured-data.js";

export const metadata = buildMetadata({
  title: "Blogscape | Modern blog publishing and editorial stories",
  description:
    "Discover fresh blog posts, editorial stories, news-inspired articles, and reader conversations on Blogscape's modern publishing platform.",
  path: "/",
  keywords: [
    "discover blog posts",
    "editorial stories platform",
    "modern publishing homepage",
    "news inspired blogs",
  ],
});

export default function HomePage() {
  return (
    <>
      <StructuredData data={buildCollectionPageSchema()} />
      <AllBlogsFinal />
    </>
  );
}
