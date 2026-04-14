/**
 * localStorage 기반 타이핑 히스토리 관리
 */

const STORAGE_KEY = "typing-dojo-history";

export function getHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveResult(result) {
  const history = getHistory();
  history.push({
    ...result,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    date: new Date().toISOString(),
  });

  // 최근 200개만 유지
  const trimmed = history.slice(-200);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 일별 통계 집계
 * 반환: [{ date, avgWpm, avgAccuracy, count }, ...]
 */
export function getDailyStats() {
  const history = getHistory();
  const grouped = {};

  for (const entry of history) {
    const day = entry.date.slice(0, 10); // YYYY-MM-DD
    if (!grouped[day]) {
      grouped[day] = { wpmSum: 0, accSum: 0, count: 0 };
    }
    grouped[day].wpmSum += entry.wpm;
    grouped[day].accSum += entry.accuracy;
    grouped[day].count++;
  }

  return Object.entries(grouped)
    .map(([date, g]) => ({
      date,
      avgWpm: Math.round(g.wpmSum / g.count),
      avgAccuracy: Math.round(g.accSum / g.count),
      count: g.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * 언어별 통계 집계
 */
export function getLanguageStats() {
  const history = getHistory();
  const grouped = {};

  for (const entry of history) {
    const lang = entry.language || "unknown";
    if (!grouped[lang]) {
      grouped[lang] = { wpmSum: 0, accSum: 0, count: 0, bestWpm: 0 };
    }
    grouped[lang].wpmSum += entry.wpm;
    grouped[lang].accSum += entry.accuracy;
    grouped[lang].count++;
    grouped[lang].bestWpm = Math.max(grouped[lang].bestWpm, entry.wpm);
  }

  return Object.entries(grouped)
    .map(([language, g]) => ({
      language,
      avgWpm: Math.round(g.wpmSum / g.count),
      avgAccuracy: Math.round(g.accSum / g.count),
      bestWpm: g.bestWpm,
      count: g.count,
    }))
    .sort((a, b) => b.count - a.count);
}
