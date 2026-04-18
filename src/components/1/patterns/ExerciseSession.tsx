import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import PatternsExercise from './PatternsExercise';
import DrawingExercise from '../addition/DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PatternData {
  type: 'pattern';
  sequence: number[];
  missingIdx: number;
  correctAnswer: number;
  choices: number[];
}

interface DrawingData {
  type: 'drawing';
  digit: number;
}

type ExerciseData = PatternData | DrawingData;

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

function generateChoices(correct: number, min: number, max: number): number[] {
  const s = new Set<number>([correct]);
  let attempts = 0;
  while (s.size < 4 && attempts < 100) {
    s.add(Math.floor(Math.random() * (max - min + 1)) + min);
    attempts++;
  }
  for (let n = min; s.size < 4 && n <= max; n++) s.add(n);
  return shuffle(Array.from(s));
}

function generatePatternExercise(): PatternData {
  // Define pattern types suitable for grade 1 (numbers 1–20)
  const types: Array<{ step: number; direction: 1 | -1; length: number; maxStart: number }> = [
    { step: 1, direction: 1, length: 5, maxStart: 16 },  // e.g. 3,4,?,6,7
    { step: 2, direction: 1, length: 5, maxStart: 12 },  // e.g. 2,4,?,8,10
    { step: 5, direction: 1, length: 4, maxStart: 10 },  // e.g. 5,?,15,20
    { step: 1, direction: -1, length: 5, maxStart: 20 }, // e.g. 8,7,?,5,4
    { step: 2, direction: -1, length: 5, maxStart: 20 }, // e.g. 10,8,?,4,2
    { step: 3, direction: 1, length: 4, maxStart: 9 },   // e.g. 3,6,?,12
  ];

  const t = types[Math.floor(Math.random() * types.length)];
  const minStart = t.direction === 1 ? 1 : (t.step * (t.length - 1) + 1);
  const start =
    Math.floor(Math.random() * (t.maxStart - minStart + 1)) + minStart;

  const sequence = Array.from({ length: t.length }, (_, i) =>
    t.direction === 1
      ? start + i * t.step
      : start - i * t.step,
  );

  // Make sure all numbers are in valid range (1–20)
  if (sequence.some((n) => n < 1 || n > 20)) {
    return generatePatternExercise(); // retry
  }

  const missingIdx = Math.floor(Math.random() * t.length);
  const correct = sequence[missingIdx];
  const min = Math.max(1, correct - t.step * 2);
  const max = Math.min(20, correct + t.step * 2);

  return {
    type: 'pattern',
    sequence,
    missingIdx,
    correctAnswer: correct,
    choices: generateChoices(correct, min, max),
  };
}

function buildSession(): ExerciseData[] {
  // Generate 12 pattern exercises
  const patterns: PatternData[] = Array.from({ length: 12 }, () => generatePatternExercise());

  // Only 2 drawing exercises per session
  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    .slice(0, 2)
    .map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 6 patterns : 1 drawing
  const result: ExerciseData[] = [];
  let pi = 0;
  let di = 0;
  while (pi < patterns.length || di < drawings.length) {
    for (let k = 0; k < 6 && pi < patterns.length; k++) result.push(patterns[pi++]);
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
      if (next >= exercises.length) onComplete(newScore, exercises.length);
      else setCurrentIdx(next);
    },
    [currentIdx, exercises.length, onComplete, score],
  );

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
            {exercise.type === 'pattern' ? (
              <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>
                🔢 ZAHLEN-MUSTER
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
            {exercise.type === 'pattern' ? (
              <PatternsExercise
                key={currentIdx}
                sequence={exercise.sequence}
                missingIdx={exercise.missingIdx}
                correctAnswer={exercise.correctAnswer}
                choices={exercise.choices}
                onAnswer={(c) => advance(c)}
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
