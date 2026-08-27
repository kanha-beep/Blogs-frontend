import ProtectedRoute from "../../src/auth/ProtectedRoute.jsx";
import { BlogsForm } from "../../src/views/BlogsForm.jsx";
import { buildMetadata } from "../../src/seo/metadata.js";

export const metadata = buildMetadata({
  title: "Create a blog draft",
  description: "Write and publish a new story draft in Blogscape.",
  path: "/blogsform",
  index: false,
  follow: false,
});

export default function BlogsFormPage() {
  return (
    <ProtectedRoute>
      <BlogsForm />
    </ProtectedRoute>
  );
}
