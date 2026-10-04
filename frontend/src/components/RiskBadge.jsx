// frontend/src/components/RiskBadge.jsx

const colorMap = {
  LOW: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    border: "border-green-500/50",
    dot: "bg-green-400",
  },
  MEDIUM: {
    bg: "bg-yellow-500/20",
    text: "text-yellow-400",
    border: "border-yellow-500/50",
    dot: "bg-yellow-400",
  },
  HIGH: {
    bg: "bg-red-500/20",
    text: "text-red-400",
    border: "border-red-500/50",
    dot: "bg-red-400",
  },
  UNKNOWN: {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/50",
    dot: "bg-gray-400",
  },
};

export default function RiskBadge({ level = "UNKNOWN", emoji }) {
  const colors = colorMap[level] || colorMap.UNKNOWN;

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
      {emoji && <span>{emoji}</span>}
      {level}
    </span>
  );
}
