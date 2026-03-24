import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import EinmaleinsExercise from './EinmaleinsExercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MultiplicationData {
  type: 'multiplication';
  num1: number;
  num2: number;
  correctAnswer: number;
  choices: number[];
}

interface DrawingData {
  type: 'drawing';
  digit: number;
}

type ExerciseData = MultiplicationData | DrawingData;

interface Props {
  onComplete: (score: number, total: number) => void;
  onCancel: () => void;
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
  // Generate all multiplication pairs from tables 2-10
  const allPairs: [number, number][] = [];
  for (let a = 2; a <= 10; a++) {
    for (let b = 2; b <= 10; b++) {
      allPairs.push([a, b]);
    }
  }

  // Pick 12 random pairs
  const chosen = shuffle(allPairs).slice(0, 12);
  const multiplications: MultiplicationData[] = chosen.map(([num1, num2]) => {
    const correct = num1 * num2;
    return {
      type: 'multiplication',
      num1,
      num2,
      correctAnswer: correct,
      choices: generateChoices(correct, Math.max(2, correct - 12), correct + 12),
    };
  });

  // Drawing exercises: pick 4 random digits
  const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  const drawings: DrawingData[] = digits.map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 3 multiplication, 1 drawing, 3 multiplication, 1 drawing, …
  const result: ExerciseData[] = [];
  let mi = 0;
  let di = 0;
  while (mi < multiplications.length || di < drawings.length) {
    if (mi < multiplications.length) result.push(multiplications[mi++]);
    if (mi < multiplications.length) result.push(multiplications[mi++]);
    if (mi < multiplications.length) result.push(multiplications[mi++]);
    if (di < drawings.length) result.push(drawings[di++]);
  }
  return result;
}

const SESSION_SECONDS = 300; // 5 minutes

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ExerciseSession({ onComplete, onCancel }: Props) {
  const { theme } = useTheme();
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
    <div className={`tablet-screen flex flex-col h-full bg-gradient-to-b ${theme.sessionBg}`}>
      <div className="tablet-session-grid flex flex-1 flex-col p-2">
        <div className="tablet-session-side">
          {/* Exercise type badge */}
          <div className="session-header">
            <CancelButton onCancel={onCancel} />
            {exercise.type === 'multiplication' ? (
              <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>
                ✖️ EINMALEINS
              </span>
            ) : (
              <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">
                ✏️ SCHREIB-ÜBUNG
              </span>
            )}
          </div>

          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>

        {/* Exercise area */}
        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'multiplication' ? (
              <EinmaleinsExercise
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
                onDone={(isCorrect) => advance(isCorrect)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
