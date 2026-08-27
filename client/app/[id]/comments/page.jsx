import SingleBlogsFinal from "../../../src/views/SingleBlogsFinal.jsx";
import { buildStoryMetadata } from "../../../src/seo/metadata.js";
import { getPublicBlogById } from "../../../server/blogs.js";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getPublicBlogById(id);
  const canonicalPath = blog?.path || `/${id}`;

  return buildStoryMetadata({
    title: blog ? `${blog.title} comments` : "Story comments",
    description: blog
      ? `Reader comments and discussion for ${blog.title} on Blogscape.`
      : "Reader comments for a Blogscape story.",
    canonicalPath,
    image: blog?.url || undefined,
    index: false,
    follow: false,
  });
}

export default function BlogCommentsPage() {
  return <SingleBlogsFinal />;
}
