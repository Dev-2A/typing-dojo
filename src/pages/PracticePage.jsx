import { useState, useEffect } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import SnippetSelector from "../components/typing/SnippetSelector";
import TypingInput from "../components/typing/TypingInput";
import DiffOverlay from "../components/typing/DiffOverlay";
import ErrorSummary from "../components/typing/ErrorSummary";
import LiveStats from "../components/stats/LiveStats";
import WpmChart from "../components/stats/WpmChart";
import useTyping from "../hooks/useTyping";
import { getRandomSnippet } from "../data/snippets";
import { saveResult } from "../utils/storage";

export default function PracticePage() {
  const [snippet, setSnippet] = useState(() => getRandomSnippet());
  const [showDiff, setShowDiff] = useState(true);
  const typing = useTyping(snippet?.code || "");

  const handleSelectSnippet = (newSnippet) => {
    setSnippet(newSnippet);
  };

  // snippet 변경 시 리셋
  useEffect(() => {
    typing.resetTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet?.id]);

  // 타이핑 완료 시 결과 저장
  useEffect(() => {
    if (typing.status === "finished" && snippet) {
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

      {/* 원본 코드 뷰어 */}
      {snippet && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              원본 코드
            </span>
            <span className="text-xs text-gray-600">
              — 아래 코드를 그대로 타이핑하세요
            </span>
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
