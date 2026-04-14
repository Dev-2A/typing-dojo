import { useState, useMemo } from "react";
import OverallSummary from "../components/stats/OverallSummary";
import GrowthChart from "../components/stats/GrowthChart";
import LanguageBreakdown from "../components/stats/LanguageBreakdown";
import HistoryTable from "../components/stats/HistoryTable";
import { getHistory, clearHistory } from "../utils/storage";

export default function StatsPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const hasHistory = useMemo(() => getHistory().length > 0, []);

  const handleClear = () => {
    clearHistory();
    setShowClearConfirm(false);
    // 페이지 새로고침으로 통계 갱신
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            📊 통계
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            타이핑 성장 기록을 한눈에 확인하세요
          </p>
        </div>

        {hasHistory && (
          <div>
            {showClearConfirm ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-400">정말 삭제할까요?</span>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-red-400 bg-red-500/15 border border-red-500/30 hover:bg-red-500/25 transition-colors"
                >
                  삭제
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 border border-gray-700 transition-colors"
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-300 border border-gray-700/50 transition-colors"
              >
                🗑️ 기록 초기화
              </button>
            )}
          </div>
        )}
      </div>

      {!hasHistory ? (
        <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-12 text-center space-y-3">
          <span className="text-5xl block">📊</span>
          <p className="text-lg text-gray-300">아직 기록이 없어요</p>
          <p className="text-sm text-gray-500">
            연습 모드나 매일 도전에서 타이핑을 완료하면 여기에 성장 기록이
            쌓입니다
          </p>
        </div>
      ) : (
        <>
          {/* 전체 요약 카드 */}
          <OverallSummary />

          {/* 성장 추이 차트 */}
          <GrowthChart />

          {/* 언어별 분석 */}
          <LanguageBreakdown />

          {/* 히스토리 테이블 */}
          <HistoryTable />
        </>
      )}
    </div>
  );
}
