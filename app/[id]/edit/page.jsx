import ProtectedRoute from "../../../src/auth/ProtectedRoute.jsx";
import { EditBlogs } from "../../../src/views/EditBlogs.jsx";

export default function EditBlogPage() {
  return (
    <ProtectedRoute>
      <EditBlogs />
    </ProtectedRoute>
  );
}
