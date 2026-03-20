import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import WordProblemExercise, { type WordProblem } from './WordProblemExercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

interface WordProblemData {
  type: 'wordproblem';
  problem: WordProblem;
}
interface DrawingData { type: 'drawing'; digit: number; }
type ExerciseData = WordProblemData | DrawingData;

interface Props {
  readonly onComplete: (score: number, total: number) => void;
  readonly onCancel: () => void;
}

// Raw problem definitions (choices generated at session build time)
const WORD_PROBLEMS_RAW: Array<{ text: string; emoji: string; correctAnswer: number }> = [
  // Addition
  { text: 'Lisa hat 3 Äpfel. Sie bekommt 4 mehr. Wie viele Äpfel hat Lisa jetzt?', emoji: '🍎', correctAnswer: 7 },
  { text: 'Im Garten sind 5 Blumen. Mama pflanzt noch 3 dazu. Wie viele Blumen sind es?', emoji: '🌸', correctAnswer: 8 },
  { text: 'Tom hat 6 Bonbons. Er bekommt von Oma 5 mehr. Wie viele Bonbons hat er?', emoji: '🍬', correctAnswer: 11 },
  { text: 'Auf dem Baum sitzen 4 Vögel. Es fliegen noch 6 dazu. Wie viele Vögel sitzen jetzt dort?', emoji: '🐦', correctAnswer: 10 },
  { text: 'Max hat 7 Murmeln. Er findet noch 5 mehr. Wie viele Murmeln hat Max jetzt?', emoji: '🔵', correctAnswer: 12 },
  { text: 'Im Teich schwimmen 8 Fische. Es kommen 4 neue dazu. Wie viele Fische sind im Teich?', emoji: '🐟', correctAnswer: 12 },
  { text: 'Anna hat 9 Stifte. Sie bekommt noch 3 dazu. Wie viele Stifte hat Anna?', emoji: '✏️', correctAnswer: 12 },
  { text: 'In der Tüte sind 6 Äpfel und 7 Birnen. Wie viele Früchte sind es zusammen?', emoji: '🍏', correctAnswer: 13 },
  { text: 'Paula sammelt 8 Steine und noch 5 Steine. Wie viele Steine hat Paula?', emoji: '🪨', correctAnswer: 13 },
  { text: 'Auf der Wiese grasen 7 Kühe und 6 Schafe. Wie viele Tiere sind das?', emoji: '🐄', correctAnswer: 13 },
  { text: 'Lena hat 2 Puppen. Sie bekommt noch 6 mehr. Wie viele Puppen hat Lena jetzt?', emoji: '🪆', correctAnswer: 8 },
  { text: 'Im Regal stehen 5 Bücher. Papa stellt noch 4 dazu. Wie viele Bücher sind es?', emoji: '📚', correctAnswer: 9 },
  // Subtraction
  { text: 'Tim hat 10 Kekse. Er isst 3 auf. Wie viele Kekse hat Tim noch?', emoji: '🍪', correctAnswer: 7 },
  { text: 'Im Korb sind 8 Eier. Mama nimmt 4 heraus. Wie viele Eier sind noch im Korb?', emoji: '🥚', correctAnswer: 4 },
  { text: 'Leo hat 12 Murmeln. Er verliert 5. Wie viele Murmeln hat Leo noch?', emoji: '🔴', correctAnswer: 7 },
  { text: 'Im Park spielen 15 Kinder. 6 Kinder gehen nach Hause. Wie viele Kinder spielen noch?', emoji: '🏃', correctAnswer: 9 },
  { text: 'Sophie hat 11 Bücher. Sie gibt 4 Bücher weg. Wie viele Bücher hat Sophie noch?', emoji: '📚', correctAnswer: 7 },
  { text: 'In der Schachtel sind 14 Buntstifte. Felix nimmt 6 heraus. Wie viele sind noch drin?', emoji: '🖍️', correctAnswer: 8 },
  { text: 'Auf dem Tisch stehen 10 Gläser. 3 fallen herunter. Wie viele Gläser stehen noch?', emoji: '🥛', correctAnswer: 7 },
  { text: 'Ben hat 9 Karten. Er verschenkt 3. Wie viele Karten hat Ben noch?', emoji: '🃏', correctAnswer: 6 },
  { text: 'Im Baum hängen 16 Äpfel. 7 fallen ab. Wie viele Äpfel hängen noch oben?', emoji: '🍎', correctAnswer: 9 },
  { text: 'Klara hat 20 Perlen. Sie verliert 8. Wie viele Perlen hat Klara noch?', emoji: '💎', correctAnswer: 12 },
];

function buildChoices(correct: number): number[] {
  const candidates = new Set<number>([correct]);
  const offsets = shuffle([-4, -3, -2, -1, 1, 2, 3, 4]);
  for (const off of offsets) {
    if (candidates.size >= 4) break;
    const val = correct + off;
    if (val >= 0 && val <= 20) candidates.add(val);
  }
  // Fill remaining with safe fallbacks if range was too tight
  for (let fallback = 0; candidates.size < 4 && fallback <= 20; fallback++) {
    candidates.add(fallback);
  }
  return shuffle([...candidates].slice(0, 4));
}

function shuffle<T>(arr: T[]): T[] {
  const r = [...arr];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function buildSession(): ExerciseData[] {
  const picked = shuffle(WORD_PROBLEMS_RAW).slice(0, 12);
  const problems: WordProblemData[] = picked.map((raw) => ({
    type: 'wordproblem',
    problem: { ...raw, choices: buildChoices(raw.correctAnswer) },
  }));

  const drawings: DrawingData[] = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4)
    .map((d) => ({ type: 'drawing', digit: d }));

  const result: ExerciseData[] = [];
  let pi = 0; let di = 0;
  while (pi < problems.length || di < drawings.length) {
    if (pi < problems.length) result.push(problems[pi++]);
    if (pi < problems.length) result.push(problems[pi++]);
    if (pi < problems.length) result.push(problems[pi++]);
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
            {exercise.type === 'wordproblem'
              ? <span className={`${theme.accentLight} ${theme.accentText} text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase`}>📖 SACHAUFGABEN</span>
              : <span className="bg-yellow-200 text-yellow-800 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">✏️ SCHREIB-ÜBUNG</span>
            }
          </div>

          <div className="tablet-progress p-3 pt-2">
            <ProgressBar current={currentIdx} total={exercises.length} timeLeft={timeLeft} />
          </div>
        </div>

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'wordproblem'
              ? <WordProblemExercise key={currentIdx} problem={exercise.problem}
                  onAnswer={(c) => advance(c)} />
              : <DrawingExercise key={currentIdx} digit={exercise.digit} onDone={(isCorrect) => advance(isCorrect)} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}
