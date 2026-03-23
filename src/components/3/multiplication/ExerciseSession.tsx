import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import Multiplication3Exercise from './Multiplication3Exercise';
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
  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  // 12 multiplication problems (grade 3: one factor up to 20, other up to 10)
  const multiplications: MultiplicationData[] = [];
  while (multiplications.length < 12) {
    const num1 = rand(2, 20);
    const num2 = rand(2, 10);
    const correct = num1 * num2;
    multiplications.push({
      type: 'multiplication',
      num1,
      num2,
      correctAnswer: correct,
      choices: generateChoices(correct, Math.max(2, correct - 30), correct + 30),
    });
  }

  // Drawing exercises: pick 4 random digits
  const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  const drawings: DrawingData[] = digits.map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 3 multiplication, 1 drawing, repeat
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

const SESSION_SECONDS = 300;

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
                ✖️ MULTIPLIZIEREN
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
              <Multiplication3Exercise
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
