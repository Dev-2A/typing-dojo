import Editor from "@monaco-editor/react";
import { getMonacoLanguage } from "../../data/snippets";

export default function CodeViewer({ snippet, progress = 0, status = "idle" }) {
  if (!snippet) return null;

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
      vertical: "auto",
      horizontal: "auto",
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    domReadOnly: true,
    cursorStyle: "line",
    padding: { top: 16, bottom: 16 },
  };

  const lineCount = snippet.code.split("\n").length;
  const editorHeight = Math.min(Math.max(lineCount * 22 + 40, 100), 350);

  // 상태에 따른 테두리 색상
  const borderColor =
    status === "finished"
      ? "border-emerald-500/40"
      : status === "typing"
        ? "border-yellow-500/30"
        : "border-gray-700/50";

  return (
    <div
      className={`rounded-xl border overflow-hidden bg-[#1e1e1e] transition-colors ${borderColor}`}
    >
      {/* 헤더 바 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/60 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span
              className={`w-3 h-3 rounded-full ${status === "finished" ? "bg-emerald-500" : "bg-red-500/80"}`}
            />
            <span
              className={`w-3 h-3 rounded-full ${status === "typing" ? "bg-yellow-500" : "bg-yellow-500/80"}`}
            />
            <span
              className={`w-3 h-3 rounded-full ${status === "idle" ? "bg-green-500" : "bg-green-500/80"}`}
            />
          </div>
          <span className="text-xs text-gray-400 ml-2 font-mono">
            {snippet.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 진행률 표시 */}
          {status !== "idle" && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    status === "finished" ? "bg-emerald-500" : "bg-yellow-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-500 font-mono w-8 text-right">
                {progress}%
              </span>
            </div>
          )}

          <span className="text-xs text-gray-500 font-mono">
            {snippet.language} · {snippet.code.length}자
          </span>
        </div>
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
