/**
 * 난이도별 점수 배율 · 목표 WPM · 특수문자 지표
 */

export const DIFFICULTY_CONFIG = {
  easy: {
    label: "초급",
    icon: "🟢",
    color: "text-green-400",
    bgColor: "bg-green-500/15",
    borderColor: "border-green-500/30",
    multiplier: 1.0,
    targetWpm: 30,
    description: "짧고 단순한 코드. 특수문자 적음.",
  },
  medium: {
    label: "중급",
    icon: "🟡",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/15",
    borderColor: "border-yellow-500/30",
    multiplier: 1.5,
    targetWpm: 25,
    description: "중간 길이. 괄호, 세미콜론 포함.",
  },
  hard: {
    label: "고급",
    icon: "🔴",
    color: "text-red-400",
    bgColor: "bg-red-500/15",
    borderColor: "border-red-500/30",
    multiplier: 2.0,
    targetWpm: 20,
    description: "긴 코드, 중첩 구조, 특수문자 다수.",
  },
};

/**
 * 타이핑 결과에 점수 부여
 * score = (WPM × 정확도/100) × 난이도 배율 × 코드 길이 보정
 */
export function calculateScore(wpm, accuracy, difficulty, codeLength) {
  const config = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.easy;
  const baseScore = wpm * (accuracy / 100);
  const lengthBonus = Math.min(codeLength / 100, 3); // 최대 3배
  return Math.round(baseScore * config.multiplier * lengthBonus);
}

/**
 * 점수 기반 등급 판정
 */
export function getGrade(score) {
  if (score >= 300)
    return {
      grade: "S",
      label: "달인",
      color: "text-purple-400",
      bg: "bg-purple-500/15",
    };
  if (score >= 200)
    return {
      grade: "A",
      label: "고수",
      color: "text-emerald-400",
      bg: "bg-emerald-500/15",
    };
  if (score >= 120)
    return {
      grade: "B",
      label: "숙련",
      color: "text-blue-400",
      bg: "bg-blue-500/15",
    };
  if (score >= 60)
    return {
      grade: "C",
      label: "중급",
      color: "text-yellow-400",
      bg: "bg-yellow-500/15",
    };
  if (score >= 20)
    return {
      grade: "D",
      label: "초급",
      color: "text-orange-400",
      bg: "bg-orange-500/15",
    };
  return {
    grade: "F",
    label: "입문",
    color: "text-gray-400",
    bg: "bg-gray-500/15",
  };
}

/**
 * 스니펫의 특수문자 밀도 분석
 */
export function analyzeCodeDifficulty(code) {
  const total = code.length;
  if (total === 0) return { specialRatio: 0, indentDepth: 0, lineCount: 0 };

  // 특수문자 비율
  const specials = code.match(/[{}()[\];:'"<>/\\|`~!@#$%^&*+=?]/g);
  const specialRatio = specials
    ? Math.round((specials.length / total) * 100)
    : 0;

  // 최대 인덴트 깊이
  const lines = code.split("\n");
  const indentDepth = Math.max(
    ...lines.map((line) => {
      const match = line.match(/^(\s+)/);
      return match ? Math.floor(match[1].length / 2) : 0;
    }),
  );

  return {
    specialRatio,
    indentDepth,
    lineCount: lines.length,
    charCount: total,
  };
}
