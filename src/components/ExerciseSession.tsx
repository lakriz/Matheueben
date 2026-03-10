import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import AdditionExercise from './AdditionExercise';
import DrawingExercise from './DrawingExercise';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AdditionData {
  type: 'addition';
  num1: number;
  num2: number;
  correctAnswer: number;
  choices: number[];
}

interface DrawingData {
  type: 'drawing';
  digit: number;
}

type ExerciseData = AdditionData | DrawingData;

interface Props {
  onComplete: (score: number, total: number) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateChoices(correct: number, min: number, max: number): number[] {
  const set = new Set<number>([correct]);
  while (set.size < 4) {
    const candidate = Math.floor(Math.random() * (max - min + 1)) + min;
    set.add(candidate);
  }
  return shuffle(Array.from(set));
}

/** Build a balanced set of exercises for a 5-minute session */
function buildSession(): ExerciseData[] {
  // Addition pairs (grade 1: sums up to 10)
  const allPairs: [number, number][] = [
    [1, 1], [1, 2], [2, 1], [2, 2], [1, 3], [3, 1],
    [2, 3], [3, 2], [1, 4], [4, 1], [2, 4], [4, 2],
    [3, 3], [1, 5], [5, 1], [2, 5], [5, 2], [0, 5],
    [5, 0], [4, 4], [3, 4], [4, 3], [1, 6], [6, 1],
    [2, 6], [6, 2], [3, 5], [5, 3], [0, 10], [10, 0],
    [1, 9], [9, 1], [2, 8], [8, 2], [3, 7], [7, 3],
    [4, 6], [6, 4], [5, 5],
  ];

  const chosen = shuffle(allPairs).slice(0, 8);
  const additions: AdditionData[] = chosen.map(([num1, num2]) => {
    const correct = num1 + num2;
    return {
      type: 'addition',
      num1,
      num2,
      correctAnswer: correct,
      choices: generateChoices(correct, Math.max(0, correct - 3), Math.min(10, correct + 3)),
    };
  });

  // Drawing exercises: pick 4 digits
  const digits = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 0]).slice(0, 4);
  const drawings: DrawingData[] = digits.map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: add, add, draw, add, add, draw, ...
  const result: ExerciseData[] = [];
  let ai = 0;
  let di = 0;
  while (ai < additions.length || di < drawings.length) {
    if (ai < additions.length) result.push(additions[ai++]);
    if (ai < additions.length) result.push(additions[ai++]);
    if (di < drawings.length) result.push(drawings[di++]);
  }
  return result;
}

const SESSION_SECONDS = 300; // 5 minutes

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ExerciseSession({ onComplete }: Props) {
  const [exercises] = useState<ExerciseData[]>(() => buildSession());
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SESSION_SECONDS);

  const advance = useCallback(
    (correct?: boolean) => {
      const newScore = correct ? score + 1 : score;
      if (correct === true) setScore(newScore);
      const next = currentIdx + 1;
      if (next >= exercises.length) {
        onComplete(newScore, exercises.length);
      } else {
        setCurrentIdx(next);
      }
    },
    [currentIdx, exercises.length, onComplete, score],
  );

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete(score, currentIdx);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, onComplete, score, currentIdx]);

  const exercise = exercises[currentIdx];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-purple-50 to-yellow-100">
      {/* Header with progress */}
      <div className="p-4 pb-2">
        <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
      </div>

      {/* Exercise type badge */}
      <div className="flex justify-center px-4 pt-2">
        {exercise.type === 'addition' ? (
          <span className="bg-purple-200 text-purple-800 text-xl font-black px-6 py-2 rounded-full uppercase">
            ➕ RECHENAUFGABE
          </span>
        ) : (
          <span className="bg-blue-200 text-blue-800 text-xl font-black px-6 py-2 rounded-full uppercase">
            ✏️ SCHREIB-ÜBUNG
          </span>
        )}
      </div>

      {/* Exercise area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {exercise.type === 'addition' ? (
          <AdditionExercise
            key={currentIdx}
            num1={exercise.num1}
            num2={exercise.num2}
            correctAnswer={exercise.correctAnswer}
            choices={exercise.choices}
            onAnswer={(correct) => advance(correct)}
          />
        ) : (
          <DrawingExercise
            key={currentIdx}
            digit={exercise.digit}
            onDone={() => advance(true)}
          />
        )}
      </div>
    </div>
  );
}
