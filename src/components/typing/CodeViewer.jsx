import Editor from "@monaco-editor/react";
import { getMonacoLanguage } from "../../data/snippets";

export default function CodeViewer({ snippet, typedChars = [] }) {
  if (!snippet) return null;

  // Monaco Editor 옵션 - 읽기 전용 원본 뷰어
  const editorOptions = {
    readOnly: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    fontSize: 15,
    lineNumbers: "on",
    renderLineHighlight: "none",
    folding: false,
    wordWrap: "on",
    contextmenu: false,
    scrollbar: {
      vertical: "hidden",
      horizontal: "auto",
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    domReadOnly: true,
    cursorStyle: "line",
    padding: { top: 16, bottom: 16 },
  };

  // 에디터 높이 자동 계산 (줄 수 기반)
  const lineCount = snippet.code.split("\n").length;
  const editorHeight = Math.max(lineCount * 22 + 40, 100);

  return (
    <div className="rounded-xl border border-gray-700/50 overflow-hidden bg-[#1e1e1e]">
      {/* 헤더 바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/60 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          {/* 트래픽 라이트 */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs text-gray-400 ml-2 font-mono">
            {snippet.title}
          </span>
        </div>
        <span className="text-xs text-gray-500 font-mono">
          {snippet.language}
        </span>
      </div>

      {/* Monaco Editor */}
      <Editor
        height={editorHeight}
        language={getMonacoLanguage(snippet.language)}
        value={snippet.code}
        theme="vs-dark"
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
            에디터 로딩 중...
          </div>
        }
      />
    </div>
  );
}
