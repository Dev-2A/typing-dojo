/**
 * 키보드 레이아웃 데이터 (US QWERTY 기준)
 * 각 행(row)의 키 배열, 특수문자 매핑 포함
 */

export const KEYBOARD_ROWS = [
  // Row 0: 숫자행
  [
    { key: "`", shift: "~", width: 1 },
    { key: "1", shift: "!", width: 1 },
    { key: "2", shift: "@", width: 1 },
    { key: "3", shift: "#", width: 1 },
    { key: "4", shift: "$", width: 1 },
    { key: "5", shift: "%", width: 1 },
    { key: "6", shift: "^", width: 1 },
    { key: "7", shift: "&", width: 1 },
    { key: "8", shift: "*", width: 1 },
    { key: "9", shift: "(", width: 1 },
    { key: "0", shift: ")", width: 1 },
    { key: "-", shift: "_", width: 1 },
    { key: "=", shift: "+", width: 1 },
  ],
  // Row 1: QWERTY행
  [
    { key: "q", shift: "Q", width: 1 },
    { key: "w", shift: "W", width: 1 },
    { key: "e", shift: "E", width: 1 },
    { key: "r", shift: "R", width: 1 },
    { key: "t", shift: "T", width: 1 },
    { key: "y", shift: "Y", width: 1 },
    { key: "u", shift: "U", width: 1 },
    { key: "i", shift: "I", width: 1 },
    { key: "o", shift: "O", width: 1 },
    { key: "p", shift: "P", width: 1 },
    { key: "[", shift: "{", width: 1 },
    { key: "]", shift: "}", width: 1 },
    { key: "\\", shift: "|", width: 1 },
  ],
  // Row 2: ASDF행
  [
    { key: "a", shift: "A", width: 1 },
    { key: "s", shift: "S", width: 1 },
    { key: "d", shift: "D", width: 1 },
    { key: "f", shift: "F", width: 1 },
    { key: "g", shift: "G", width: 1 },
    { key: "h", shift: "H", width: 1 },
    { key: "j", shift: "J", width: 1 },
    { key: "k", shift: "K", width: 1 },
    { key: "l", shift: "L", width: 1 },
    { key: ";", shift: ":", width: 1 },
    { key: "'", shift: '"', width: 1 },
  ],
  // Row 3: ZXCV행
  [
    { key: "z", shift: "Z", width: 1 },
    { key: "x", shift: "X", width: 1 },
    { key: "c", shift: "C", width: 1 },
    { key: "v", shift: "V", width: 1 },
    { key: "b", shift: "B", width: 1 },
    { key: "n", shift: "N", width: 1 },
    { key: "m", shift: "M", width: 1 },
    { key: ",", shift: "<", width: 1 },
    { key: ".", shift: ">", width: 1 },
    { key: "/", shift: "?", width: 1 },
  ],
  // Row 4: 스페이스바
  [{ key: " ", label: "Space", width: 8 }],
];

/**
 * 모든 키에 대한 lookup map 생성
 * key/shift 문자 → { row, col, keyData } 매핑
 */
export function buildKeyLookup() {
  const lookup = {};

  KEYBOARD_ROWS.forEach((row, rowIdx) => {
    row.forEach((keyData, colIdx) => {
      // 기본 키
      lookup[keyData.key] = { row: rowIdx, col: colIdx, keyData };
      // Shift 키
      if (keyData.shift) {
        lookup[keyData.shift] = { row: rowIdx, col: colIdx, keyData };
      }
    });
  });

  // 특수 매핑: 줄바꿈, 탭
  lookup["\n"] = { row: -1, col: -1, keyData: { key: "Enter", width: 1 } };
  lookup["\t"] = { row: -1, col: -1, keyData: { key: "Tab", width: 1 } };

  return lookup;
}

/**
 * 틀린 키 통계를 키보드 히트맵 데이터로 변환
 * mistakes: { expected → { typed → count } }
 * 반환: { [키문자]: { errorCount, hitCount } }
 */
export function buildHeatmapData(mistakes) {
  const heatmap = {};

  for (const expected of Object.keys(mistakes)) {
    // 기대한 키 — 오타 대상
    if (!heatmap[expected]) heatmap[expected] = { errorCount: 0, hitCount: 0 };

    for (const actual of Object.keys(mistakes[expected])) {
      const count = mistakes[expected][actual];
      heatmap[expected].errorCount += count;

      // 실제 입력한 키 — 잘못 누른 키
      if (!heatmap[actual]) heatmap[actual] = { errorCount: 0, hitCount: 0 };
      heatmap[actual].hitCount += count;
    }
  }

  return heatmap;
}

/**
 * 히트맵 강도 계산 (0~1)
 */
export function getHeatIntensity(errorCount, hitCount, maxCount) {
  if (maxCount === 0) return 0;
  const total = errorCount + hitCount;
  return Math.min(total / maxCount, 1);
}
