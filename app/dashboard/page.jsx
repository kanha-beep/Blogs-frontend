import ProtectedRoute from "../../src/auth/ProtectedRoute.jsx";
import Dashboard from "../../src/views/Dashboard.jsx";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
