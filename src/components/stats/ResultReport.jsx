import { useMemo } from "react";
import { LANGUAGES } from "../../data/snippets";
import { DIFFICULTY_CONFIG, getGrade } from "../../utils/difficulty";
import WpmChart from "./WpmChart";
import KeyboardHeatmap from "./KeyboardHeatmap";
import { getMistakeKeys } from "../../utils/typing";

/**
 * 타이핑 완료 후 상세 결과 리포트
 */
export default function ResultReport({
  snippet,
  wpm,
  accuracy,
  elapsed,
  formattedTime,
  correctCount,
  incorrectCount,
  score,
  grade,
  mistakes,
  samples,
  onRetry,
  onNext,
}) {
  const langInfo = LANGUAGES.find((l) => l.id === snippet.language);
  const diffConfig = DIFFICULTY_CONFIG[snippet.difficulty];
  const gradeInfo = getGrade(score);
  const topMistakes = useMemo(
    () => getMistakeKeys(mistakes).slice(0, 5),
    [mistakes],
  );

  // 퍼포먼스 분석 코멘트
  const commentary = useMemo(() => {
    const comments = [];

    // WPM 평가
    if (wpm >= 80)
      comments.push({
        icon: "🚀",
        text: "놀라운 속도! 프로 개발자 수준입니다.",
      });
    else if (wpm >= 60)
      comments.push({
        icon: "⚡",
        text: "빠른 속도! 코드 타이핑에 능숙하네요.",
      });
    else if (wpm >= 40)
      comments.push({
        icon: "👍",
        text: "준수한 속도입니다. 꾸준히 연습하면 더 빨라져요.",
      });
    else if (wpm >= 20)
      comments.push({
        icon: "💪",
        text: "점점 나아지고 있어요. 특수문자에 익숙해지면 속도가 오릅니다.",
      });
    else
      comments.push({
        icon: "🌱",
        text: "시작이 반! 코드 타이핑은 연습할수록 빨라져요.",
      });

    // 정확도 평가
    if (accuracy >= 98)
      comments.push({ icon: "🎯", text: "거의 완벽한 정확도!" });
    else if (accuracy >= 95)
      comments.push({ icon: "✨", text: "높은 정확도를 유지하고 있어요." });
    else if (accuracy >= 85)
      comments.push({
        icon: "📝",
        text: "정확도를 조금 더 올려보세요. 속도보다 정확도가 먼저!",
      });
    else
      comments.push({
        icon: "⚠️",
        text: "오타가 많습니다. 천천히 정확하게 치는 연습을 추천해요.",
      });

    // 특수문자 분석
    if (topMistakes.length > 0) {
      const specialChars = topMistakes.filter((m) =>
        /[{}()[\];:'"<>/\\|`~!@#$%^&*+=?]/.test(m.key),
      );
      if (specialChars.length > 0) {
        comments.push({
          icon: "🔣",
          text: `특수문자(${specialChars.map((m) => m.key).join(" ")})에서 오타가 집중됩니다. 의식적으로 연습해보세요.`,
        });
      }
    }

    return comments;
  }, [wpm, accuracy, topMistakes]);

  // 상세 지표 계산
  const cpm = useMemo(() => {
    if (elapsed <= 0) return 0;
    return Math.round((correctCount + incorrectCount) / (elapsed / 60000));
  }, [correctCount, incorrectCount, elapsed]);

  const netWpm = useMemo(() => {
    if (elapsed <= 0) return 0;
    const minutes = elapsed / 60000;
    const gross = (correctCount + incorrectCount) / 5 / minutes;
    const errors = incorrectCount / minutes;
    return Math.round(Math.max(gross - errors, 0));
  }, [correctCount, incorrectCount, elapsed]);

  return (
    <div className="space-y-6">
      {/* ===== 메인 스코어 카드 ===== */}
      <div className="rounded-2xl border border-gray-700/50 bg-gray-900/50 overflow-hidden">
        {/* 상단 그라데이션 헤더 */}
        <div className="relative px-6 py-8 text-center bg-gradient-to-b from-emerald-500/10 to-transparent">
          {/* 등급 */}
          <div className="text-6xl font-black mb-2">
            <span className={gradeInfo.color}>{gradeInfo.grade}</span>
          </div>
          <div className={`text-sm font-medium ${gradeInfo.color}`}>
            {gradeInfo.label}
          </div>
          <div className="text-3xl font-bold text-white mt-2">
            {score}
            <span className="text-base text-gray-400 font-normal"> 점</span>
          </div>

          {/* 스니펫 정보 */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>
              {langInfo?.icon} {snippet.language}
            </span>
            <span>·</span>
            <span className={diffConfig.color}>
              {diffConfig.icon} {diffConfig.label}
            </span>
            <span>·</span>
            <span>{snippet.title}</span>
          </div>
        </div>

        {/* 핵심 지표 4개 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-gray-800/50">
          <StatCell
            label="WPM"
            value={wpm}
            sub={`Net ${netWpm}`}
            color="text-emerald-400"
          />
          <StatCell
            label="정확도"
            value={`${accuracy}%`}
            sub={`${correctCount}/${correctCount + incorrectCount}`}
            color={
              accuracy >= 95
                ? "text-emerald-400"
                : accuracy >= 80
                  ? "text-yellow-400"
                  : "text-red-400"
            }
          />
          <StatCell
            label="소요 시간"
            value={formattedTime}
            sub={`${cpm} CPM`}
            color="text-gray-200"
          />
          <StatCell
            label="배율"
            value={`×${diffConfig.multiplier}`}
            sub={`${snippet.code.length}자`}
            color="text-purple-400"
          />
        </div>
      </div>

      {/* ===== 퍼포먼스 코멘트 ===== */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 space-y-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          분석 코멘트
        </span>
        <div className="space-y-1.5">
          {commentary.map((c, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-base flex-shrink-0">{c.icon}</span>
              <span className="text-gray-300">{c.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ===== WPM 추이 차트 ===== */}
      {samples && samples.length >= 2 && <WpmChart samples={samples} />}

      {/* ===== 정타/오타 비율 바 ===== */}
      <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            입력 분석
          </span>
          <span className="text-xs text-gray-500">
            총 {correctCount + incorrectCount}자 입력
          </span>
        </div>

        {/* 비율 바 */}
        <div className="h-4 rounded-full overflow-hidden flex bg-gray-800">
          <div
            className="bg-emerald-500 transition-all"
            style={{ width: `${accuracy}%` }}
          />
          <div
            className="bg-red-500 transition-all"
            style={{ width: `${100 - accuracy}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-gray-400">정타 {correctCount}자</span>
            <span className="text-emerald-400 font-mono">{accuracy}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="text-gray-400">오타 {incorrectCount}자</span>
            <span className="text-red-400 font-mono">{100 - accuracy}%</span>
          </div>
        </div>
      </div>

      {/* ===== 키보드 히트맵 ===== */}
      {incorrectCount > 0 && <KeyboardHeatmap mistakes={mistakes} />}

      {/* ===== 액션 버튼 ===== */}
      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors"
        >
          🔄 다시 도전
        </button>
        <button
          onClick={onNext}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors"
        >
          ⏭️ 다음 스니펫
        </button>
      </div>
    </div>
  );
}

/**
 * 통계 셀 컴포넌트
 */
function StatCell({ label, value, sub, color }) {
  return (
    <div className="px-4 py-4 text-center">
      <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold font-mono ${color}`}>{value}</div>
      {sub && (
        <div className="text-[10px] text-gray-600 mt-0.5 font-mono">{sub}</div>
      )}
    </div>
  );
}
