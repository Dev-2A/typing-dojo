import { useMemo } from "react";

/**
 * 실시간 통계 대시보드 — WPM, 정확도, 시간, 진행률, 문자 수
 */
export default function LiveStats({
  wpm,
  accuracy,
  formattedTime,
  progress,
  correctCount,
  incorrectCount,
  typed,
  originalLength,
  status,
  samples,
}) {
  // 최근 5초간 WPM 추세 (상승/하락/유지)
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

  // WPM 등급
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

  if (status === "idle") return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {/* WPM */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
          WPM
        </div>
        <div className="flex items-center justify-center gap-1">
          <span className="text-2xl font-bold font-mono text-emerald-400">
            {wpm}
          </span>
          <span className={`text-xs ${trendColor[trend]}`}>
            {trendIcon[trend]}
          </span>
        </div>
        <div
          className={`text-[10px] mt-1 px-2 py-0.5 rounded-full inline-block ${wpmGrade.bg} ${wpmGrade.color}`}
        >
          {wpmGrade.label}
        </div>
      </div>

      {/* 정확도 */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
          정확도
        </div>
        <span
          className={`text-2xl font-bold font-mono ${
            accuracy >= 95
              ? "text-emerald-400"
              : accuracy >= 80
                ? "text-yellow-400"
                : "text-red-400"
          }`}
        >
          {accuracy}
          <span className="text-sm">%</span>
        </span>
        {/* 정확도 미니 바 */}
        <div className="mt-1.5 h-1 bg-gray-800 rounded-full overflow-hidden mx-2">
          <div
            className={`h-full rounded-full transition-all ${
              accuracy >= 95
                ? "bg-emerald-500"
                : accuracy >= 80
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      {/* 경과 시간 */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
          시간
        </div>
        <span className="text-2xl font-bold font-mono text-gray-200">
          {formattedTime}
        </span>
      </div>

      {/* 진행률 */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
          진행률
        </div>
        <span className="text-2xl font-bold font-mono text-gray-200">
          {progress}
          <span className="text-sm">%</span>
        </span>
        <div className="mt-1.5 h-1 bg-gray-800 rounded-full overflow-hidden mx-2">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 정타 / 오타 */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
          정타 / 오타
        </div>
        <div className="flex items-center justify-center gap-1 text-lg font-bold font-mono">
          <span className="text-emerald-400">{correctCount}</span>
          <span className="text-gray-600">/</span>
          <span className="text-red-400">{incorrectCount}</span>
        </div>
      </div>

      {/* 문자 수 */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 text-center">
        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
          문자
        </div>
        <div className="text-lg font-bold font-mono text-gray-300">
          {typed.length}
          <span className="text-sm text-gray-600">/{originalLength}</span>
        </div>
      </div>
    </div>
  );
}
