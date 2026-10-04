// frontend/src/components/Navbar.jsx

export default function Navbar({ onMenuClick }) {
  return (
    <nav className="bg-gray-900/95 backdrop-blur border-b border-gray-800 px-4 md:px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-300 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition"
        aria-label="Open menu"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Logo (mobile) */}
      <div className="md:hidden text-white font-bold flex items-center gap-2">
        🛡️ <span>PhishGuard</span>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden md:block flex-1" />

      {/* Right side — date/time badge */}
      <div className="ml-auto flex items-center gap-2 text-xs text-gray-500">
        <span className="hidden sm:inline">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
          })}
        </span>
      </div>
    </nav>
  );
}
