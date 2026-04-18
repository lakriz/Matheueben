import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import PlusMinusExercise from './PlusMinusExercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PlusMinusData {
  type: 'plusminus';
  operation: '+' | '-';
  num1: number;
  num2: number;
  correctAnswer: number;
  choices: number[];
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = PlusMinusData | DrawingData;

interface Props {
  readonly onComplete: (score: number, total: number) => void;
  readonly onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function generateChoices(correct: number): number[] {
  const min = Math.max(0, correct - 4);
  const max = Math.min(20, correct + 4);
  const set = new Set<number>([correct]);
  while (set.size < 4) {
    const candidate = Math.floor(Math.random() * (max - min + 1)) + min;
    set.add(candidate);
  }
  return shuffle(Array.from(set));
}

function buildSession(): ExerciseData[] {
  // Generate all valid addition pairs: a in 1-10, b in 1-10, sum <= 20
  const addPairs: [number, number][] = [];
  for (let a = 1; a <= 10; a++) {
    for (let b = 1; b <= 10; b++) {
      if (a + b <= 20) addPairs.push([a, b]);
    }
  }

  // Generate all valid subtraction pairs: a in 5-20, b in 1..min(a-1, 10)
  const subPairs: [number, number][] = [];
  for (let a = 5; a <= 20; a++) {
    for (let b = 1; b <= Math.min(a - 1, 10); b++) {
      subPairs.push([a, b]);
    }
  }

  const chosenAdd = shuffle(addPairs).slice(0, 6);
  const chosenSub = shuffle(subPairs).slice(0, 6);

  // Alternate addition and subtraction
  const plusMinusExercises: PlusMinusData[] = [];
  for (let i = 0; i < 6; i++) {
    const [a1, a2] = chosenAdd[i];
    plusMinusExercises.push({
      type: 'plusminus',
      operation: '+',
      num1: a1,
      num2: a2,
      correctAnswer: a1 + a2,
      choices: generateChoices(a1 + a2),
    });
    const [s1, s2] = chosenSub[i];
    plusMinusExercises.push({
      type: 'plusminus',
      operation: '-',
      num1: s1,
      num2: s2,
      correctAnswer: s1 - s2,
      choices: generateChoices(s1 - s2),
    });
  }

  // 2 drawing exercises
  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    .slice(0, 2)
    .map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 6 plusminus + 1 drawing, repeat
  const result: ExerciseData[] = [];
  let pi = 0;
  let di = 0;
  while (pi < plusMinusExercises.length || di < drawings.length) {
    for (let k = 0; k < 6 && pi < plusMinusExercises.length; k++) result.push(plusMinusExercises[pi++]);
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
    <div className={`tablet-screen flex flex-col h-full bg-gradient-to-b ${theme.sessionBg}`}>
      <div className="tablet-session-grid flex flex-1 flex-col p-2">
        <div className="tablet-session-side">
          <div className="session-header">
            <CancelButton onCancel={onCancel} />
            {exercise.type === 'plusminus' ? (
              <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>
                {exercise.operation === '+' ? '➕ PLUS' : '➖ MINUS'}
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

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'plusminus' ? (
              <PlusMinusExercise
                key={currentIdx}
                operation={exercise.operation}
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
