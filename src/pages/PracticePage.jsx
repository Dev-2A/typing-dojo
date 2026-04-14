import { useState, useEffect } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import SnippetSelector from "../components/typing/SnippetSelector";
import TypingInput from "../components/typing/TypingInput";
import useTyping from "../hooks/useTyping";
import { getRandomSnippet } from "../data/snippets";

export default function PracticePage() {
  const [snippet, setSnippet] = useState(() => getRandomSnippet());
  const typing = useTyping(snippet?.code || "");

  // 스니펫 변경 시 타이핑 리셋
  const handleSelectSnippet = (newSnippet) => {
    setSnippet(newSnippet);
  };

  // snippet이 바뀌면 타이핑 상태 리셋
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
          <CodeViewer snippet={snippet} />
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
    </div>
  );
}
