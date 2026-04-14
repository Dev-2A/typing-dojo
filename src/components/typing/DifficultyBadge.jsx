import {
  DIFFICULTY_CONFIG,
  analyzeCodeDifficulty,
} from "../../utils/difficulty";

/**
 * 스니펫 난이도 배지 + 코드 분석 정보
 */
export default function DifficultyBadge({ snippet, showAnalysis = false }) {
  if (!snippet) return null;

  const config = DIFFICULTY_CONFIG[snippet.difficulty];
  const analysis = showAnalysis ? analyzeCodeDifficulty(snippet.code) : null;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* 난이도 배지 */}
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${config.bgColor} ${config.color} ${config.borderColor}`}
      >
        {config.icon} {config.label}
      </span>

      {/* 배율 */}
      <span className="text-[10px] text-gray-500">
        ×{config.multiplier} 점수 배율
      </span>

      {/* 코드 분석 (선택적) */}
      {analysis && (
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <span title="특수문자 비율">🔣 {analysis.specialRatio}%</span>
          <span title="최대 인덴트 깊이">📐 깊이 {analysis.indentDepth}</span>
          <span title="줄 수">📄 {analysis.lineCount}줄</span>
          <span title="문자 수">✏️ {analysis.charCount}자</span>
        </div>
      )}
    </div>
  );
}
