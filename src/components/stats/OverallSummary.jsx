import { useMemo, useState } from "react";
import { getHistory } from "../../utils/storage";

/**
 * 전체 요약 통계 카드
 */
export default function OverallSummary() {
  // 마운트 시점 timestamp를 한 번만 캡처 (pure)
  const [mountTime] = useState(() => Date.now());

  const stats = useMemo(() => {
    const history = getHistory();
    if (history.length === 0) return null;

    const totalSessions = history.length;
    const avgWpm = Math.round(
      history.reduce((sum, h) => sum + h.wpm, 0) / totalSessions,
    );
    const avgAccuracy = Math.round(
      history.reduce((sum, h) => sum + h.accuracy, 0) / totalSessions,
    );
    const bestWpm = Math.max(...history.map((h) => h.wpm));
    const bestScore = Math.max(...history.map((h) => h.score || 0));
    const totalTime = history.reduce((sum, h) => sum + (h.elapsed || 0), 0);
    const totalChars = history.reduce(
      (sum, h) => sum + (h.correctCount || 0) + (h.incorrectCount || 0),
      0,
    );
    const uniqueSnippets = new Set(history.map((h) => h.snippetId)).size;

    // 최근 7일 vs 이전 7일 WPM 비교
    const week = 7 * 24 * 60 * 60 * 1000;
    const recentWeek = history.filter(
      (h) => mountTime - new Date(h.date).getTime() < week,
    );
    const prevWeek = history.filter((h) => {
      const age = mountTime - new Date(h.date).getTime();
      return age >= week && age < week * 2;
    });

    let wpmTrend = "neutral";
    if (recentWeek.length > 0 && prevWeek.length > 0) {
      const recentAvg =
        recentWeek.reduce((s, h) => s + h.wpm, 0) / recentWeek.length;
      const prevAvg = prevWeek.reduce((s, h) => s + h.wpm, 0) / prevWeek.length;
      if (recentAvg > prevAvg + 2) wpmTrend = "up";
      else if (recentAvg < prevAvg - 2) wpmTrend = "down";
    }

    return {
      totalSessions,
      avgWpm,
      avgAccuracy,
      bestWpm,
      bestScore,
      totalTime,
      totalChars,
      uniqueSnippets,
      wpmTrend,
    };
  }, [mountTime]);

  if (!stats) return null;

  const formatTime = (ms) => {
    const totalMin = Math.floor(ms / 60000);
    if (totalMin < 60) return `${totalMin}분`;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}시간 ${m}분`;
  };

  const trendIcon = { up: "📈", down: "📉", neutral: "➡️" };
  const trendText = { up: "상승세", down: "하락세", neutral: "유지 중" };
  const trendColor = {
    up: "text-emerald-400",
    down: "text-red-400",
    neutral: "text-gray-400",
  };

  const cards = [
    {
      label: "총 연습",
      value: `${stats.totalSessions}회`,
      icon: "🏋️",
      color: "text-gray-200",
    },
    {
      label: "평균 WPM",
      value: stats.avgWpm,
      icon: "⌨️",
      color: "text-emerald-400",
      sub: `${trendIcon[stats.wpmTrend]} ${trendText[stats.wpmTrend]}`,
      subColor: trendColor[stats.wpmTrend],
    },
    {
      label: "최고 WPM",
      value: stats.bestWpm,
      icon: "🏆",
      color: "text-yellow-400",
    },
    {
      label: "평균 정확도",
      value: `${stats.avgAccuracy}%`,
      icon: "🎯",
      color: "text-blue-400",
    },
    {
      label: "최고 점수",
      value: stats.bestScore,
      icon: "⭐",
      color: "text-purple-400",
    },
    {
      label: "연습 시간",
      value: formatTime(stats.totalTime),
      icon: "⏱️",
      color: "text-gray-300",
    },
    {
      label: "총 입력",
      value: `${stats.totalChars.toLocaleString()}자`,
      icon: "✏️",
      color: "text-gray-300",
    },
    {
      label: "스니펫",
      value: `${stats.uniqueSnippets}종`,
      icon: "📝",
      color: "text-gray-300",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-3 text-center"
        >
          <div className="text-lg mb-1">{card.icon}</div>
          <div className={`text-xl font-bold font-mono ${card.color}`}>
            {card.value}
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">{card.label}</div>
          {card.sub && (
            <div className={`text-[10px] mt-0.5 ${card.subColor}`}>
              {card.sub}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
