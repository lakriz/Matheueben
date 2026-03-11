import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import DoublingExercise from './DoublingExercise';
import DrawingExercise from './DrawingExercise';

interface DoublingData {
  type: 'doubling';
  mode: 'double' | 'half';
  inputNumber: number;
  correctAnswer: number;
  choices: number[];
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = DoublingData | DrawingData;
interface Props { readonly onComplete: (score: number, total: number) => void; }

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function generateChoices(correct: number, min: number, max: number): number[] {
  const s = new Set<number>([correct]);
  while (s.size < 4) {
    const v = Math.floor(Math.random() * (max - min + 1)) + min;
    if (v >= 0) s.add(v);
  }
  return shuffle(Array.from(s));
}

function buildSession(): ExerciseData[] {
  const exercises: DoublingData[] = [];

  // Doubling: 1–10
  const doubleNums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 6);
  for (const n of doubleNums) {
    const c = n * 2;
    exercises.push({
      type: 'doubling', mode: 'double', inputNumber: n, correctAnswer: c,
      choices: generateChoices(c, Math.max(0, c - 4), c + 4),
    });
  }

  // Halving: even numbers 2–20
  const halfNums = shuffle([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]).slice(0, 6);
  for (const n of halfNums) {
    const c = n / 2;
    exercises.push({
      type: 'doubling', mode: 'half', inputNumber: n, correctAnswer: c,
      choices: generateChoices(c, Math.max(0, c - 3), c + 3),
    });
  }

  const shuffled = shuffle(exercises);

  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
    .map((d) => ({ type: 'drawing', digit: d }));

  const result: ExerciseData[] = [];
  let ei = 0; let di = 0;
  while (ei < shuffled.length || di < drawings.length) {
    if (ei < shuffled.length) result.push(shuffled[ei++]);
    if (ei < shuffled.length) result.push(shuffled[ei++]);
    if (ei < shuffled.length) result.push(shuffled[ei++]);
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
    <div className="tablet-screen flex flex-col h-full bg-gradient-to-b from-rose-100 via-pink-50 to-purple-100">
      <div className="tablet-session-grid flex flex-1 flex-col p-2">
        <div className="tablet-session-side">
          <div className="flex justify-center px-4 pt-2">
            {exercise.type === 'doubling'
              ? <span className="bg-rose-200 text-rose-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">
                  {exercise.mode === 'double' ? '🪞 VERDOPPELN' : '✂️ HALBIEREN'}
                </span>
              : <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">✏️ SCHREIB-ÜBUNG</span>
            }
          </div>
          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'doubling'
              ? <DoublingExercise key={currentIdx} mode={exercise.mode}
                  inputNumber={exercise.inputNumber} correctAnswer={exercise.correctAnswer}
                  choices={exercise.choices} onAnswer={(c) => advance(c)} />
              : <DrawingExercise key={currentIdx} digit={exercise.digit} onDone={(isCorrect) => advance(isCorrect)} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

