import { useState, useRef, useCallback, useEffect } from "react";

export default function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);

  // 인터벌 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);

    // 100ms 간격으로 업데이트 (초당 10회 — 부드럽고 안정적)
    intervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setElapsed(Date.now() - startTimeRef.current);
      }
    }, 100);
  }, []);

  const stop = useCallback(() => {
    // 마지막 정확한 시간 기록
    if (startTimeRef.current) {
      setElapsed(Date.now() - startTimeRef.current);
    }
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    startTimeRef.current = null;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return {
    elapsed,
    isRunning,
    start,
    stop,
    reset,
    formattedTime: formatTime(elapsed),
  };
}
