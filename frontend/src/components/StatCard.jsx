// frontend/src/components/StatCard.jsx

import { motion } from "framer-motion";

const colorVariants = {
  blue: "border-blue-500/30 text-blue-400",
  red: "border-red-500/30 text-red-400",
  yellow: "border-yellow-500/30 text-yellow-400",
  green: "border-green-500/30 text-green-400",
  purple: "border-purple-500/30 text-purple-400",
  gray: "border-gray-500/30 text-gray-400",
};

export default function StatCard({
  title,
  value,
  icon,
  color = "blue",
  delay = 0,
}) {
  const variant = colorVariants[color] || colorVariants.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gray-900 border rounded-xl p-5 ${variant.split(" ")[0]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${variant.split(" ")[1]}`}>{value}</p>
    </motion.div>
  );
}
