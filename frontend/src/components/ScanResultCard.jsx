// frontend/src/components/ScanResultCard.jsx

import { motion } from "framer-motion";
import RiskBadge from "./RiskBadge";
import RiskScoreMeter from "./RiskScoreMeter";

export default function ScanResultCard({ result }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-6 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <RiskBadge level={result.riskLevel} emoji={result.emoji} />
          {result.trusted && (
            <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
              ✅ Trusted
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500">
          {result.protocol === "https:" ? "🔒 Secure" : "⚠️ Insecure"}
        </span>
      </div>

      {/* URL Display */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Scanned URL</p>
        <p className="text-white font-mono text-sm break-all">{result.url}</p>
      </div>

      {/* Risk Meter */}
      <div className="mb-5">
        <RiskScoreMeter score={result.riskScore} level={result.riskLevel} />
      </div>

      {/* Recommendation */}
      <div className="mb-5 p-4 bg-gray-800/60 rounded-lg border border-gray-700">
        <p className="text-sm text-gray-200">{result.recommendation}</p>
      </div>

      {/* Triggered Checks */}
      {result.triggeredChecks && result.triggeredChecks.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">
            Detection Reasons ({result.triggeredChecks.length})
          </p>
          <ul className="space-y-2">
            {result.triggeredChecks.map((check, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="flex items-start gap-2 text-sm text-gray-300 bg-gray-800/40 rounded-md px-3 py-2"
              >
                <span className="text-red-400 mt-0.5">⚠</span>
                <span className="flex-1">{check.message}</span>
                <span className="text-xs text-gray-500 font-mono">
                  +{check.weight}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}
