import ProtectedRoute from "../../../src/auth/ProtectedRoute.jsx";
import { EditBlogs } from "../../../src/views/EditBlogs.jsx";
import { buildStoryMetadata } from "../../../src/seo/metadata.js";
import { getPublicBlogById } from "../../../src/seo/server.js";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const blog = await getPublicBlogById(id);
  const canonicalPath = blog?.path || `/${id}`;

  return buildStoryMetadata({
    title: blog ? `Edit ${blog.title}` : "Edit story",
    description: "Private Blogscape editor for updating an existing story.",
    canonicalPath,
    image: blog?.url || undefined,
    index: false,
    follow: false,
  });
}

export default function EditBlogPage() {
  return (
    <ProtectedRoute>
      <EditBlogs />
    </ProtectedRoute>
  );
}
