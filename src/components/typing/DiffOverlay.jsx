import { useMemo } from "react";
import { getLineResults } from "../../utils/typing";

/**
 * 줄 단위 diff 시각화 — 원본 vs 타이핑 비교 패널
 * 각 줄의 상태: complete(전부 정타), has-error(오타 포함), in-progress(입력 중), pending(미입력)
 */
export default function DiffOverlay({ originalCode, typed }) {
  const lineResults = useMemo(
    () => getLineResults(originalCode, typed),
    [originalCode, typed],
  );

  // 각 줄의 상태 판별
  const getLineStatus = (line) => {
    const hasTyped = line.chars.some((c) => c.status !== "pending");
    const allTyped = line.chars.every((c) => c.status !== "pending");
    const hasError = line.chars.some((c) => c.status === "incorrect");

    if (!hasTyped) return "pending";
    if (hasError) return "has-error";
    if (allTyped) return "complete";
    return "in-progress";
  };

  const lineStatusStyles = {
    complete: "border-l-emerald-500/60 bg-emerald-500/5",
    "has-error": "border-l-red-500/60 bg-red-500/5",
    "in-progress": "border-l-yellow-500/60 bg-yellow-500/5",
    pending: "border-l-gray-700/30 bg-transparent",
  };

  const lineStatusIcons = {
    complete: "✓",
    "has-error": "✗",
    "in-progress": "›",
    pending: " ",
  };

  const lineStatusColors = {
    complete: "text-emerald-500",
    "has-error": "text-red-500",
    "in-progress": "text-yellow-500",
    pending: "text-gray-700",
  };

  // 전체 통계
  const stats = useMemo(() => {
    const total = lineResults.length;
    const complete = lineResults.filter(
      (l) => getLineStatus(l) === "complete",
    ).length;
    const errors = lineResults.filter(
      (l) => getLineStatus(l) === "has-error",
    ).length;
    return { total, complete, errors };
  }, [lineResults]);

  return (
    <div className="space-y-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          라인 diff
        </span>
        <div className="flex items-center gap-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
            완료 {stats.complete}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500/60" />
            오류 {stats.errors}
          </span>
          <span>전체 {stats.total}줄</span>
        </div>
      </div>

      {/* 줄 단위 diff */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 overflow-hidden font-mono text-[13px]">
        {lineResults.map((line) => {
          const status = getLineStatus(line);

          return (
            <div
              key={line.lineNum}
              className={`flex border-l-2 ${lineStatusStyles[status]} transition-colors duration-150`}
            >
              {/* 줄 번호 */}
              <div className="w-10 shrink-0 flex items-center justify-center text-[10px] text-gray-600 select-none border-r border-gray-800/50">
                {line.lineNum}
              </div>

              {/* 상태 아이콘 */}
              <div
                className={`w-6 shrink-0 flex items-center justify-center text-[10px] ${lineStatusColors[status]}`}
              >
                {lineStatusIcons[status]}
              </div>

              {/* 코드 내용 */}
              <div className="flex-1 px-2 py-0.5 whitespace-pre overflow-x-auto">
                {line.chars.map((cr, i) => (
                  <span
                    key={i}
                    className={
                      cr.status === "correct"
                        ? "text-emerald-400"
                        : cr.status === "incorrect"
                          ? "text-red-400 bg-red-500/20 rounded-sm relative group"
                          : "text-gray-600"
                    }
                    title={
                      cr.status === "incorrect"
                        ? `기대: "${cr.char === " " ? "␣" : cr.char}" → 입력: "${cr.typed === " " ? "␣" : cr.typed}"`
                        : undefined
                    }
                  >
                    {cr.char === "\n"
                      ? ""
                      : cr.char === " "
                        ? "\u00A0"
                        : cr.char}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
