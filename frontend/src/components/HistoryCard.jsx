// frontend/src/components/HistoryCard.jsx

import { motion } from "framer-motion";
import RiskBadge from "./RiskBadge";

const typeIcon = {
  URL: "🔗",
  EMAIL: "📧",
};

export default function HistoryCard({ scan, index = 0 }) {
  const date = new Date(scan.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const displayContent =
    scan.content.length > 80 ? scan.content.slice(0, 80) + "..." : scan.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcon[scan.scan_type] || "📄"}</span>
          <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
            {scan.scan_type}
          </span>
        </div>
        <RiskBadge level={scan.risk_level} />
      </div>

      <p className="text-sm text-gray-300 font-mono break-all mb-3">
        {displayContent}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{date}</span>
        <span className="font-mono">
          Score: <span className="text-white">{scan.risk_score}</span>/100
        </span>
      </div>
    </motion.div>
  );
}
