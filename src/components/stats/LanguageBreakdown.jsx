import { useMemo } from "react";
import { LANGUAGES } from "../../data/snippets";
import { getLanguageStats } from "../../utils/storage";

/**
 * 언어별 통계 분석 테이블
 */
export default function LanguageBreakdown() {
  const langStats = useMemo(() => getLanguageStats(), []);

  if (langStats.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 space-y-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        언어별 통계
      </span>

      <div className="space-y-2">
        {langStats.map((stat) => {
          const langInfo = LANGUAGES.find((l) => l.id === stat.language);
          const wpmBarWidth = Math.min((stat.avgWpm / 100) * 100, 100);
          const accBarWidth = stat.avgAccuracy;

          return (
            <div
              key={stat.language}
              className="rounded-lg border border-gray-800/50 bg-gray-800/30 p-3"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{langInfo?.icon || "📄"}</span>
                  <span className="text-sm font-medium text-gray-200">
                    {langInfo?.label || stat.language}
                  </span>
                  <span className="text-[10px] text-gray-600">
                    {stat.count}회
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-emerald-400">
                    최고 {stat.bestWpm} WPM
                  </span>
                </div>
              </div>

              {/* WPM 바 */}
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] text-gray-600 w-14">평균 WPM</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500/60 rounded-full transition-all"
                    style={{ width: `${wpmBarWidth}%` }}
                  />
                </div>
                <span className="text-[10px] text-emerald-400 font-mono w-8 text-right">
                  {stat.avgWpm}
                </span>
              </div>

              {/* 정확도 바 */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-600 w-14">정확도</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      stat.avgAccuracy >= 95
                        ? "bg-blue-500/60"
                        : stat.avgAccuracy >= 80
                          ? "bg-yellow-500/60"
                          : "bg-red-500/60"
                    }`}
                    style={{ width: `${accBarWidth}%` }}
                  />
                </div>
                <span className="text-[10px] text-blue-400 font-mono w-8 text-right">
                  {stat.avgAccuracy}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
