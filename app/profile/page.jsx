import ProtectedRoute from "../../src/auth/ProtectedRoute.jsx";
import Profile from "../../src/views/Profile.jsx";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  );
}
