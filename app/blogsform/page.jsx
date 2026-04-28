import ProtectedRoute from "../../src/auth/ProtectedRoute.jsx";
import { BlogsForm } from "../../src/views/BlogsForm.jsx";

export default function BlogsFormPage() {
  return (
    <ProtectedRoute>
      <BlogsForm />
    </ProtectedRoute>
  );
}
