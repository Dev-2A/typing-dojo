import { useState } from "react";

const navItems = [
  { id: "practice", label: "연습", icon: "⌨️" },
  { id: "daily", label: "매일 도전", icon: "🔥" },
  { id: "stats", label: "통계", icon: "📊" },
];

export default function Header({ currentPage, onNavigate }) {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => onNavigate("practice")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">⌨️</span>
          <span className="text-lg font-bold text-white">
            Typing <span className="text-emerald-400">Dojo</span>
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              }`}
            >
              <span className="mr-1.5">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
