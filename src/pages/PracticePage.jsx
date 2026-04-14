import { useState, useEffect } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import SnippetSelector from "../components/typing/SnippetSelector";
import TypingInput from "../components/typing/TypingInput";
import DiffOverlay from "../components/typing/DiffOverlay";
import DifficultyBadge from "../components/typing/DifficultyBadge";
import ErrorSummary from "../components/typing/ErrorSummary";
import LiveStats from "../components/stats/LiveStats";
import WpmChart from "../components/stats/WpmChart";
import useTyping from "../hooks/useTyping";
import { getRandomSnippet } from "../data/snippets";
import { saveResult } from "../utils/storage";
import { calculateScore, getGrade } from "../utils/difficulty";

export default function PracticePage() {
  const [snippet, setSnippet] = useState(() => getRandomSnippet());
  const [showDiff, setShowDiff] = useState(true);
  const [lastScore, setLastScore] = useState(null);
  const typing = useTyping(snippet?.code || "");

  const handleSelectSnippet = (newSnippet) => {
    setSnippet(newSnippet);
    setLastScore(null);
  };

  // snippet 변경 시 리셋
  useEffect(() => {
    typing.resetTyping();
    setLastScore(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet?.id]);

  // 타이핑 완료 시 결과 저장 + 점수 계산
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

      {/* 완료 시 점수 카드 */}
      {typing.status === "finished" && lastScore && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-3">
          <div className="text-4xl font-bold">
            <span className={lastScore.color}>{lastScore.grade}</span>
          </div>
          <div className="text-lg text-gray-200">
            <span className="text-emerald-400 font-bold">
              {lastScore.score}
            </span>
            <span className="text-gray-500"> 점</span>
          </div>
          <div className={`text-sm ${lastScore.color}`}>{lastScore.label}</div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>WPM {typing.wpm}</span>
            <span>·</span>
            <span>정확도 {typing.accuracy}%</span>
            <span>·</span>
            <span>{typing.formattedTime}</span>
          </div>
        </div>
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

      {/* diff + 오타 분석 */}
      {snippet && typing.status !== "idle" && (
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
        </div>
      )}
    </div>
  );
}
