// frontend/src/pages/Dashboard.jsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getDashboardStats } from "../services/scanService";
import StatCard from "../components/StatCard";
import RiskBadge from "../components/RiskBadge";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await getDashboardStats();
        if (res.success) {
          setStats(res.data);
        } else {
          setError(res.message || "Failed to load stats");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load dashboard",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

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

  // Empty state
  if (stats.total === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
          <p className="text-5xl mb-4">📊</p>
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {user?.name || "User"}!
          </h2>
          <p className="text-gray-400 mb-6">
            You haven't scanned anything yet. Start by scanning a URL or
            analyzing an email.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/scan"
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
            >
              Scan URL
            </Link>
            <Link
              to="/email"
              className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold transition"
            >
              Analyze Email
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const maxDayTotal = Math.max(...stats.last7Days.map((d) => d.total), 1);

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">📊 Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {user?.name || "User"}! Here's your security overview.
          </p>
        </motion.div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Total Scans"
            value={stats.total}
            icon="📋"
            color="blue"
            delay={0}
          />
          <StatCard
            title="High Risk"
            value={stats.high}
            icon="🔴"
            color="red"
            delay={0.05}
          />
          <StatCard
            title="Medium Risk"
            value={stats.medium}
            icon="🟡"
            color="yellow"
            delay={0.1}
          />
          <StatCard
            title="Low Risk"
            value={stats.low}
            icon="🟢"
            color="green"
            delay={0.15}
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard
            title="URL Scans"
            value={stats.urlScans}
            icon="🔗"
            color="purple"
            delay={0.2}
          />
          <StatCard
            title="Email Scans"
            value={stats.emailScans}
            icon="📧"
            color="purple"
            delay={0.25}
          />
          <StatCard
            title="Avg Risk Score"
            value={`${stats.avgScore}/100`}
            icon="⚖️"
            color="gray"
            delay={0.3}
          />
        </div>

        {/* 7-Day Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-bold mb-4">📈 Last 7 Days Activity</h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {stats.last7Days.map((day, i) => {
              const heightPct = (day.total / maxDayTotal) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex flex-col justify-end h-full relative">
                    {day.total > 0 && (
                      <span className="text-xs text-gray-400 text-center mb-1">
                        {day.total}
                      </span>
                    )}
                    <div
                      className="w-full bg-gray-800 rounded-t-lg overflow-hidden relative flex flex-col justify-end"
                      style={{ height: `${Math.max(heightPct, 4)}%` }}
                    >
                      {day.high > 0 && (
                        <div
                          className="bg-red-500 w-full"
                          style={{
                            height: `${(day.high / day.total) * 100}%`,
                          }}
                        />
                      )}
                      {day.medium > 0 && (
                        <div
                          className="bg-yellow-500 w-full"
                          style={{
                            height: `${(day.medium / day.total) * 100}%`,
                          }}
                        />
                      )}
                      {day.low > 0 && (
                        <div
                          className="bg-green-500 w-full"
                          style={{
                            height: `${(day.low / day.total) * 100}%`,
                          }}
                        />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{day.label}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 justify-center mt-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500" /> High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-yellow-500" /> Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-green-500" /> Low
            </span>
          </div>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">🕒 Recent Scans</h2>
            <Link
              to="/history"
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stats.recent.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between gap-3 bg-gray-800/40 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-lg">
                    {scan.scan_type === "URL" ? "🔗" : "📧"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 font-mono truncate">
                      {scan.content}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(scan.created_at).toLocaleString("en-IN", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>
                <RiskBadge level={scan.risk_level} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
