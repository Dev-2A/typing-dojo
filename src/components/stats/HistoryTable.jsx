import { useState, useMemo } from "react";
import { getHistory } from "../../utils/storage";
import { LANGUAGES } from "../../data/snippets";
import { DIFFICULTY_CONFIG, getGrade } from "../../utils/difficulty";

/**
 * 최근 타이핑 히스토리 테이블
 */
export default function HistoryTable() {
  const [showCount, setShowCount] = useState(10);
  const history = useMemo(() => getHistory().reverse(), []);

  if (history.length === 0) return null;

  const visible = history.slice(0, showCount);

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          최근 기록
        </span>
        <span className="text-[10px] text-gray-600">총 {history.length}회</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800/50">
              <th className="text-left py-2 px-2 text-gray-500 font-medium">
                날짜
              </th>
              <th className="text-left py-2 px-2 text-gray-500 font-medium">
                스니펫
              </th>
              <th className="text-center py-2 px-2 text-gray-500 font-medium">
                난이도
              </th>
              <th className="text-center py-2 px-2 text-gray-500 font-medium">
                등급
              </th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">
                WPM
              </th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">
                정확도
              </th>
              <th className="text-right py-2 px-2 text-gray-500 font-medium">
                점수
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((entry) => {
              const langInfo = LANGUAGES.find((l) => l.id === entry.language);
              const diffConfig = DIFFICULTY_CONFIG[entry.difficulty];
              const grade = entry.score ? getGrade(entry.score) : null;
              const dateStr = entry.date
                ? new Date(entry.date).toLocaleDateString("ko-KR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-";

              return (
                <tr
                  key={entry.id}
                  className="border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors"
                >
                  <td className="py-2 px-2 text-gray-500 whitespace-nowrap">
                    {dateStr}
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{langInfo?.icon}</span>
                      <span className="text-gray-300 truncate max-w-35">
                        {entry.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-2 px-2 text-center">
                    {diffConfig && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${diffConfig.bgColor} ${diffConfig.color}`}
                      >
                        {diffConfig.icon}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-center">
                    {grade && (
                      <span className={`font-bold ${grade.color}`}>
                        {grade.grade}
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-emerald-400">
                    {entry.wpm}
                  </td>
                  <td
                    className={`py-2 px-2 text-right font-mono ${
                      entry.accuracy >= 95
                        ? "text-emerald-400"
                        : entry.accuracy >= 80
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {entry.accuracy}%
                  </td>
                  <td className="py-2 px-2 text-right font-mono text-gray-300">
                    {entry.score || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 더 보기 */}
      {history.length > showCount && (
        <button
          onClick={() => setShowCount((prev) => prev + 10)}
          className="w-full py-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          더 보기 ({history.length - showCount}개 남음)
        </button>
      )}
    </div>
  );
}
