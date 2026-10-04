// frontend/src/components/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-4">
        <div className="text-center bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-md">
          <p className="text-5xl mb-4">🚫</p>
          <h2 className="text-2xl font-bold mb-2 text-red-400">
            Access Denied
          </h2>
          <p className="text-gray-400">
            You need admin privileges to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children;
}
