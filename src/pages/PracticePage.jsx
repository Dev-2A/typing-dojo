import { useState, useEffect } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import SnippetSelector from "../components/typing/SnippetSelector";
import TypingInput from "../components/typing/TypingInput";
import DiffOverlay from "../components/typing/DiffOverlay";
import DifficultyBadge from "../components/typing/DifficultyBadge";
import ErrorSummary from "../components/typing/ErrorSummary";
import LiveStats from "../components/stats/LiveStats";
import WpmChart from "../components/stats/WpmChart";
import KeyboardHeatmap from "../components/stats/KeyboardHeatmap";
import ResultReport from "../components/stats/ResultReport";
import useTyping from "../hooks/useTyping";
import { getRandomSnippet } from "../data/snippets";
import { saveResult } from "../utils/storage";
import { calculateScore, getGrade } from "../utils/difficulty";

export default function PracticePage() {
  const [snippet, setSnippet] = useState(() => getRandomSnippet());
  const [showDiff, setShowDiff] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [lastScore, setLastScore] = useState(null);
  const typing = useTyping(snippet?.code || "");

  const handleSelectSnippet = (newSnippet) => {
    setSnippet(newSnippet);
    setLastScore(null);
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

  // 완료 후 → 결과 리포트 화면
  if (typing.status === "finished" && lastScore && snippet) {
    return (
      <div className="space-y-6">
        {/* 스니펫 선택기는 유지 */}
        <SnippetSelector
          onSelect={handleSelectSnippet}
          currentSnippetId={snippet.id}
        />

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

  // 타이핑 진행 중 / 대기 → 기존 UI
  return (
    <div className="space-y-6">
      {/* 스니펫 선택기 */}
      <SnippetSelector
        onSelect={handleSelectSnippet}
        currentSnippetId={snippet?.id}
      />

      {/* 실시간 통계 대시보드 */}
      <LiveStats
        wpm={typing.wpm}
        accuracy={typing.accuracy}
        formattedTime={typing.formattedTime}
        progress={typing.progress}
        correctCount={typing.correctCount}
        incorrectCount={typing.incorrectCount}
        typed={typing.typed}
        originalLength={snippet?.code.length || 0}
        status={typing.status}
        samples={typing.samples}
      />

      {/* WPM 실시간 차트 */}
      {typing.status !== "idle" && typing.samples.length >= 2 && (
        <WpmChart samples={typing.samples} />
      )}

      {/* 원본 코드 뷰어 */}
      {snippet && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                원본 코드
              </span>
              <span className="text-xs text-gray-600">
                — 아래 코드를 그대로 타이핑하세요
              </span>
            </div>
            <DifficultyBadge snippet={snippet} showAnalysis />
          </div>
          <CodeViewer
            snippet={snippet}
            progress={typing.progress}
            status={typing.status}
          />
        </div>
      )}

      {/* 타이핑 입력 영역 */}
      {snippet && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            타이핑
          </span>
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
        </div>
      )}

      {/* 분석 패널 */}
      {snippet && typing.status === "typing" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiff(!showDiff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showDiff
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700"
              }`}
            >
              {showDiff ? "📊 Diff 숨기기" : "📊 Diff 보기"}
            </button>
            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showHeatmap
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700"
              }`}
            >
              {showHeatmap ? "⌨️ 히트맵 숨기기" : "⌨️ 히트맵 보기"}
            </button>
          </div>

          {showDiff && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <DiffOverlay originalCode={snippet.code} typed={typing.typed} />
              </div>
              <div>
                <ErrorSummary mistakes={typing.mistakes} />
              </div>
            </div>
          )}

          {showHeatmap && typing.incorrectCount > 0 && (
            <KeyboardHeatmap mistakes={typing.mistakes} />
          )}
        </div>
      )}
    </div>
  );
}
