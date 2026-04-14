import { useState, useMemo } from "react";
import {
  LANGUAGES,
  DIFFICULTIES,
  getFilteredSnippets,
  getRandomSnippet,
} from "../../data/snippets";
import { DIFFICULTY_CONFIG } from "../../utils/difficulty";
import LanguageCard from "./LanguageCard";

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
    const config = DIFFICULTY_CONFIG[diff];
    return (
      <span
        className={`text-[10px] px-1.5 py-0.5 rounded border ${config.bgColor} ${config.color} ${config.borderColor}`}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* 언어 카드 선택 */}
      <LanguageCard selectedLanguage={language} onSelect={setLanguage} />

      {/* 난이도 + 액션 */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* 난이도 필터 */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
          <span className="text-xs text-gray-500 mr-0.5 sm:mr-1 shrink-0">
            난이도
          </span>
          {DIFFICULTIES.map((diff) => {
            const config =
              diff.id !== "all" ? DIFFICULTY_CONFIG[diff.id] : null;
            return (
              <button
                key={diff.id}
                onClick={() => setDifficulty(diff.id)}
                className={`px-2 sm:px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  difficulty === diff.id
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-transparent"
                }`}
              >
                {config ? `${config.icon} ` : ""}
                {diff.label}
              </button>
            );
          })}
        </div>

        {/* 액션 */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleRandom}
            disabled={filtered.length === 0}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            🎲 랜덤
          </button>
          <button
            onClick={() => setIsListOpen(!isListOpen)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700 transition-colors whitespace-nowrap"
          >
            {isListOpen ? "닫기" : `📋 ${filtered.length}개`}
          </button>
        </div>
      </div>

      {/* 스니펫 목록 */}
      {isListOpen && (
        <div className="rounded-xl border border-gray-700/50 bg-gray-900/80 max-h-72 overflow-y-auto animate-fade-in">
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
                className={`w-full px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3 text-left hover:bg-gray-800/60 transition-colors border-b border-gray-800/50 last:border-b-0 ${
                  currentSnippetId === snippet.id ? "bg-emerald-500/10" : ""
                }`}
              >
                <span className="text-lg shrink-0">
                  {LANGUAGES.find((l) => l.id === snippet.language)?.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-200 truncate">
                      {snippet.title}
                    </span>
                    {difficultyBadge(snippet.difficulty)}
                  </div>
                  <div className="text-xs text-gray-500 font-mono truncate mt-0.5">
                    {snippet.code.split("\n")[0]}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-0.5 text-[10px] text-gray-600 shrink-0">
                  <span>{snippet.code.length}자</span>
                  <span>{snippet.code.split("\n").length}줄</span>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
