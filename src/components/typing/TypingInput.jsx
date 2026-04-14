import { useRef, useEffect } from "react";

export default function TypingInput({
  snippet,
  charResults,
  typed,
  status,
  onKeyDown,
  onReset,
  wpm,
  accuracy,
  formattedTime,
  progress,
}) {
  const containerRef = useRef(null);
  const cursorRef = useRef(null);

  const handleFocus = () => {
    containerRef.current?.focus();
  };

  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [typed]);

  useEffect(() => {
    containerRef.current?.focus();
  }, [snippet?.id]);

  if (!snippet) return null;

  const isFinished = status === "finished";

  return (
    <div className="space-y-3 animate-fade-in">
      {/* 상태 바 */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 justify-between">
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">WPM</span>
            <span className="text-emerald-400 font-bold font-mono">{wpm}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">정확도</span>
            <span
              className={`font-bold font-mono ${
                accuracy >= 95
                  ? "text-emerald-400"
                  : accuracy >= 80
                    ? "text-yellow-400"
                    : "text-red-400"
              }`}
            >
              {accuracy}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-gray-500">시간</span>
            <span className="text-gray-300 font-mono">{formattedTime}</span>
          </div>
          <div className="items-center gap-1.5 hidden sm:flex">
            <span className="text-gray-500">진행</span>
            <span className="text-gray-300 font-mono">{progress}%</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="px-3 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800 border border-gray-700 transition-colors"
        >
          🔄 다시 시작
        </button>
      </div>

      {/* 진행률 바 */}
      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-150 ${
            isFinished ? "bg-emerald-500" : "bg-emerald-500/80"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 타이핑 영역 */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onClick={handleFocus}
        className={`relative rounded-xl border p-3 sm:p-4 font-mono text-sm sm:text-[15px] leading-relaxed whitespace-pre-wrap break-all min-h-25 sm:min-h-30 max-h-87.5 sm:max-h-100 overflow-y-auto cursor-text focus:outline-none transition-colors ${
          isFinished
            ? "border-emerald-500/50 bg-emerald-500/5 animate-pulse-glow"
            : "border-gray-700/50 bg-gray-900/50 focus:border-emerald-500/30"
        }`}
      >
        {charResults.map((cr, i) => {
          const isCursor = i === typed.length;

          return (
            <span key={i} className="relative">
              {/* 깜빡이는 커서 */}
              {isCursor && !isFinished && (
                <span
                  ref={cursorRef}
                  className="absolute left-0 top-0 w-0.5 h-[1.3em] bg-emerald-400 animate-typing-cursor"
                />
              )}
              <span
                className={`transition-colors duration-75 ${
                  cr.status === "correct"
                    ? "text-emerald-400"
                    : cr.status === "incorrect"
                      ? "text-red-400 bg-red-500/15 rounded-sm"
                      : isCursor
                        ? "text-gray-300"
                        : "text-gray-600"
                }`}
              >
                {cr.char === "\n"
                  ? "↵\n"
                  : cr.char === " "
                    ? "\u00A0"
                    : cr.char}
              </span>
            </span>
          );
        })}

        {/* 포커스 안내 */}
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/60 rounded-xl">
            <div className="text-center px-4">
              <p className="text-gray-400 text-sm">
                <span className="hidden sm:inline">
                  여기를 클릭하고 타이핑을 시작하세요
                </span>
                <span className="sm:hidden">탭하고 타이핑을 시작하세요</span>
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Tab → 스페이스 2칸 · Enter → 줄바꿈
              </p>
            </div>
          </div>
        )}

        {/* 완료 오버레이 */}
        {isFinished && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-950/70 rounded-xl backdrop-blur-sm animate-fade-in">
            <div className="text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-emerald-400 font-bold text-lg">타이핑 완료!</p>
              <p className="text-gray-400 text-sm mt-1">
                {wpm} WPM · {accuracy}% 정확도 · {formattedTime}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
