import { useState } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import SnippetSelector from "../components/typing/SnippetSelector";
import { getRandomSnippet } from "../data/snippets";

export default function PracticePage() {
  const [snippet, setSnippet] = useState(() => getRandomSnippet());

  return (
    <div className="space-y-6">
      {/* 스니펫 선택기 */}
      <SnippetSelector onSelect={setSnippet} currentSnippetId={snippet?.id} />

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

      {/* 타이핑 입력 영역 (다음 Step에서 구현) */}
      {snippet && (
        <div className="rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-500">
          <span className="text-4xl block mb-3">⌨️</span>
          <p className="text-sm">타이핑 입력 영역 (Step 5에서 구현)</p>
        </div>
      )}
    </div>
  );
}
