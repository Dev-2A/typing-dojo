import { useState, useEffect } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import SnippetSelector from "../components/typing/SnippetSelector";
import TypingInput from "../components/typing/TypingInput";
import DiffOverlay from "../components/typing/DiffOverlay";
import ErrorSummary from "../components/typing/ErrorSummary";
import LiveStats from "../components/stats/LiveStats";
import WpmChart from "../components/stats/WpmChart";
import KeyboardHeatmap from "../components/stats/KeyboardHeatmap";
import ResultReport from "../components/stats/ResultReport";
import useTyping from "../hooks/useTyping";
import { LANGUAGES, getRandomSnippet } from "../data/snippets";
import { saveResult } from "../utils/storage";
import {
  calculateScore,
  getGrade,
  DIFFICULTY_CONFIG,
} from "../utils/difficulty";

const ANALYSIS_TABS = [
  { id: "diff", label: "Diff", icon: "📊" },
  { id: "errors", label: "오타", icon: "🔤" },
  { id: "heatmap", label: "히트맵", icon: "⌨️" },
  { id: "wpm", label: "WPM", icon: "📈" },
];

export default function PracticePage() {
  const [snippet, setSnippet] = useState(() => getRandomSnippet());
  const [showSelector, setShowSelector] = useState(false);
  const [analysisTab, setAnalysisTab] = useState("diff");
  const [lastScore, setLastScore] = useState(null);
  const typing = useTyping(snippet?.code || "");

  const langInfo = LANGUAGES.find((l) => l.id === snippet?.language);
  const diffConfig = snippet ? DIFFICULTY_CONFIG[snippet.difficulty] : null;

  const handleSelectSnippet = (newSnippet) => {
    setSnippet(newSnippet);
    setLastScore(null);
    setShowSelector(false);
  };

  const handleNextSnippet = () => {
    const next = getRandomSnippet();
    setSnippet(next);
    setLastScore(null);
  };

  useEffect(() => {
    typing.resetTyping();
    setLastScore(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet?.id]);

  // 타이핑 완료 시 결과 저장
  useEffect(() => {
    if (typing.status === "finished" && snippet) {
      const score = calculateScore(
        typing.wpm,
        typing.accuracy,
        snippet.difficulty,
        snippet.code.length,
      );
      const grade = getGrade(score);
      setLastScore({ score, ...grade });

      saveResult({
        snippetId: snippet.id,
        language: snippet.language,
        difficulty: snippet.difficulty,
        title: snippet.title,
        codeLength: snippet.code.length,
        wpm: typing.wpm,
        accuracy: typing.accuracy,
        elapsed: typing.elapsed,
        correctCount: typing.correctCount,
        incorrectCount: typing.incorrectCount,
        score,
        grade: grade.grade,
        samples: typing.samples,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing.status]);

  // ── 컴팩트 스니펫 정보 바 ──
  const snippetBar = (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-gray-700/50 bg-gray-900/50 px-3 sm:px-4 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-lg shrink-0">{langInfo?.icon}</span>
        <span className="text-sm text-gray-200 truncate font-medium">
          {snippet?.title}
        </span>
        {diffConfig && (
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 ${diffConfig.bgColor} ${diffConfig.color} ${diffConfig.borderColor}`}
          >
            {diffConfig.icon} {diffConfig.label}
          </span>
        )}
        <span className="text-[10px] text-gray-600 shrink-0 hidden sm:inline">
          {snippet?.code.length}자 · {snippet?.code.split("\n").length}줄
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleNextSnippet}
          className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
        >
          🎲 랜덤
        </button>
        <button
          onClick={() => setShowSelector(!showSelector)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            showSelector
              ? "bg-gray-700 text-gray-200 border border-gray-600"
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700"
          }`}
        >
          {showSelector ? "✕ 닫기" : "📋 변경"}
        </button>
      </div>
    </div>
  );

  // ── 완료 → 결과 리포트 ──
  if (typing.status === "finished" && lastScore && snippet) {
    return (
      <div className="space-y-3">
        {snippetBar}
        {showSelector && (
          <div className="animate-fade-in">
            <SnippetSelector
              onSelect={handleSelectSnippet}
              currentSnippetId={snippet.id}
            />
          </div>
        )}
        <ResultReport
          snippet={snippet}
          wpm={typing.wpm}
          accuracy={typing.accuracy}
          elapsed={typing.elapsed}
          formattedTime={typing.formattedTime}
          correctCount={typing.correctCount}
          incorrectCount={typing.incorrectCount}
          score={lastScore.score}
          grade={lastScore.grade}
          mistakes={typing.mistakes}
          samples={typing.samples}
          onRetry={typing.resetTyping}
          onNext={handleNextSnippet}
        />
      </div>
    );
  }

  // ── 타이핑 진행 / 대기 ──
  return (
    <div className="space-y-3">
      {/* 컴팩트 스니펫 바 */}
      {snippetBar}

      {/* 펼침 가능한 스니펫 선택기 */}
      {showSelector && (
        <div className="animate-fade-in">
          <SnippetSelector
            onSelect={handleSelectSnippet}
            currentSnippetId={snippet?.id}
          />
        </div>
      )}

      {/* 컴팩트 통계 바 — 항상 표시 */}
      <LiveStats
        wpm={typing.wpm}
        accuracy={typing.accuracy}
        formattedTime={typing.formattedTime}
        progress={typing.progress}
        correctCount={typing.correctCount}
        incorrectCount={typing.incorrectCount}
        status={typing.status}
        samples={typing.samples}
      />

      {/* 코드 뷰어 + 타이핑 입력 */}
      {snippet && (
        <>
          <CodeViewer
            snippet={snippet}
            progress={typing.progress}
            status={typing.status}
          />
          <TypingInput
            snippet={snippet}
            charResults={typing.charResults}
            typed={typing.typed}
            status={typing.status}
            onKeyDown={typing.handleKeyDown}
            onReset={typing.resetTyping}
            wpm={typing.wpm}
            accuracy={typing.accuracy}
            formattedTime={typing.formattedTime}
            progress={typing.progress}
          />
        </>
      )}

      {/* 분석 탭 패널 */}
      {snippet && typing.status === "typing" && (
        <div className="space-y-2 animate-fade-in">
          {/* 탭 버튼 */}
          <div className="flex gap-1">
            {ANALYSIS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setAnalysisTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  analysisTab === tab.id
                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 border border-transparent"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* 탭 콘텐츠 */}
          <div className="max-h-96 overflow-y-auto">
            {analysisTab === "diff" && (
              <DiffOverlay
                originalCode={snippet.code}
                typed={typing.typed}
              />
            )}
            {analysisTab === "errors" &&
              (typing.incorrectCount > 0 ? (
                <ErrorSummary mistakes={typing.mistakes} />
              ) : (
                <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 py-8 text-center text-sm text-gray-500">
                  ✨ 아직 오타가 없습니다
                </div>
              ))}
            {analysisTab === "heatmap" && (
              <KeyboardHeatmap mistakes={typing.mistakes} />
            )}
            {analysisTab === "wpm" &&
              (typing.samples.length >= 2 ? (
                <WpmChart samples={typing.samples} />
              ) : (
                <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 py-8 text-center text-sm text-gray-500">
                  📈 데이터를 수집 중입니다...
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
