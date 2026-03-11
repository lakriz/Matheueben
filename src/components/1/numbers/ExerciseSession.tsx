import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import NumberExercise from './NumberExercise';
import DrawingExercise from './DrawingExercise';

interface CountingData {
  type: 'counting';
  count: number;
  emoji: string;
  label: string;
  choices: number[];
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = CountingData | DrawingData;
interface Props { onComplete: (score: number, total: number) => void; }

const EMOJI_ITEMS = [
  { emoji: '🍎', label: 'Äpfel' },
  { emoji: '🐶', label: 'Hunde' },
  { emoji: '⭐', label: 'Sterne' },
  { emoji: '🌸', label: 'Blumen' },
  { emoji: '🐟', label: 'Fische' },
  { emoji: '🦋', label: 'Schmetterlinge' },
  { emoji: '🍓', label: 'Erdbeeren' },
  { emoji: '🐱', label: 'Katzen' },
  { emoji: '🌈', label: 'Regenbögen' },
  { emoji: '🎈', label: 'Luftballons' },
];

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
  const items = shuffle(EMOJI_ITEMS);
  const countings: CountingData[] = Array.from({ length: 12 }, (_, i) => {
    const count = Math.floor(Math.random() * 9) + 1;
    const item = items[i % items.length];
    return { type: 'counting', count, emoji: item.emoji, label: item.label,
      choices: generateChoices(count) };
  });

  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
    .map((d) => ({ type: 'drawing', digit: d }));

  const result: ExerciseData[] = [];
  let ci = 0; let di = 0;
  while (ci < countings.length || di < drawings.length) {
    if (ci < countings.length) result.push(countings[ci++]);
    if (ci < countings.length) result.push(countings[ci++]);
    if (ci < countings.length) result.push(countings[ci++]);
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
    <div className="tablet-screen flex flex-col h-full bg-gradient-to-b from-green-100 via-teal-50 to-yellow-100">
      <div className="tablet-session-grid flex flex-1 flex-col p-2">
        <div className="tablet-session-side">
          <div className="flex justify-center px-4 pt-2">
            {exercise.type === 'counting'
              ? <span className="bg-green-200 text-green-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">🔢 ZAHLEN ZÄHLEN</span>
              : <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">✏️ SCHREIB-ÜBUNG</span>
            }
          </div>

          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'counting'
              ? <NumberExercise key={currentIdx} count={exercise.count} emoji={exercise.emoji}
                  label={exercise.label} choices={exercise.choices} onAnswer={(c) => advance(c)} />
              : <DrawingExercise key={currentIdx} digit={exercise.digit} onDone={(isCorrect) => advance(isCorrect)} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
