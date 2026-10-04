// frontend/src/pages/URLScanner.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import { scanUrl } from "../services/scanService";
import ScanResultCard from "../components/ScanResultCard";

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScan = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);

    try {
      const response = await scanUrl(url.trim());
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message || "Scan failed");
      }
    } catch (err) {
      console.error(err);
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">🔍 URL Phishing Scanner</h1>
          <p className="text-gray-400">
            Paste any URL to check if it is safe or a phishing attempt
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          onSubmit={handleScan}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
        >
          <label className="block text-sm text-gray-400 mb-2">Enter URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />

          <div className="flex gap-3 mt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold transition"
            >
              {loading ? "Scanning..." : "Scan URL"}
            </button>

            {(url || result) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold transition"
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2"
            >
              ❌ {error}
            </motion.p>
          )}
        </motion.form>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center mt-8">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Result */}
        {result && <ScanResultCard result={result} />}
      </div>
    </div>
  );
}
