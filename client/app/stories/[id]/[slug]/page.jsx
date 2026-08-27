import SingleBlogsFinal from "../../../../src/views/SingleBlogsFinal.jsx";
import StructuredData from "../../../../src/components/StructuredData.jsx";
import { buildStoryMetadata } from "../../../../src/seo/metadata.js";
import { getPublicBlogById } from "../../../../server/blogs.js";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
} from "../../../../src/seo/structured-data.js";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getPublicBlogById(id);

  if (!blog) {
    return buildStoryMetadata({
      title: "Story not found",
      description: "The requested Blogscape story could not be found.",
      canonicalPath: `/stories/${id}/story`,
      index: false,
      follow: false,
    });
  }

  return buildStoryMetadata({
    title: blog.title,
    description: blog.description,
    canonicalPath: blog.path,
    image: blog.url || undefined,
    keywords: Array.isArray(blog.category) ? blog.category : [],
  });
}

export default async function StoryPage({ params }) {
  const { id } = await params;
  const blog = await getPublicBlogById(id);

  return (
    <>
      {blog ? (
        <>
          <nav className="sr-only" aria-label="Breadcrumb">
            <ol>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href={blog.path}>{blog.title}</a>
              </li>
            </ol>
          </nav>
          <StructuredData
            data={[
              buildBreadcrumbSchema([
                { name: "Home", path: "/" },
                { name: blog.title, path: blog.path },
              ]),
              buildBlogPostingSchema(blog),
            ]}
          />
        </>
      ) : null}
      <SingleBlogsFinal />
    </>
  );
}
