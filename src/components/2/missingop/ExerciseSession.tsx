import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import MissingOpExercise, { type MissingOpType } from './MissingOpExercise';
import DrawingExercise from '../addition100/DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MissingOpData {
  type: 'missingop';
  opType: MissingOpType;
  known1: number;
  known2: number;
  correctAnswer: number;
  choices: number[];
}

interface DrawingData {
  type: 'drawing';
  digit: number;
}

type ExerciseData = MissingOpData | DrawingData;

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

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChoices(correct: number, min: number, max: number): number[] {
  const s = new Set<number>([correct]);
  while (s.size < 4) {
    const v = Math.floor(Math.random() * (max - min + 1)) + min;
    if (v > 0) s.add(v);
  }
  return shuffle(Array.from(s));
}

function buildSession(): ExerciseData[] {
  const exercises: MissingOpData[] = [];

  // addMissing1: ☐ + known2 = result (find first addend)
  for (let i = 0; i < 3; i++) {
    const known2 = rand(5, 45);
    const answer = rand(5, 45);
    const result = answer + known2;
    if (result > 100) continue;
    exercises.push({
      type: 'missingop',
      opType: 'addMissing1',
      known1: answer,
      known2,
      correctAnswer: answer,
      choices: generateChoices(answer, Math.max(1, answer - 15), Math.min(95, answer + 15)),
    });
  }

  // addMissing2: known1 + ☐ = result (find second addend)
  for (let i = 0; i < 3; i++) {
    const known1 = rand(5, 45);
    const answer = rand(5, 45);
    if (known1 + answer > 100) continue;
    exercises.push({
      type: 'missingop',
      opType: 'addMissing2',
      known1,
      known2: answer,
      correctAnswer: answer,
      choices: generateChoices(answer, Math.max(1, answer - 15), Math.min(95, answer + 15)),
    });
  }

  // subMissing1: ☐ - known2 = result (find minuend)
  for (let i = 0; i < 3; i++) {
    const known2 = rand(5, 40);
    const result = rand(5, 55);
    const answer = result + known2;
    if (answer > 100) continue;
    exercises.push({
      type: 'missingop',
      opType: 'subMissing1',
      known1: answer,
      known2,
      correctAnswer: answer,
      choices: generateChoices(answer, Math.max(known2 + 1, answer - 15), Math.min(100, answer + 15)),
    });
  }

  // subMissing2: known1 - ☐ = result (find subtrahend)
  for (let i = 0; i < 3; i++) {
    const known1 = rand(20, 90);
    const answer = rand(5, known1 - 5);
    exercises.push({
      type: 'missingop',
      opType: 'subMissing2',
      known1,
      known2: answer,
      correctAnswer: answer,
      choices: generateChoices(answer, Math.max(1, answer - 15), Math.min(known1 - 1, answer + 15)),
    });
  }

  // Fill up to 12 if some were skipped
  while (exercises.length < 12) {
    const known1 = rand(10, 50);
    const known2 = rand(1, known1 - 1);
    const answer = known1 - known2;
    exercises.push({
      type: 'missingop',
      opType: 'subMissing2',
      known1,
      known2: answer,
      correctAnswer: answer,
      choices: generateChoices(answer, Math.max(1, answer - 15), Math.min(known1 - 1, answer + 15)),
    });
  }

  const shuffled = shuffle(exercises).slice(0, 12);

  // Only 2 drawing exercises per session
  const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2);
  const drawings: DrawingData[] = digits.map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 6 main : 1 drawing
  const result: ExerciseData[] = [];
  let ei = 0;
  let di = 0;
  while (ei < shuffled.length || di < drawings.length) {
    for (let k = 0; k < 6 && ei < shuffled.length; k++) result.push(shuffled[ei++]);
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
            {exercise.type === 'missingop' ? (
              <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>
                🔍 GEHEIMZAHL
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
            {exercise.type === 'missingop' ? (
              <MissingOpExercise
                key={currentIdx}
                opType={exercise.opType}
                known1={exercise.known1}
                known2={exercise.known2}
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
