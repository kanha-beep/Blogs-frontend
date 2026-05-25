import ProtectedRoute from "../../src/auth/ProtectedRoute.jsx";
import Dashboard from "../../src/views/Dashboard.jsx";
import { buildMetadata } from "../../src/seo/metadata.js";

export const metadata = buildMetadata({
  title: "Publishing dashboard",
  description: "Private Blogscape dashboard for managing stories and publishing analytics.",
  path: "/dashboard",
  index: false,
  follow: false,
});

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
