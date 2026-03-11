import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import ComparisonExercise from './ComparisonExercise';
import DrawingExercise from './DrawingExercise';

interface ComparisonData {
  type: 'comparison';
  num1: number;
  num2: number;
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = ComparisonData | DrawingData;
interface Props { onComplete: (score: number, total: number) => void; }

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function buildSession(): ExerciseData[] {
  // Generate pairs: different and equal numbers 0–10
  const pairs: [number, number][] = [];
  for (let a = 0; a <= 10; a++)
    for (let b = 0; b <= 10; b++)
      pairs.push([a, b]);

  const comparisons: ComparisonData[] = shuffle(pairs).slice(0, 12)
    .map(([n1, n2]) => ({ type: 'comparison', num1: n1, num2: n2 }));

  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
    .map((d) => ({ type: 'drawing', digit: d }));

  const result: ExerciseData[] = [];
  let ci = 0; let di = 0;
  while (ci < comparisons.length || di < drawings.length) {
    if (ci < comparisons.length) result.push(comparisons[ci++]);
    if (ci < comparisons.length) result.push(comparisons[ci++]);
    if (ci < comparisons.length) result.push(comparisons[ci++]);
    if (di < drawings.length) result.push(drawings[di++]);
  }
  return result;
}

const SESSION_SECONDS = 300;

export default function ExerciseSession({ onComplete }: Props) {
  const [exercises] = useState<ExerciseData[]>(() => buildSession());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);

  const advance = useCallback((correct?: boolean) => {
    const newScore = correct ? score + 1 : score;
    if (correct === true) setScore(newScore);
    const next = currentIdx + 1;
    if (next >= exercises.length) onComplete(newScore, exercises.length);
    else setCurrentIdx(next);
  }, [currentIdx, exercises.length, onComplete, score]);

  useEffect(() => {
    if (timeLeft <= 0) { onComplete(score, currentIdx); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, onComplete, score, currentIdx]);

  const exercise = exercises[currentIdx];

  return (
    <div className="tablet-screen flex flex-col h-full bg-gradient-to-b from-orange-100 via-yellow-50 to-pink-100">
      <div className="tablet-session-grid flex flex-1 flex-col p-2">
        <div className="tablet-session-side">
          <div className="flex justify-center px-4 pt-2">
            {exercise.type === 'comparison'
              ? <span className="bg-orange-200 text-orange-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">⚖️ VERGLEICHEN</span>
              : <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">✏️ SCHREIB-ÜBUNG</span>
            }
          </div>

          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'comparison'
              ? <ComparisonExercise key={currentIdx} num1={exercise.num1} num2={exercise.num2}
                  onAnswer={(c) => advance(c)} />
              : <DrawingExercise key={currentIdx} digit={exercise.digit} onDone={(isCorrect) => advance(isCorrect)} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
