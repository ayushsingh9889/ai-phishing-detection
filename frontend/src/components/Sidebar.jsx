// frontend/src/components/Sidebar.jsx

import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const mainLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/scan", label: "URL Scanner", icon: "🔗" },
  { to: "/email", label: "Email Analyzer", icon: "📧" },
  { to: "/history", label: "History", icon: "📜" },
];

export default function Sidebar({ open, onClose }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <NavLink
          to="/"
          className="text-white font-bold text-lg flex items-center gap-2"
        >
          🛡️ <span>PhishGuard</span>
        </NavLink>

        <button
          onClick={onClose}
          className="md:hidden text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {isAuthenticated ? (
          <>
            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`
                }
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}

            {user?.role === "admin" && (
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-red-600/20 text-red-400 border border-red-500/30"
                      : "text-red-400 hover:text-red-300 hover:bg-gray-800"
                  }`
                }
              >
                <span className="text-base">👑</span>
                <span>Admin Panel</span>
              </NavLink>
            )}
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              <span className="text-base">🔐</span>
              <span>Login</span>
            </NavLink>
            <NavLink
              to="/register"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              <span className="text-base">✍️</span>
              <span>Register</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User Info + Logout */}
      {isAuthenticated && (
        <div className="border-t border-gray-800 p-3">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
          >
            <span className="text-base">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* ===== DESKTOP SIDEBAR (always visible on md+) ===== */}
      <aside className="hidden md:flex md:flex-col w-64 h-screen sticky top-0 bg-gray-900 border-r border-gray-800 flex-shrink-0">
        {navContent}
      </aside>

      {/* ===== MOBILE SIDEBAR (slide-in) ===== */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
            />

            {/* Slide-in sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 left-0 z-40 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col md:hidden"
            >
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
