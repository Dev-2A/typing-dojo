import { useState, useCallback, useMemo } from "react";
import useTimer from "./useTimer";
import useWpmSampler from "./useWpmSampler";
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
  const {
    elapsed,
    formattedTime,
    start: startTimer,
    stop: stopTimer,
    reset: resetTimer,
  } = useTimer();
  const sampler = useWpmSampler();

  // 문자 비교 결과
  const charResults = useMemo(
    () => compareChars(originalCode, typed),
    [originalCode, typed],
  );

  const correctCount = useMemo(
    () => charResults.filter((c) => c.status === "correct").length,
    [charResults],
  );
  const incorrectCount = useMemo(
    () => charResults.filter((c) => c.status === "incorrect").length,
    [charResults],
  );

  const wpm = useMemo(
    () => calculateWPM(typed.length, elapsed),
    [typed.length, elapsed],
  );
  const accuracy = useMemo(
    () => calculateAccuracy(correctCount, typed.length),
    [correctCount, typed.length],
  );

  const mistakes = useMemo(
    () => collectMistakes(originalCode, typed),
    [originalCode, typed],
  );

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
        startTimer();
        sampler.start();
      }

      // Tab → 스페이스 2칸
      if (e.key === "Tab") {
        e.preventDefault();
        setTyped((prev) => {
          const newTyped = prev + "  ";
          sampler.update(newTyped.length, elapsed);
          if (isTypingComplete(originalCode, newTyped)) {
            setStatus("finished");
            stopTimer();
            sampler.stop();
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
          sampler.update(newTyped.length, elapsed);
          if (isTypingComplete(originalCode, newTyped)) {
            setStatus("finished");
            stopTimer();
            sampler.stop();
          }
          return newTyped;
        });
        return;
      }

      // Backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        setTyped((prev) => {
          const newTyped = prev.slice(0, -1);
          sampler.update(newTyped.length, elapsed);
          return newTyped;
        });
        return;
      }

      // 일반 문자
      if (e.key.length === 1) {
        e.preventDefault();
        setTyped((prev) => {
          const newTyped = prev + e.key;
          sampler.update(newTyped.length, elapsed);
          if (isTypingComplete(originalCode, newTyped)) {
            setStatus("finished");
            stopTimer();
            sampler.stop();
          }
          return newTyped;
        });
      }
    },
    [status, originalCode, elapsed, startTimer, stopTimer, sampler],
  );

  // 리셋
  const resetTyping = useCallback(() => {
    setTyped("");
    setStatus("idle");
    resetTimer();
    sampler.reset();
  }, [resetTimer, sampler]);

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
    samples: sampler.samples,
  };
}
