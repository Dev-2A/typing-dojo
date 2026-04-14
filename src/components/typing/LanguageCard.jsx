import { useMemo, useState } from "react";
import { LANGUAGES, getFilteredSnippets } from "../../data/snippets";
import { getHistory } from "../../utils/storage";

export default function LanguageCard({ selectedLanguage, onSelect }) {
  const [mountTime] = useState(() => Date.now());

  const history = useMemo(() => getHistory(), [mountTime]);

  const langStats = useMemo(() => {
    const stats = {};
    for (const lang of LANGUAGES) {
      if (lang.id === "all") continue;
      const snippets = getFilteredSnippets(lang.id);
      const cleared = new Set(
        history.filter((h) => h.language === lang.id).map((h) => h.snippetId),
      );
      stats[lang.id] = {
        total: snippets.length,
        cleared: cleared.size,
      };
    }
    return stats;
  }, [history]);

  return (
    <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-9 gap-1.5 sm:gap-2">
      {LANGUAGES.map((lang) => {
        const isAll = lang.id === "all";
        const isSelected = selectedLanguage === lang.id;
        const stats = langStats[lang.id];

        return (
          <button
            key={lang.id}
            onClick={() => onSelect(lang.id)}
            className={`relative flex flex-col items-center gap-0.5 sm:gap-1 p-2 sm:p-3 rounded-xl border transition-all ${
              isSelected
                ? "bg-emerald-500/10 border-emerald-500/40 scale-105"
                : "bg-gray-900/50 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/50"
            }`}
          >
            <span className="text-xl sm:text-2xl">{lang.icon}</span>
            <span
              className={`text-[10px] sm:text-xs font-medium truncate w-full text-center ${isSelected ? "text-emerald-400" : "text-gray-300"}`}
            >
              {lang.label}
            </span>

            {!isAll && stats && (
              <span className="text-[8px] sm:text-[9px] text-gray-600">
                {stats.cleared}/{stats.total}
              </span>
            )}

            {!isAll &&
              stats &&
              stats.cleared >= stats.total &&
              stats.total > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px]">⭐</span>
              )}
          </button>
        );
      })}
    </div>
  );
}
