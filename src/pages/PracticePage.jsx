import { useState, useEffect } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import SnippetSelector from "../components/typing/SnippetSelector";
import TypingInput from "../components/typing/TypingInput";
import DiffOverlay from "../components/typing/DiffOverlay";
import ErrorSummary from "../components/typing/ErrorSummary";
import useTyping from "../hooks/useTyping";
import { getRandomSnippet } from "../data/snippets";

export default function PracticePage() {
  const [snippet, setSnippet] = useState(() => getRandomSnippet());
  const [showDiff, setShowDiff] = useState(true);
  const typing = useTyping(snippet?.code || "");

  const handleSelectSnippet = (newSnippet) => {
    setSnippet(newSnippet);
  };

  useEffect(() => {
    typing.resetTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snippet?.id]);

  return (
    <div className="space-y-6">
      {/* 스니펫 선택기 */}
      <SnippetSelector
        onSelect={handleSelectSnippet}
        currentSnippetId={snippet?.id}
      />

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

      {/* diff + 오타 분석 (타이핑 시작 후에만 표시) */}
      {snippet && typing.status !== "idle" && (
        <div className="space-y-4">
          {/* diff 토글 */}
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
              {/* 라인 diff — 2/3 너비 */}
              <div className="lg:col-span-2">
                <DiffOverlay originalCode={snippet.code} typed={typing.typed} />
              </div>

              {/* 오타 분석 — 1/3 너비 */}
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
