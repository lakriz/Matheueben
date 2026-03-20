import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import NumberRange20Exercise from './NumberRange20Exercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

interface CountData {
  type: 'count';
  num: number;
  emojiIdx: number;
  choices: number[];
}
interface MissingData {
  type: 'missing';
  num: number;
  sequence: number[];
  missingIdx: number;
  choices: number[];
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = CountData | MissingData | DrawingData;

interface Props {
  readonly onComplete: (score: number, total: number) => void;
  readonly onCancel: () => void;
}

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

function buildSession(): ExerciseData[] {
  const counts: CountData[] = Array.from({ length: 6 }, (_, i) => {
    const num = Math.floor(Math.random() * 10) + 11; // 11–20
    const min = Math.max(1, num - 5);
    const max = Math.min(20, num + 5);
    return { type: 'count', num, emojiIdx: i % 8, choices: generateChoices(num, min, max) };
  });

  const missings: MissingData[] = Array.from({ length: 6 }, () => {
    const start = Math.floor(Math.random() * 16) + 1; // sequence starts 1–16 so last is ≤20
    const sequence = Array.from({ length: 5 }, (_, i) => start + i);
    const missingIdx = Math.floor(Math.random() * 5);
    const num = sequence[missingIdx];
    const min = Math.max(1, num - 5);
    const max = Math.min(20, num + 5);
    return { type: 'missing', num, sequence, missingIdx, choices: generateChoices(num, min, max) };
  });

  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
    .map((d) => ({ type: 'drawing', digit: d }));

  const mainExercises = shuffle([...counts, ...missings]);

  const result: ExerciseData[] = [];
  let mi = 0; let di = 0;
  while (mi < mainExercises.length || di < drawings.length) {
    if (mi < mainExercises.length) result.push(mainExercises[mi++]);
    if (mi < mainExercises.length) result.push(mainExercises[mi++]);
    if (mi < mainExercises.length) result.push(mainExercises[mi++]);
    if (di < drawings.length) result.push(drawings[di++]);
  }
  return result;
}

const SESSION_SECONDS = 300;

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
            {exercise.type !== 'drawing'
              ? <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>🔢 ZAHLENRAUM BIS 20</span>
              : <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">✏️ SCHREIB-ÜBUNG</span>
            }
          </div>

          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'count' ? (
              <NumberRange20Exercise
                key={currentIdx}
                exerciseType="count"
                num={exercise.num}
                emojiIdx={exercise.emojiIdx}
                choices={exercise.choices}
                onAnswer={(c) => advance(c)}
              />
            ) : exercise.type === 'missing' ? (
              <NumberRange20Exercise
                key={currentIdx}
                exerciseType="missing"
                num={exercise.num}
                sequence={exercise.sequence}
                missingIdx={exercise.missingIdx}
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
