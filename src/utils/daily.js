/**
 * 매일 도전 모드 — 날짜 기반 시드로 매일 같은 스니펫 3개 제공
 */
import snippets from "../data/snippets";

const DAILY_STORAGE_KEY = "typing-dojo-daily";

/**
 * 날짜 문자열 → 시드 해시 (간단한 해시)
 */
function hashDate(dateStr) {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    const char = dateStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 32bit 정수 변환
  }
  return Math.abs(hash);
}

/**
 * 시드 기반 의사 난수 생성기 (LCG)
 */
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/**
 * 오늘 날짜 문자열 (YYYY-MM-DD, 로컬 시간 기준)
 */
export function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * 오늘의 도전 스니펫 3개 선택 (easy, medium, hard 각 1개)
 */
export function getDailyChallenges(dateStr = getTodayStr()) {
  const seed = hashDate(dateStr);
  const rand = seededRandom(seed);

  const difficulties = ["easy", "medium", "hard"];
  const challenges = [];

  for (const diff of difficulties) {
    const pool = snippets.filter((s) => s.difficulty === diff);
    if (pool.length === 0) continue;
    const idx = Math.floor(rand() * pool.length);
    challenges.push({
      ...pool[idx],
      challengeOrder: challenges.length + 1,
    });
  }

  return challenges;
}

/**
 * 오늘의 도전 결과 저장/조회
 */
export function getDailyResults(dateStr = getTodayStr()) {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data[dateStr] || {};
  } catch {
    return {};
  }
}

export function saveDailyResult(snippetId, result, dateStr = getTodayStr()) {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};

    if (!data[dateStr]) data[dateStr] = {};

    // 기존 기록보다 점수가 높으면 갱신, 없으면 새로 저장
    const existing = data[dateStr][snippetId];
    if (!existing || result.score > existing.score) {
      data[dateStr][snippetId] = {
        ...result,
        completedAt: new Date().toISOString(),
      };
    }

    // 최근 30일치만 보관
    const keys = Object.keys(data).sort();
    if (keys.length > 30) {
      for (const oldKey of keys.slice(0, keys.length - 30)) {
        delete data[oldKey];
      }
    }

    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 저장 실패 무시
  }
}

/**
 * 오늘의 도전 전체 완료 여부
 */
export function isDailyComplete(dateStr = getTodayStr()) {
  const challenges = getDailyChallenges(dateStr);
  const results = getDailyResults(dateStr);
  return challenges.every((c) => results[c.id]);
}

/**
 * 오늘의 도전 총점
 */
export function getDailyTotalScore(dateStr = getTodayStr()) {
  const results = getDailyResults(dateStr);
  return Object.values(results).reduce((sum, r) => sum + (r.score || 0), 0);
}

/**
 * 연속 도전 일수 (streak) 계산
 */
export function getDailyStreak() {
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    const dates = Object.keys(data).sort().reverse();

    let streak = 0;
    const today = new Date();

    for (let i = 0; i < dates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().slice(0, 10);

      if (dates.includes(expectedStr)) {
        // 해당 날짜에 최소 1개 완료했는지 확인
        const dayResults = data[expectedStr];
        if (Object.keys(dayResults).length > 0) {
          streak++;
        } else {
          break;
        }
      } else {
        // 오늘이고 아직 시작 안 했으면 어제부터 카운트
        if (i === 0) continue;
        break;
      }
    }

    return streak;
  } catch {
    return 0;
  }
}
