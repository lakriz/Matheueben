import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import ComplementExercise from './ComplementExercise';
import DrawingExercise from './DrawingExercise';

interface ComplementData {
  type: 'complement';
  num1: number | null;
  num2: number | null;
  target: number;
  correctAnswer: number;
  choices: number[];
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = ComplementData | DrawingData;
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
  const complements: ComplementData[] = [];

  for (let i = 0; i < 12; i++) {
    const target = Math.floor(Math.random() * 9) + 2; // 2–10
    const known = Math.floor(Math.random() * target); // 0..(target-1)
    const missing = target - known;
    const gapLeft = Math.random() < 0.5;

    complements.push({
      type: 'complement',
      num1: gapLeft ? null : known,
      num2: gapLeft ? known : null,
      target,
      correctAnswer: missing,
      choices: generateChoices(missing, Math.max(0, missing - 3), Math.min(10, missing + 3)),
    });
  }

  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
    .map((d) => ({ type: 'drawing', digit: d }));

  const result: ExerciseData[] = [];
  let ci = 0; let di = 0;
  while (ci < complements.length || di < drawings.length) {
    if (ci < complements.length) result.push(complements[ci++]);
    if (ci < complements.length) result.push(complements[ci++]);
    if (ci < complements.length) result.push(complements[ci++]);
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
    <div className="tablet-screen flex flex-col h-full bg-gradient-to-b from-teal-100 via-cyan-50 to-green-100">
      <div className="tablet-session-grid flex flex-1 flex-col p-2">
        <div className="tablet-session-side">
          <div className="flex justify-center px-4 pt-2">
            {exercise.type === 'complement'
              ? <span className="bg-teal-200 text-teal-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">🧩 ERGÄNZEN</span>
              : <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">✏️ SCHREIB-ÜBUNG</span>
            }
          </div>
          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'complement'
              ? <ComplementExercise key={currentIdx}
                  num1={exercise.num1} num2={exercise.num2} target={exercise.target}
                  correctAnswer={exercise.correctAnswer} choices={exercise.choices}
                  onAnswer={(c) => advance(c)} />
              : <DrawingExercise key={currentIdx} digit={exercise.digit} onDone={(isCorrect) => advance(isCorrect)} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

