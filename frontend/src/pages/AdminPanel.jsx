// frontend/src/pages/AdminPanel.jsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getAdminStats,
  getAllUsers,
  getAllLogs,
  updateUserRole,
} from "../services/adminService";
import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";

const TABS = ["Overview", "Users", "Logs"];

export default function AdminPanel() {
  const [tab, setTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsRes, usersRes, logsRes] = await Promise.all([
          getAdminStats(),
          getAllUsers(),
          getAllLogs(),
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (usersRes.success) setUsers(usersRes.data);
        if (logsRes.success) setLogs(logsRes.data);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || err.message || "Failed to load data",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateUserRole(userId, newRole);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
      }
    } catch (err) {
      alert("Failed to update role: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <div className="max-w-2xl mx-auto bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold mb-2">👑 Admin Panel</h1>
          <p className="text-gray-400">System-wide monitoring and management</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold transition border-b-2 -mb-px ${
                tab === t
                  ? "text-blue-400 border-blue-400"
                  : "text-gray-400 border-transparent hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {tab === "Overview" && stats && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Total Users"
                value={stats.totalUsers}
                icon="👥"
                color="blue"
              />
              <StatCard
                title="Total Scans"
                value={stats.totalScans}
                icon="📋"
                color="purple"
              />
              <StatCard
                title="URL Scans"
                value={stats.urlScans}
                icon="🔗"
                color="purple"
              />
              <StatCard
                title="Email Scans"
                value={stats.emailScans}
                icon="📧"
                color="purple"
              />
              <StatCard
                title="High Risk"
                value={stats.high}
                icon="🔴"
                color="red"
              />
              <StatCard
                title="Medium Risk"
                value={stats.medium}
                icon="🟡"
                color="yellow"
              />
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "Users" && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs text-gray-400 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-gray-800 hover:bg-gray-800/30"
                  >
                    <td className="px-4 py-3 text-sm">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.role === "admin"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Logs Tab */}
        {tab === "Logs" && (
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No logs found
              </div>
            ) : (
              logs.map((log) => (
                <div
                  key={log.id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {log.scan_type === "URL" ? "🔗" : "📧"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
                        {log.scan_type}
                      </span>
                    </div>
                    <RiskBadge level={log.risk_level} />
                  </div>
                  <p className="text-sm text-gray-300 font-mono break-all mb-2">
                    {log.content}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>User: {log.user_id.slice(0, 8)}...</span>
                    <span>
                      {new Date(log.created_at).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
