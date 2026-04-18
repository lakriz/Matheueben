import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import NumberRange100Exercise from './NumberRange100Exercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface NumberRangeData {
  type: 'numberrange';
  question: string;
  correctAnswer: number;
  choices: number[];
}

interface DrawingData {
  type: 'drawing';
  digit: number;
}

type ExerciseData = NumberRangeData | DrawingData;

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

  const pool: NumberRangeData[] = [];

  // "Was kommt nach X?" – number after X (X: 10–98)
  for (let i = 0; i < 6; i++) {
    const x = rand(10, 98);
    const correct = x + 1;
    pool.push({
      type: 'numberrange',
      question: `Was kommt nach ${x}?`,
      correctAnswer: correct,
      choices: generateChoices(correct, Math.max(0, correct - 5), Math.min(100, correct + 5)),
    });
  }

  // "Was kommt vor X?" – number before X (X: 11–99)
  for (let i = 0; i < 6; i++) {
    const x = rand(11, 99);
    const correct = x - 1;
    pool.push({
      type: 'numberrange',
      question: `Was kommt vor ${x}?`,
      correctAnswer: correct,
      choices: generateChoices(correct, Math.max(0, correct - 5), Math.min(100, correct + 5)),
    });
  }

  // "Welche Zahl liegt zwischen X und Y?"
  for (let i = 0; i < 6; i++) {
    const x = rand(10, 97);
    const y = x + 2;
    const correct = x + 1;
    pool.push({
      type: 'numberrange',
      question: `Welche Zahl liegt zwischen ${x} und ${y}?`,
      correctAnswer: correct,
      choices: generateChoices(correct, Math.max(0, correct - 5), Math.min(100, correct + 5)),
    });
  }

  // "Runde X auf den nächsten Zehner"
  for (let i = 0; i < 6; i++) {
    const x = rand(11, 99);
    // Skip exact tens – rounding is trivial
    const num = x % 10 === 0 ? x + rand(1, 9) : x;
    const correct = Math.round(num / 10) * 10;
    pool.push({
      type: 'numberrange',
      question: `Runde ${num} auf den nächsten Zehner`,
      correctAnswer: correct,
      choices: generateChoices(correct, Math.max(0, correct - 20), Math.min(100, correct + 20)),
    });
  }

  // Pick 12 random problems from the pool
  const problems = shuffle(pool).slice(0, 12);

  // Drawing exercises: pick 2 random digits
  const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2);
  const drawings: DrawingData[] = digits.map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 6 number range, 1 drawing, 6 number range, 1 drawing
  const result: ExerciseData[] = [];
  let ni = 0;
  let di = 0;
  while (ni < problems.length || di < drawings.length) {
    for (let k = 0; k < 6 && ni < problems.length; k++) result.push(problems[ni++]);
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
            {exercise.type === 'numberrange' ? (
              <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>
                🔟 ZAHLENRAUM 100
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
            {exercise.type === 'numberrange' ? (
              <NumberRange100Exercise
                key={currentIdx}
                question={exercise.question}
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
