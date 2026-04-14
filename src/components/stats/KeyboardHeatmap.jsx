import { useMemo } from "react";
import {
  KEYBOARD_ROWS,
  buildHeatmapData,
  getHeatIntensity,
} from "../../utils/keyboard";

export default function KeyboardHeatmap({ mistakes }) {
  const heatmap = useMemo(() => buildHeatmapData(mistakes), [mistakes]);

  const maxCount = useMemo(() => {
    const counts = Object.values(heatmap).map((h) => h.errorCount + h.hitCount);
    return Math.max(...counts, 1);
  }, [heatmap]);

  const totalErrors = useMemo(() => {
    return Object.values(heatmap).reduce((sum, h) => sum + h.errorCount, 0);
  }, [heatmap]);

  if (totalErrors === 0) {
    return (
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 text-center animate-fade-in">
        <span className="text-3xl block mb-2">✨</span>
        <p className="text-sm text-gray-400">오타가 없습니다! 완벽해요!</p>
      </div>
    );
  }

  const getKeyColor = (keyChar) => {
    const data =
      heatmap[keyChar] ||
      heatmap[keyChar.toLowerCase()] ||
      heatmap[keyChar.toUpperCase()];
    if (!data) return { bg: "bg-gray-800/80", text: "text-gray-500", count: 0 };

    const intensity = getHeatIntensity(
      data.errorCount,
      data.hitCount,
      maxCount,
    );
    const total = data.errorCount + data.hitCount;

    if (intensity > 0.7)
      return {
        bg: "bg-red-500/40",
        text: "text-red-300",
        ring: "ring-1 ring-red-500/50",
        count: total,
      };
    if (intensity > 0.4)
      return {
        bg: "bg-orange-500/30",
        text: "text-orange-300",
        ring: "ring-1 ring-orange-500/40",
        count: total,
      };
    if (intensity > 0.15)
      return {
        bg: "bg-yellow-500/20",
        text: "text-yellow-300",
        ring: "ring-1 ring-yellow-500/30",
        count: total,
      };
    if (intensity > 0)
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-200/80",
        ring: "",
        count: total,
      };
    return { bg: "bg-gray-800/80", text: "text-gray-500", count: 0 };
  };

  const rowOffsets = [0, 0.4, 0.7, 1.1, 2];

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 sm:p-4 space-y-3 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          키보드 히트맵
        </span>
        <span className="text-[10px] text-gray-500">
          총 오타 {totalErrors}회
        </span>
      </div>

      {/* 범례 */}
      <div className="flex items-center gap-2 text-[10px] text-gray-500">
        <span>적음</span>
        <div className="flex gap-0.5">
          <span className="w-4 h-3 rounded-sm bg-gray-800/80" />
          <span className="w-4 h-3 rounded-sm bg-yellow-500/10" />
          <span className="w-4 h-3 rounded-sm bg-yellow-500/20" />
          <span className="w-4 h-3 rounded-sm bg-orange-500/30" />
          <span className="w-4 h-3 rounded-sm bg-red-500/40" />
        </div>
        <span>많음</span>
      </div>

      {/* 키보드 — 모바일에서 가로 스크롤 */}
      <div className="overflow-x-auto pb-2">
        <div className="flex flex-col gap-1 items-center min-w-125">
          {KEYBOARD_ROWS.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex gap-1"
              style={{ paddingLeft: `${rowOffsets[rowIdx] * 2.2}rem` }}
            >
              {row.map((keyData) => {
                const color = getKeyColor(keyData.key);
                const shiftColor = keyData.shift
                  ? getKeyColor(keyData.shift)
                  : null;
                const combinedCount = color.count + (shiftColor?.count || 0);
                const finalColor =
                  combinedCount > 0
                    ? shiftColor && shiftColor.count > color.count
                      ? shiftColor
                      : color
                    : color;
                const isSpace = keyData.key === " ";
                const displayKey = keyData.label || keyData.key;

                return (
                  <div
                    key={keyData.key}
                    className={`
                      relative flex flex-col items-center justify-center rounded-md
                      border border-gray-700/40 transition-all cursor-default
                      ${finalColor.bg} ${finalColor.ring || ""}
                      ${isSpace ? "h-7 sm:h-8" : "h-8 sm:h-10"}
                    `}
                    style={{
                      width: isSpace ? "14rem" : `${keyData.width * 2.2}rem`,
                      minWidth: isSpace ? "8rem" : "2rem",
                    }}
                    title={
                      combinedCount > 0
                        ? `${displayKey}: 오타 ${combinedCount}회`
                        : displayKey
                    }
                  >
                    {keyData.shift && !isSpace && (
                      <span
                        className={`text-[7px] sm:text-[8px] leading-none ${
                          shiftColor && shiftColor.count > 0
                            ? shiftColor.text
                            : "text-gray-600"
                        }`}
                      >
                        {keyData.shift}
                      </span>
                    )}
                    <span
                      className={`text-[10px] sm:text-xs font-mono leading-none ${finalColor.text}`}
                    >
                      {displayKey}
                    </span>
                    {combinedCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 text-[7px] sm:text-[8px] font-bold bg-red-500 text-white rounded-full w-3.5 h-3.5 sm:w-4 sm:h-4 flex items-center justify-center">
                        {combinedCount > 9 ? "9+" : combinedCount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 코드 특수문자 분석 */}
      <CodeCharAnalysis heatmap={heatmap} />
    </div>
  );
}

function CodeCharAnalysis({ heatmap }) {
  const codeChars = useMemo(() => {
    const targets = [
      { chars: ["{", "}"], label: "중괄호" },
      { chars: ["(", ")"], label: "소괄호" },
      { chars: ["[", "]"], label: "대괄호" },
      { chars: ["<", ">"], label: "꺾쇠" },
      { chars: [";"], label: "세미콜론" },
      { chars: [":"], label: "콜론" },
      { chars: ['"', "'", "`"], label: "따옴표" },
      { chars: ["/", "\\"], label: "슬래시" },
      { chars: ["."], label: "마침표" },
      { chars: ["=", "+", "-", "*"], label: "연산자" },
      { chars: ["_"], label: "언더스코어" },
    ];

    return targets
      .map((t) => {
        const total = t.chars.reduce((sum, c) => {
          const data = heatmap[c];
          return sum + (data ? data.errorCount + data.hitCount : 0);
        }, 0);
        return { ...t, total };
      })
      .filter((t) => t.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [heatmap]);

  if (codeChars.length === 0) return null;

  return (
    <div className="pt-2 border-t border-gray-800/50 space-y-1.5">
      <span className="text-[10px] text-gray-600">코드 특수문자 오타 분포</span>
      <div className="flex flex-wrap gap-1.5">
        {codeChars.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-gray-800/60 border border-gray-700/40"
          >
            <span className="text-[10px] text-gray-400">{item.label}</span>
            <kbd className="text-xs font-mono text-red-400">
              {item.chars.join(" ")}
            </kbd>
            <span className="text-[10px] text-red-400/70">×{item.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
