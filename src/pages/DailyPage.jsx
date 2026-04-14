import { useState, useEffect, useMemo } from "react";
import CodeViewer from "../components/typing/CodeViewer";
import TypingInput from "../components/typing/TypingInput";
import LiveStats from "../components/stats/LiveStats";
import WpmChart from "../components/stats/WpmChart";
import KeyboardHeatmap from "../components/stats/KeyboardHeatmap";
import useTyping from "../hooks/useTyping";
import { LANGUAGES } from "../data/snippets";
import { calculateScore, getGrade } from "../utils/difficulty";
import {
  getTodayStr,
  getDailyChallenges,
  getDailyResults,
  saveDailyResult,
  getDailyTotalScore,
  getDailyStreak,
  isDailyComplete,
} from "../utils/daily";

export default function DailyPage() {
  const todayStr = getTodayStr();
  const challenges = useMemo(() => getDailyChallenges(todayStr), [todayStr]);
  const [results, setResults] = useState(() => getDailyResults(todayStr));
  const [activeIndex, setActiveIndex] = useState(() => {
    const res = getDailyResults(todayStr);
    const idx = challenges.findIndex((c) => !res[c.id]);
    return idx === -1 ? 0 : idx;
  });

  const activeSnippet = challenges[activeIndex] || null;
  const typing = useTyping(activeSnippet?.code || "");
  const streak = useMemo(() => getDailyStreak(), [results]);
  const totalScore = useMemo(
    () => getDailyTotalScore(todayStr),
    [results, todayStr],
  );
  const allComplete = useMemo(
    () => isDailyComplete(todayStr),
    [results, todayStr],
  );

  useEffect(() => {
    typing.resetTyping();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  useEffect(() => {
    if (typing.status === "finished" && activeSnippet) {
      const score = calculateScore(
        typing.wpm,
        typing.accuracy,
        activeSnippet.difficulty,
        activeSnippet.code.length,
      );

      saveDailyResult(
        activeSnippet.id,
        {
          wpm: typing.wpm,
          accuracy: typing.accuracy,
          elapsed: typing.elapsed,
          score,
          grade: getGrade(score).grade,
        },
        todayStr,
      );

      setResults(getDailyResults(todayStr));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typing.status]);

  const difficultyLabels = { easy: "초급", medium: "중급", hard: "고급" };
  const difficultyColors = {
    easy: "border-green-500/40 bg-green-500/5",
    medium: "border-yellow-500/40 bg-yellow-500/5",
    hard: "border-red-500/40 bg-red-500/5",
  };

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🔥 매일 도전
            <span className="text-sm font-normal text-gray-400">
              {todayStr}
            </span>
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            매일 새로운 코드 3개 — 초급 · 중급 · 고급
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{streak}</div>
            <div className="text-[10px] text-gray-500">연속 일수</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400">
              {totalScore}
            </div>
            <div className="text-[10px] text-gray-500">오늘 총점</div>
          </div>
        </div>
      </div>

      {/* 챌린지 카드 3개 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {challenges.map((challenge, idx) => {
          const result = results[challenge.id];
          const isActive = activeIndex === idx;
          const isCompleted = !!result;
          const langInfo = LANGUAGES.find((l) => l.id === challenge.language);
          const grade = result ? getGrade(result.score) : null;

          return (
            <button
              key={challenge.id}
              onClick={() => setActiveIndex(idx)}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? `${difficultyColors[challenge.difficulty]} scale-[1.02]`
                  : isCompleted
                    ? "border-gray-700/50 bg-gray-900/30 opacity-70"
                    : "border-gray-700/50 bg-gray-900/50 hover:border-gray-600"
              }`}
            >
              {isCompleted && (
                <span className="absolute top-2 right-2 text-emerald-400 text-lg">
                  ✓
                </span>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{langInfo?.icon}</span>
                <span className="text-xs text-gray-400 uppercase">
                  Round {idx + 1} · {difficultyLabels[challenge.difficulty]}
                </span>
              </div>

              <div className="text-sm font-medium text-gray-200 truncate">
                {challenge.title}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {challenge.language} · {challenge.code.length}자
              </div>

              {result && grade && (
                <div className="mt-2 pt-2 border-t border-gray-700/30 flex items-center gap-2 text-xs">
                  <span className={`font-bold ${grade.color}`}>
                    {grade.grade}
                  </span>
                  <span className="text-gray-500">{result.score}점</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-500">{result.wpm} WPM</span>
                  <span className="text-gray-600">·</span>
                  <span className="text-gray-500">{result.accuracy}%</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 전체 완료 축하 */}
      {allComplete && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-2">
          <div className="text-4xl">🎊</div>
          <div className="text-lg font-bold text-emerald-400">
            오늘의 도전 완료!
          </div>
          <div className="text-sm text-gray-400">
            총점{" "}
            <span className="text-emerald-400 font-bold">{totalScore}</span>점 ·
            연속 <span className="text-orange-400 font-bold">{streak}</span>일
          </div>
          <p className="text-xs text-gray-500">
            내일 새로운 도전이 기다리고 있어요
          </p>
        </div>
      )}

      {/* 선택된 챌린지 — 타이핑 영역 */}
      {activeSnippet && (
        <>
          {/* 컴팩트 통계 바 */}
          <LiveStats
            wpm={typing.wpm}
            accuracy={typing.accuracy}
            formattedTime={typing.formattedTime}
            progress={typing.progress}
            correctCount={typing.correctCount}
            incorrectCount={typing.incorrectCount}
            status={typing.status}
            samples={typing.samples}
          />

          {/* 완료 시 점수 */}
          {typing.status === "finished" && results[activeSnippet.id] && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center space-y-3">
              <div className="text-4xl font-bold">
                <span
                  className={getGrade(results[activeSnippet.id].score).color}
                >
                  {results[activeSnippet.id].grade}
                </span>
              </div>
              <div className="text-lg text-gray-200">
                <span className="text-emerald-400 font-bold">
                  {results[activeSnippet.id].score}
                </span>
                <span className="text-gray-500"> 점</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                <span>WPM {typing.wpm}</span>
                <span>·</span>
                <span>정확도 {typing.accuracy}%</span>
                <span>·</span>
                <span>{typing.formattedTime}</span>
              </div>

              {activeIndex < challenges.length - 1 && (
                <button
                  onClick={() => setActiveIndex(activeIndex + 1)}
                  className="mt-2 px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-colors"
                >
                  다음 도전으로 →
                </button>
              )}
            </div>
          )}

          {/* 코드 뷰어 + 타이핑 */}
          <CodeViewer
            snippet={activeSnippet}
            progress={typing.progress}
            status={typing.status}
          />
          <TypingInput
            snippet={activeSnippet}
            charResults={typing.charResults}
            typed={typing.typed}
            status={typing.status}
            onKeyDown={typing.handleKeyDown}
            onReset={typing.resetTyping}
            wpm={typing.wpm}
            accuracy={typing.accuracy}
            formattedTime={typing.formattedTime}
            progress={typing.progress}
          />

          {/* 분석 도구 — 하단 고정 (레이아웃 시프트 방지) */}
          {typing.status !== "idle" && typing.samples.length >= 2 && (
            <WpmChart samples={typing.samples} />
          )}
          {typing.status !== "idle" && typing.incorrectCount > 0 && (
            <KeyboardHeatmap mistakes={typing.mistakes} />
          )}
        </>
      )}
    </div>
  );
}
