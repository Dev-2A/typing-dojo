import { useMemo } from "react";

/**
 * 컴팩트 통계 바 — 항상 표시, 고정 높이로 레이아웃 시프트 방지
 */
export default function LiveStats({
  wpm,
  accuracy,
  formattedTime,
  progress,
  correctCount,
  incorrectCount,
  status,
  samples,
}) {
  const trend = useMemo(() => {
    if (samples.length < 3) return "neutral";
    const recent = samples.slice(-3);
    const first = recent[0].wpm;
    const last = recent[recent.length - 1].wpm;
    if (last > first + 3) return "up";
    if (last < first - 3) return "down";
    return "neutral";
  }, [samples]);

  const trendIcon = { up: "↑", down: "↓", neutral: "→" };
  const trendColor = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-gray-500",
  };

  const wpmGrade = useMemo(() => {
    if (wpm >= 80)
      return {
        label: "고수",
        color: "text-purple-400",
        bg: "bg-purple-500/15",
      };
    if (wpm >= 60)
      return {
        label: "숙련",
        color: "text-emerald-400",
        bg: "bg-emerald-500/15",
      };
    if (wpm >= 40)
      return {
        label: "중급",
        color: "text-yellow-400",
        bg: "bg-yellow-500/15",
      };
    if (wpm >= 20)
      return { label: "초급", color: "text-blue-400", bg: "bg-blue-500/15" };
    return { label: "입문", color: "text-gray-400", bg: "bg-gray-500/15" };
  }, [wpm]);

  const isActive = status !== "idle";

  return (
    <div className="flex items-center gap-3 sm:gap-4 rounded-xl border border-gray-700/50 bg-gray-900/50 px-3 sm:px-4 py-2.5">
      {/* WPM */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider hidden sm:inline">
          WPM
        </span>
        <span
          className={`text-lg font-bold font-mono ${isActive ? "text-emerald-400" : "text-gray-600"}`}
        >
          {isActive ? wpm : "–"}
        </span>
        {isActive && (
          <>
            <span className={`text-xs ${trendColor[trend]}`}>
              {trendIcon[trend]}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.5 rounded-full ${wpmGrade.bg} ${wpmGrade.color} hidden sm:inline`}
            >
              {wpmGrade.label}
            </span>
          </>
        )}
      </div>

      <div className="w-px h-5 bg-gray-800" />

      {/* 정확도 */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider hidden sm:inline">
          정확도
        </span>
        <span
          className={`text-lg font-bold font-mono ${
            isActive
              ? accuracy >= 95
                ? "text-emerald-400"
                : accuracy >= 80
                  ? "text-yellow-400"
                  : "text-red-400"
              : "text-gray-600"
          }`}
        >
          {isActive ? `${accuracy}%` : "–"}
        </span>
      </div>

      <div className="w-px h-5 bg-gray-800" />

      {/* 시간 */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider hidden sm:inline">
          시간
        </span>
        <span
          className={`text-lg font-bold font-mono ${isActive ? "text-gray-200" : "text-gray-600"}`}
        >
          {isActive ? formattedTime : "0:00"}
        </span>
      </div>

      {/* 진행률 바 */}
      <div className="flex-1 items-center gap-2 hidden sm:flex ml-1">
        <div className="w-px h-5 bg-gray-800" />
        <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${isActive ? progress : 0}%` }}
          />
        </div>
        <span
          className={`text-xs font-bold font-mono min-w-10 text-right ${isActive ? "text-gray-300" : "text-gray-600"}`}
        >
          {isActive ? `${progress}%` : "0%"}
        </span>
      </div>

      {/* 정타 / 오타 */}
      {isActive && (
        <div className="items-center gap-1 text-sm font-mono hidden lg:flex">
          <div className="w-px h-5 bg-gray-800 mr-1" />
          <span className="text-emerald-400">{correctCount}</span>
          <span className="text-gray-600">/</span>
          <span className="text-red-400">{incorrectCount}</span>
        </div>
      )}
    </div>
  );
}
