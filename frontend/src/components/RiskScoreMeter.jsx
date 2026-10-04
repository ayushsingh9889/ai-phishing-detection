// frontend/src/components/RiskScoreMeter.jsx

import { motion } from "framer-motion";

const barColor = {
  LOW: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-red-500",
  UNKNOWN: "bg-gray-500",
};

export default function RiskScoreMeter({ score = 0, level = "UNKNOWN" }) {
  const safeScore = Math.max(0, Math.min(100, score));
  const color = barColor[level] || barColor.UNKNOWN;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>Risk Score</span>
        <span className="font-semibold text-white">{safeScore}/100</span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
