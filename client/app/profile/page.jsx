import ProtectedRoute from "../../src/auth/ProtectedRoute.jsx";
import Profile from "../../src/views/Profile.jsx";
import { buildMetadata } from "../../src/seo/metadata.js";

export const metadata = buildMetadata({
  title: "Your profile",
  description: "Private Blogscape profile settings and account details.",
  path: "/profile",
  index: false,
  follow: false,
});

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}
