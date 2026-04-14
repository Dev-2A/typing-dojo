import { useState, useCallback, useMemo } from "react";
import useTimer from "./useTimer";
import {
  compareChars,
  calculateWPM,
  calculateAccuracy,
  collectMistakes,
  isTypingComplete,
} from "../utils/typing";

/**
 * 타이핑 상태: 'idle' | 'typing' | 'finished'
 */
export default function useTyping(originalCode = "") {
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState("idle");
  const { elapsed, formattedTime, start, stop, reset } = useTimer();

  // 문자 비교 결과
  const charResults = useMemo(
    () => compareChars(originalCode, typed),
    [originalCode, typed],
  );

  // 정타 / 오타 수
  const correctCount = useMemo(
    () => charResults.filter((c) => c.status === "correct").length,
    [charResults],
  );
  const incorrectCount = useMemo(
    () => charResults.filter((c) => c.status === "incorrect").length,
    [charResults],
  );

  // WPM, 정확도
  const wpm = useMemo(
    () => calculateWPM(typed.length, elapsed),
    [typed.length, elapsed],
  );
  const accuracy = useMemo(
    () => calculateAccuracy(correctCount, typed.length),
    [correctCount, typed.length],
  );

  // 틀린 키 집계
  const mistakes = useMemo(
    () => collectMistakes(originalCode, typed),
    [originalCode, typed],
  );

  // 진행률 (%)
  const progress = useMemo(() => {
    if (originalCode.length === 0) return 0;
    return Math.min(
      Math.round((typed.length / originalCode.length) * 100),
      100,
    );
  }, [typed.length, originalCode.length]);

  // 키 입력 처리
  const handleKeyDown = useCallback(
    (e) => {
      if (status === "finished") return;

      // 타이핑 시작
      if (status === "idle") {
        setStatus("typing");
        start();
      }

      // Tab → 스페이스 2칸 변환 (코드 인덴트)
      if (e.key === "Tab") {
        e.preventDefault();
        setTyped((prev) => {
          const newTyped = prev + "  ";
          if (isTypingComplete(originalCode, newTyped)) {
            setStatus("finished");
            stop();
          }
          return newTyped;
        });
        return;
      }

      // Enter → 줄바꿈
      if (e.key === "Enter") {
        e.preventDefault();
        setTyped((prev) => {
          const newTyped = prev + "\n";
          if (isTypingComplete(originalCode, newTyped)) {
            setStatus("finished");
            stop();
          }
          return newTyped;
        });
        return;
      }

      // Backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        setTyped((prev) => prev.slice(0, -1));
        return;
      }

      // 일반 문자 (길이 1인 printable 문자만)
      if (e.key.length === 1) {
        e.preventDefault();
        setTyped((prev) => {
          const newTyped = prev + e.key;
          if (isTypingComplete(originalCode, newTyped)) {
            setStatus("finished");
            stop();
          }
          return newTyped;
        });
      }
    },
    [status, originalCode, start, stop],
  );

  // 리셋
  const resetTyping = useCallback(() => {
    setTyped("");
    setStatus("idle");
    reset();
  }, [reset]);

  return {
    typed,
    status,
    charResults,
    correctCount,
    incorrectCount,
    wpm,
    accuracy,
    mistakes,
    progress,
    elapsed,
    formattedTime,
    handleKeyDown,
    resetTyping,
  };
}
