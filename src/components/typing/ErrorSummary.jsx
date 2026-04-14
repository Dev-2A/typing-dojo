import { useMemo } from "react";
import { getMistakeKeys } from "../../utils/typing";

/**
 * 실시간 오타 요약 — 자주 틀리는 키 Top 5
 */
export default function ErrorSummary({ mistakes }) {
  const topMistakes = useMemo(() => {
    const keys = getMistakeKeys(mistakes);
    return keys.slice(0, 5);
  }, [mistakes]);

  // 상세 오류 목록: "expected → typed" 형태
  const detailedErrors = useMemo(() => {
    const errors = [];
    for (const expected of Object.keys(mistakes)) {
      for (const actual of Object.keys(mistakes[expected])) {
        errors.push({
          expected,
          actual,
          count: mistakes[expected][actual],
        });
      }
    }
    return errors.sort((a, b) => b.count - a.count).slice(0, 8);
  }, [mistakes]);

  if (topMistakes.length === 0) return null;

  const displayKey = (key) => {
    if (key === " ") return "␣";
    if (key === "\n") return "↵";
    if (key === "\t") return "⇥";
    return key;
  };

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          실시간 오타 분석
        </span>
      </div>

      {/* 자주 틀리는 키 Top 5 */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-gray-600">자주 틀리는 키</span>
        <div className="flex flex-wrap gap-2">
          {topMistakes.map(({ key, count }) => (
            <div
              key={key}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20"
            >
              <kbd className="text-sm font-mono font-bold text-red-400 min-w-[1.2em] text-center">
                {displayKey(key)}
              </kbd>
              <span className="text-[10px] text-red-400/70">×{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 상세 오류 */}
      {detailedErrors.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] text-gray-600">오타 상세</span>
          <div className="grid grid-cols-2 gap-1">
            {detailedErrors.map(({ expected, actual, count }, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 text-xs font-mono"
              >
                <kbd className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {displayKey(expected)}
                </kbd>
                <span className="text-gray-600">→</span>
                <kbd className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                  {displayKey(actual)}
                </kbd>
                <span className="text-[10px] text-gray-600">×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
