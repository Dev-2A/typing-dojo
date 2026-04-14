import { useMemo } from "react";
import { getDailyStats } from "../../utils/storage";

/**
 * 일별 WPM · 정확도 성장 추이 SVG 차트
 */
export default function GrowthChart() {
  const dailyStats = useMemo(() => getDailyStats(), []);

  // 최근 30일만
  const data = useMemo(() => dailyStats.slice(-30), [dailyStats]);

  // X축 라벨 (최대 7개)
  const xLabels = useMemo(() => {
    if (data.length <= 1) return [];
    if (data.length <= 7)
      return data.map((d, i) => ({ i, label: d.date.slice(5) }));
    const step = Math.floor(data.length / 6);
    const labels = [];
    for (let i = 0; i < data.length; i += step) {
      labels.push({ i, label: data[i].date.slice(5) });
    }
    if (labels[labels.length - 1].i !== data.length - 1) {
      labels.push({
        i: data.length - 1,
        label: data[data.length - 1].date.slice(5),
      });
    }
    return labels;
  }, [data]);

  // 빈 상태 체크 (훅 이후에 처리)
  if (data.length < 1) {
    return (
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-8 text-center">
        <span className="text-4xl block mb-3">📈</span>
        <p className="text-sm text-gray-400">아직 기록이 없습니다</p>
        <p className="text-xs text-gray-600 mt-1">
          연습 모드에서 타이핑을 완료하면 성장 기록이 쌓여요
        </p>
      </div>
    );
  }

  const width = 600;
  const height = 200;
  const padLeft = 40;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 28;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const maxWpm = Math.max(...data.map((d) => d.avgWpm), 20);
  const maxAcc = 100;

  // WPM 포인트
  const wpmPoints = data.map((d, i) => ({
    x: padLeft + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padTop + (1 - d.avgWpm / maxWpm) * chartH,
    value: d.avgWpm,
    date: d.date,
    count: d.count,
  }));

  // 정확도 포인트
  const accPoints = data.map((d, i) => ({
    x: padLeft + (i / Math.max(data.length - 1, 1)) * chartW,
    y: padTop + (1 - d.avgAccuracy / maxAcc) * chartH,
    value: d.avgAccuracy,
  }));

  const toPath = (points) =>
    points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const toArea = (points) =>
    toPath(points) +
    ` L ${points[points.length - 1].x} ${padTop + chartH}` +
    ` L ${points[0].x} ${padTop + chartH} Z`;

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          성장 추이 (최근 30일)
        </span>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />
            <span className="text-gray-500">평균 WPM</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-blue-500 rounded-full inline-block" />
            <span className="text-gray-500">평균 정확도</span>
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <defs>
          <linearGradient id="growthWpmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="growthAccGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y축 그리드 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padTop + ratio * chartH;
          return (
            <g key={ratio}>
              <line
                x1={padLeft}
                y1={y}
                x2={padLeft + chartW}
                y2={y}
                stroke="#1f2937"
                strokeWidth={0.5}
              />
              <text
                x={padLeft - 4}
                y={y + 3}
                textAnchor="end"
                className="text-[9px] fill-gray-600"
              >
                {Math.round(maxWpm * (1 - ratio))}
              </text>
            </g>
          );
        })}

        {/* X축 라벨 */}
        {xLabels.map(({ i, label }) => {
          const x = padLeft + (i / Math.max(data.length - 1, 1)) * chartW;
          return (
            <text
              key={i}
              x={x}
              y={height - 4}
              textAnchor="middle"
              className="text-[9px] fill-gray-600"
            >
              {label}
            </text>
          );
        })}

        {/* 정확도 영역 + 라인 */}
        {accPoints.length > 1 && (
          <>
            <path d={toArea(accPoints)} fill="url(#growthAccGrad)" />
            <path
              d={toPath(accPoints)}
              fill="none"
              stroke="#3b82f6"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.7}
            />
          </>
        )}

        {/* WPM 영역 + 라인 */}
        {wpmPoints.length > 1 && (
          <>
            <path d={toArea(wpmPoints)} fill="url(#growthWpmGrad)" />
            <path
              d={toPath(wpmPoints)}
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* WPM 점 */}
        {wpmPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={3}
            fill="#10b981"
            stroke="#064e3b"
            strokeWidth={1}
          >
            <title>
              {p.date}: 평균 {p.value} WPM ({p.count}회)
            </title>
          </circle>
        ))}
      </svg>
    </div>
  );
}
