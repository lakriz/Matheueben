import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import NumberRange1000Exercise from './NumberRange1000Exercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

interface NumberData {
  type: 'number';
  question: string;
  correctAnswer: number;
  choices: number[];
}

interface DrawingData { type: 'drawing'; digit: number; }

type ExerciseData = NumberData | DrawingData;

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

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChoices(correct: number, min: number, max: number): number[] {
  const s = new Set<number>([correct]);
  while (s.size < 4) {
    const offset = randInt(-10, 10);
    const candidate = correct + offset;
    if (candidate >= min && candidate <= max && candidate !== correct) {
      s.add(candidate);
    }
  }
  return shuffle(Array.from(s));
}

function roundToNearestHundred(n: number): number {
  return Math.round(n / 100) * 100;
}

function buildSession(): ExerciseData[] {
  const generators: (() => NumberData)[] = [
    // "Was kommt nach X?"
    () => {
      const x = randInt(100, 998);
      const answer = x + 1;
      return { type: 'number', question: `Was kommt nach ${x}?`, correctAnswer: answer, choices: generateChoices(answer, 1, 1000) };
    },
    // "Was kommt vor X?"
    () => {
      const x = randInt(101, 999);
      const answer = x - 1;
      return { type: 'number', question: `Was kommt vor ${x}?`, correctAnswer: answer, choices: generateChoices(answer, 1, 1000) };
    },
    // "Welche Zahl liegt zwischen X und Y?"
    () => {
      const x = randInt(100, 998);
      const y = x + 2;
      const answer = x + 1;
      return { type: 'number', question: `Welche Zahl liegt zwischen ${x} und ${y}?`, correctAnswer: answer, choices: generateChoices(answer, 1, 1000) };
    },
    // "Runde X auf den nächsten Hunderter"
    () => {
      const x = randInt(101, 999);
      // Avoid exact multiples of 100 so there's a meaningful rounding
      const value = x % 100 === 0 ? x + randInt(1, 99) : x;
      const answer = roundToNearestHundred(value);
      return { type: 'number', question: `Runde ${value} auf den nächsten Hunderter`, correctAnswer: answer, choices: generateChoices(answer, 0, 1000) };
    },
  ];

  // Generate 12 number exercises with varied types
  const numbers: NumberData[] = Array.from({ length: 12 }, () => {
    const gen = generators[randInt(0, generators.length - 1)];
    return gen();
  });

  // 4 drawing exercises with random digits
  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
    .map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 3 number, 1 drawing
  const result: ExerciseData[] = [];
  let ni = 0;
  let di = 0;
  while (ni < numbers.length || di < drawings.length) {
    if (ni < numbers.length) result.push(numbers[ni++]);
    if (ni < numbers.length) result.push(numbers[ni++]);
    if (ni < numbers.length) result.push(numbers[ni++]);
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
            {exercise.type === 'number'
              ? <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>
                  🔢 ZAHLENRAUM 1000
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
            {exercise.type === 'number'
              ? <NumberRange1000Exercise
                  key={currentIdx}
                  question={exercise.question}
                  correctAnswer={exercise.correctAnswer}
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
