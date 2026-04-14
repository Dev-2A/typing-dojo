import { useState, useRef, useCallback } from "react";
import { calculateWPM } from "../utils/typing";

/**
 * WPM을 1초 간격으로 샘플링 → 실시간 그래프용 데이터 수집
 * 외부에서 start() / stop() / reset()을 호출하는 방식
 */
export default function useWpmSampler() {
  const [samples, setSamples] = useState([]);
  const intervalRef = useRef(null);
  const typedRef = useRef(0);
  const elapsedRef = useRef(0);

  // 매 키 입력마다 최신 값 동기화 (렌더가 아닌 이벤트 핸들러에서 호출)
  const update = useCallback((typedLength, elapsed) => {
    typedRef.current = typedLength;
    elapsedRef.current = elapsed;
  }, []);

  const start = useCallback(() => {
    setSamples([{ time: 0, wpm: 0, chars: 0 }]);

    intervalRef.current = setInterval(() => {
      const currentWpm = calculateWPM(typedRef.current, elapsedRef.current);
      const timeSec = Math.round(elapsedRef.current / 1000);

      setSamples((prev) => [
        ...prev,
        { time: timeSec, wpm: currentWpm, chars: typedRef.current },
      ]);
    }, 1000);
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stop();
    setSamples([]);
    typedRef.current = 0;
    elapsedRef.current = 0;
  }, [stop]);

  return { samples, update, start, stop, reset };
}
