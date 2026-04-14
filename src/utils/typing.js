/**
 * 타이핑 결과에서 WPM(Words Per Minute) 계산
 * - 표준: 1 word = 5 characters
 * - gross WPM = (총 입력 문자 수 / 5) / 경과 분
 * - net WPM = gross WPM - (오타 수 / 경과 분)
 */
export function calculateWPM(totalChars, elapsedMs) {
  if (elapsedMs <= 0) return 0;
  const minutes = elapsedMs / 60000;
  const grossWPM = totalChars / 5 / minutes;
  return Math.round(Math.max(grossWPM, 0));
}

/**
 * 정확도 계산 (%)
 */
export function calculateAccuracy(correctChars, totalChars) {
  if (totalChars <= 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

/**
 * 문자 단위 비교 - 각 문자의 상태를 배열로 반환
 * 상태: "correct" | "incorrect" | "pending"
 */
export function compareChars(original, typed) {
  const result = [];

  for (let i = 0; i < original.length; i++) {
    if (i >= typed.length) {
      result.push({ char: original[i], status: "pending" });
    } else if (typed[i] === original[i]) {
      result.push({ char: original[i], status: "correct" });
    } else {
      result.push({
        char: original[i],
        status: "incorrect",
        typed: typed[i],
      });
    }
  }

  return result;
}

/**
 * 틀린 키 빈도 집계 - { expected → { typed → count } }
 */
export function collectMistakes(original, typed) {
  const mistakes = {};

  for (let i = 0; i < typed.length && i < original.length; i++) {
    if (typed[i] !== original[i]) {
      const expected = original[i];
      const actual = typed[i];

      if (!mistakes[expected]) {
        mistakes[expected] = {};
      }
      if (!mistakes[expected][actual]) {
        mistakes[expected][actual] = 0;
      }
      mistakes[expected][actual]++;
    }
  }

  return mistakes;
}

/**
 * 틀린 키를 플랫 배열로 변환 (히트맵용)
 * 반환: [{ key, count }, ...] — count 내림차순
 */
export function getMistakeKeys(mistakes) {
  const keyCount = {};

  for (const expected of Object.keys(mistakes)) {
    if (!keyCount[expected]) keyCount[expected] = 0;
    for (const actual of Object.keys(mistakes[expected])) {
      keyCount[expected] += mistakes[expected][actual];
      if (!keyCount[actual]) keyCount[actual] = 0;
      keyCount[actual] += mistakes[expected][actual];
    }
  }

  return Object.entries(keyCount)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 타이핑 완료 여부 판별
 */
export function isTypingComplete(original, typed) {
  return typed.length >= original.length;
}

/**
 * 특수문자 비율 계산 (코드 난이도 지표)
 */
export function getSpecialCharRatio(code) {
  const specials = code.match(/[{}()[\];:'"<>/\\|`~!@#$%^&*+=?]/g);
  return specials ? specials.length / code.length : 0;
}

/**
 * 줄 단위로 진행 상황 분리
 * 반환: [{ lineNum, chars: [{ char, status, typed? }] }, ...]
 */
export function getLineResults(original, typed) {
  const compared = compareChars(original, typed);
  const lines = [];
  let current = { lineNum: 1, chars: [] };

  for (const charResult of compared) {
    if (charResult.char === "\n") {
      // 줄바꿈 문자도 결과에 포함
      current.chars.push(charResult);
      lines.push(current);
      current = { lineNum: current.lineNum + 1, chars: [] };
    } else {
      current.chars.push(charResult);
    }
  }

  // 마지막 줄 추가
  if (current.chars.length > 0) {
    lines.push(current);
  }

  return lines;
}
