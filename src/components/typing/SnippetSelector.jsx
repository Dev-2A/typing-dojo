import { useState, useMemo } from "react";
import {
  LANGUAGES,
  DIFFICULTIES,
  getFilteredSnippets,
  getRandomSnippet,
} from "../../data/snippets";

export default function SnippetSelector({ onSelect, currentSnippetId }) {
  const [language, setLanguage] = useState("all");
  const [difficulty, setDifficulty] = useState("all");
  const [isListOpen, setIsListOpen] = useState(false);

  const filtered = useMemo(
    () => getFilteredSnippets(language, difficulty),
    [language, difficulty],
  );

  const handleRandom = () => {
    const snippet = getRandomSnippet(language, difficulty);
    if (snippet) {
      onSelect(snippet);
      setIsListOpen(false);
    }
  };

  const difficultyBadge = (diff) => {
    const colors = {
      easy: "bg-green-500/15 text-green-400 border-green-500/30",
      medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
      hard: "bg-red-500/15 text-red-400 border-red-500/30",
    };
    const labels = { easy: "초급", medium: "중급", hard: "고급" };
    return (
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded border ${colors[diff]}`}
      >
        {labels[diff]}
      </span>
    );
  };

  return (
    <div className="space-y-3">
      {/* 필터 바 */}
      <div className="flex flex-wrap items-center gap-3">
        {/* 언어 필터 */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 mr-1">언어</span>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                language === lang.id
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent"
              }`}
            >
              <span className="mr-1">{lang.icon}</span>
              {lang.label}
            </button>
          ))}
        </div>

        {/* 난이도 필터 */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 mr-1">난이도</span>
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setDifficulty(diff.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                difficulty === diff.id
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent"
              }`}
            >
              {diff.label}
            </button>
          ))}
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleRandom}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
          >
            🎲 랜덤 선택
          </button>
          <button
            onClick={() => setIsListOpen(!isListOpen)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700 transition-colors"
          >
            {isListOpen ? "목록 닫기" : `📋 목록 (${filtered.length})`}
          </button>
        </div>
      </div>

      {/* 스니펫 목록 드롭다운 */}
      {isListOpen && (
        <div className="rounded-xl border border-gray-700/50 bg-gray-900/80 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 text-sm">
              해당 조건의 스니펫이 없습니다
            </div>
          ) : (
            filtered.map((snippet) => (
              <button
                key={snippet.id}
                onClick={() => {
                  onSelect(snippet);
                  setIsListOpen(false);
                }}
                className={`w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-800/60 transition-colors border-b border-gray-800/50 last:border-b-0 ${
                  currentSnippetId === snippet.id ? "bg-emerald-500/10" : ""
                }`}
              >
                <span className="text-base">
                  {LANGUAGES.find((l) => l.id === snippet.language)?.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-200 truncate">
                    {snippet.title}
                  </div>
                  <div className="text-xs text-gray-500 font-mono truncate mt-0.5">
                    {snippet.code.split("\n")[0]}
                  </div>
                </div>
                {difficultyBadge(snippet.difficulty)}
                <span className="text-[10px] text-gray-600">
                  {snippet.code.length}자
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
