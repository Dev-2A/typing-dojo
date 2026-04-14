import { useMemo } from "react";

/**
 * 실시간 WPM 미니 차트 — SVG 기반 라인 차트
 */
export default function WpmChart({ samples }) {
  const chartData = useMemo(() => {
    if (samples.length < 2) return null;

    const maxWpm = Math.max(...samples.map((s) => s.wpm), 10);
    const width = 400;
    const height = 80;
    const padX = 0;
    const padY = 4;

    const points = samples.map((s, i) => {
      const x = padX + (i / (samples.length - 1)) * (width - padX * 2);
      const y = padY + (1 - s.wpm / maxWpm) * (height - padY * 2);
      return { x, y, wpm: s.wpm, time: s.time };
    });

    // SVG path
    const pathD = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    // 그라데이션 area path
    const areaD =
      pathD +
      ` L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    return { points, pathD, areaD, maxWpm, width, height };
  }, [samples]);

  if (!chartData) return null;

  const { pathD, areaD, maxWpm, width, height, points } = chartData;
  const currentWpm = points[points.length - 1]?.wpm || 0;

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
          WPM 추이
        </span>
        <span className="text-xs text-gray-400 font-mono">
          최고 {maxWpm} WPM
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 배경 그리드 */}
        {[0.25, 0.5, 0.75].map((ratio) => (
          <line
            key={ratio}
            x1={0}
            y1={height * ratio}
            x2={width}
            y2={height * ratio}
            stroke="#374151"
            strokeWidth={0.5}
            strokeDasharray="4 4"
          />
        ))}

        {/* 영역 */}
        <path d={areaD} fill="url(#wpmGradient)" />

        {/* 라인 */}
        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* 마지막 포인트 */}
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r={3}
            fill="#10b981"
            stroke="#064e3b"
            strokeWidth={1.5}
          />
        )}
      </svg>

      <div className="flex justify-between mt-1 text-[10px] text-gray-600 font-mono">
        <span>0초</span>
        <span>
          {points[points.length - 1]?.time || 0}초 · {currentWpm} WPM
        </span>
      </div>
    </div>
  );
}
