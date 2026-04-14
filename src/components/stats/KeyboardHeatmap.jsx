import { useMemo } from "react";
import {
  KEYBOARD_ROWS,
  buildKeyLookup,
  buildHeatmapData,
  getHeatIntensity,
} from "../../utils/keyboard";

/**
 * 키보드 히트맵 — 자주 틀리는 키를 열 분포로 시각화
 */
export default function KeyboardHeatmap({ mistakes }) {
  const heatmap = useMemo(() => buildHeatmapData(mistakes), [mistakes]);

  // 최대 오류 수 (색상 스케일 기준)
  const maxCount = useMemo(() => {
    const counts = Object.values(heatmap).map((h) => h.errorCount + h.hitCount);
    return Math.max(...counts, 1);
  }, [heatmap]);

  // 전체 오류 수
  const totalErrors = useMemo(() => {
    return Object.values(heatmap).reduce((sum, h) => sum + h.errorCount, 0);
  }, [heatmap]);

  if (totalErrors === 0) {
    return (
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-6 text-center">
        <span className="text-3xl block mb-2">✨</span>
        <p className="text-sm text-gray-400">오타가 없습니다! 완벽해요!</p>
      </div>
    );
  }

  // 키 하나에 대한 색상 계산
  const getKeyColor = (keyChar) => {
    // key와 shift 양쪽 체크
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

    if (intensity > 0.7) {
      return {
        bg: "bg-red-500/40",
        text: "text-red-300",
        ring: "ring-1 ring-red-500/50",
        count: total,
      };
    }
    if (intensity > 0.4) {
      return {
        bg: "bg-orange-500/30",
        text: "text-orange-300",
        ring: "ring-1 ring-orange-500/40",
        count: total,
      };
    }
    if (intensity > 0.15) {
      return {
        bg: "bg-yellow-500/20",
        text: "text-yellow-300",
        ring: "ring-1 ring-yellow-500/30",
        count: total,
      };
    }
    if (intensity > 0) {
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-200/80",
        ring: "",
        count: total,
      };
    }
    return { bg: "bg-gray-800/80", text: "text-gray-500", count: 0 };
  };

  // 행별 오프셋 (키보드 stagger)
  const rowOffsets = [0, 0.4, 0.7, 1.1, 2];

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 space-y-3">
      {/* 헤더 */}
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

      {/* 키보드 */}
      <div className="flex flex-col gap-1 items-center">
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

              // shift 문자도 히트맵에 반영
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
                    ${isSpace ? "h-8" : "h-10"}
                  `}
                  style={{
                    width: isSpace ? "16rem" : `${keyData.width * 2.5}rem`,
                    minWidth: isSpace ? "10rem" : "2.2rem",
                  }}
                  title={
                    combinedCount > 0
                      ? `${displayKey}: 오타 ${combinedCount}회`
                      : displayKey
                  }
                >
                  {/* Shift 문자 (좌상단) */}
                  {keyData.shift && !isSpace && (
                    <span
                      className={`text-[8px] leading-none ${
                        shiftColor && shiftColor.count > 0
                          ? shiftColor.text
                          : "text-gray-600"
                      }`}
                    >
                      {keyData.shift}
                    </span>
                  )}

                  {/* 기본 문자 */}
                  <span
                    className={`text-xs font-mono leading-none ${finalColor.text}`}
                  >
                    {displayKey}
                  </span>

                  {/* 오타 횟수 배지 */}
                  {combinedCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 text-[8px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {combinedCount > 9 ? "9+" : combinedCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 코드 특수문자 집중 분석 */}
      <CodeCharAnalysis heatmap={heatmap} />
    </div>
  );
}

/**
 * 코드 특수문자 집중 분석 — 괄호, 세미콜론 등
 */
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
