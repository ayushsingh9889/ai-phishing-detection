// frontend/src/pages/ScanHistory.jsx

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getScanHistory } from "../services/scanService";
import HistoryCard from "../components/HistoryCard";

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL"); // ALL | URL | EMAIL
  const [riskFilter, setRiskFilter] = useState("ALL"); // ALL | LOW | MEDIUM | HIGH

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await getScanHistory();
        if (res.success) {
          setScans(res.data);
        } else {
          setError(res.message || "Failed to load history");
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load scan history",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const filteredScans = scans.filter((s) => {
    const typeOk = filter === "ALL" || s.scan_type === filter;
    const riskOk = riskFilter === "ALL" || s.risk_level === riskFilter;
    return typeOk && riskOk;
  });

  const stats = {
    total: scans.length,
    high: scans.filter((s) => s.risk_level === "HIGH").length,
    medium: scans.filter((s) => s.risk_level === "MEDIUM").length,
    low: scans.filter((s) => s.risk_level === "LOW").length,
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">📜 Scan History</h1>
          <p className="text-gray-400">
            View all your past URL scans and email analyses
          </p>
        </motion.div>

        {/* Stats Cards */}
        {!loading && scans.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Total Scans</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-gray-900 border border-red-500/30 rounded-xl p-4">
              <p className="text-xs text-red-400 mb-1">🔴 High Risk</p>
              <p className="text-2xl font-bold text-red-400">{stats.high}</p>
            </div>
            <div className="bg-gray-900 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-xs text-yellow-400 mb-1">🟡 Medium</p>
              <p className="text-2xl font-bold text-yellow-400">
                {stats.medium}
              </p>
            </div>
            <div className="bg-gray-900 border border-green-500/30 rounded-xl p-4">
              <p className="text-xs text-green-400 mb-1">🟢 Low Risk</p>
              <p className="text-2xl font-bold text-green-400">{stats.low}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex gap-2">
            {["ALL", "URL", "EMAIL"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  filter === t
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {["ALL", "LOW", "MEDIUM", "HIGH"].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  riskFilter === r
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-4 py-3">
            ❌ {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && scans.length === 0 && (
          <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-400 mb-2">No scans yet</p>
            <p className="text-sm text-gray-500">
              Start by scanning a URL or analyzing an email
            </p>
          </div>
        )}

        {/* Filtered Empty */}
        {!loading && scans.length > 0 && filteredScans.length === 0 && (
          <div className="text-center py-10 bg-gray-900 border border-gray-800 rounded-2xl">
            <p className="text-gray-400">No scans match the selected filters</p>
          </div>
        )}

        {/* Scans List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredScans.map((scan, i) => (
            <HistoryCard key={scan.id} scan={scan} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
