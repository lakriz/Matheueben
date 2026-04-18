import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import NumberExercise from './NumberExercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';
interface CountingData {
  type: 'counting';
  count: number;
  emojiIdx: number;
  choices: number[];
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = CountingData | DrawingData;
interface Props { readonly onComplete: (score: number, total: number) => void; readonly onCancel: () => void; }
function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}
function generateChoices(correct: number): number[] {
  const s = new Set<number>([correct]);
  while (s.size < 4) s.add(Math.floor(Math.random() * 9) + 1);
  return shuffle(Array.from(s));
}
function buildSession(): ExerciseData[] {
  const countings: CountingData[] = Array.from({ length: 12 }, (_, i) => {
    const count = Math.floor(Math.random() * 9) + 1;
    return { type: 'counting', count, emojiIdx: i % 8, choices: generateChoices(count) };
  });
  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2)
    .map((d) => ({ type: 'drawing', digit: d }));
  const result: ExerciseData[] = [];
  let ci = 0; let di = 0;
  while (ci < countings.length || di < drawings.length) {
    for (let k = 0; k < 6 && ci < countings.length; k++) result.push(countings[ci++]);
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
            {exercise.type === 'counting'
              ? <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>
                  🔢 ZAHLEN ZÄHLEN
                </span>
              : <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">
                  ✏️ SCHREIB-ÜBUNG
                </span>
            }
          </div>
          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>
        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'counting'
              ? <NumberExercise
                  key={currentIdx}
                  count={exercise.count}
                  emoji={theme.items[exercise.emojiIdx]}
                  label={theme.itemLabels[exercise.emojiIdx]}
                  choices={exercise.choices}
                  onAnswer={(c) => advance(c)}
                />
              : <DrawingExercise
                  key={currentIdx}
                  digit={exercise.digit}
                  onDone={(isCorrect) => advance(isCorrect)}
                />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
