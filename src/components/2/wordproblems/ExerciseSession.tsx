import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import WordProblem2Exercise from './WordProblem2Exercise';
import DrawingExercise from './DrawingExercise';
import { useTheme } from '../../../theme/ThemeContext';
import CancelButton from '../../CancelButton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface WordProblemData {
  type: 'wordproblem';
  text: string;
  emoji: string;
  correctAnswer: number;
  choices: number[];
}

interface DrawingData {
  type: 'drawing';
  digit: number;
}

type ExerciseData = WordProblemData | DrawingData;

interface Props {
  onComplete: (score: number, total: number) => void;
  onCancel: () => void;
}

// ---------------------------------------------------------------------------
// Word problem pool
// ---------------------------------------------------------------------------
interface WordProblemTemplate {
  text: string;
  answer: number;
  emoji: string;
}

const WORD_PROBLEM_POOL: WordProblemTemplate[] = [
  // Addition
  { text: 'Mama kauft 25 Äpfel und 18 Birnen. Wie viele Früchte hat sie insgesamt?', answer: 43, emoji: '🍎' },
  { text: 'In der Klasse sind 14 Mädchen und 13 Jungen. Wie viele Kinder sind in der Klasse?', answer: 27, emoji: '🏫' },
  { text: 'Paul hat 36 Murmeln. Er bekommt noch 27 dazu. Wie viele Murmeln hat er jetzt?', answer: 63, emoji: '🔵' },
  { text: 'Auf dem Bauernhof sind 28 Hühner und 15 Enten. Wie viele Vögel sind es zusammen?', answer: 43, emoji: '🐔' },
  { text: 'Im Regal stehen 32 Bücher. Frau Müller stellt 19 neue dazu. Wie viele Bücher sind es jetzt?', answer: 51, emoji: '📚' },
  { text: 'Tim sammelt 45 Sticker. Seine Schwester gibt ihm 38 dazu. Wie viele hat er jetzt?', answer: 83, emoji: '⭐' },
  { text: 'Beim Sportfest laufen 23 Kinder mit und 18 springen weit. Wie viele Kinder machen mit?', answer: 41, emoji: '🏅' },
  { text: 'Im Schwimmbad sind 34 Jungen und 29 Mädchen. Wie viele Kinder sind es insgesamt?', answer: 63, emoji: '🏊' },
  { text: 'Leo sammelt 47 Muggelsteine. Er findet noch 25 mehr. Wie viele hat er jetzt?', answer: 72, emoji: '💎' },
  { text: 'Im Tierheim wohnen 16 Hunde und 24 Katzen. Wie viele Tiere sind das zusammen?', answer: 40, emoji: '🐾' },
  // Subtraction
  { text: 'Im Bus sitzen 34 Kinder. An der nächsten Haltestelle steigen 12 aus. Wie viele Kinder sind noch im Bus?', answer: 22, emoji: '🚌' },
  { text: 'Lisa hat 50 Gummibärchen. Sie verschenkt 23. Wie viele hat sie noch?', answer: 27, emoji: '🍬' },
  { text: 'In der Bücherei sind 67 Bücher. 29 werden ausgeliehen. Wie viele sind noch da?', answer: 38, emoji: '📖' },
  { text: 'Ein Zug hat 80 Plätze. 35 Plätze sind besetzt. Wie viele Plätze sind frei?', answer: 45, emoji: '🚆' },
  { text: 'Papa hat 72 Euro. Er kauft ein Spielzeug für 28 Euro. Wie viel Geld hat er noch?', answer: 44, emoji: '💶' },
  { text: 'Auf der Wiese stehen 56 Schafe. 19 laufen weg. Wie viele Schafe bleiben?', answer: 37, emoji: '🐑' },
  { text: 'Im Kino sind 90 Plätze. 54 sind besetzt. Wie viele sind noch frei?', answer: 36, emoji: '🎬' },
  { text: 'Im Supermarkt stehen 63 Einkaufswagen. 27 werden benutzt. Wie viele stehen noch da?', answer: 36, emoji: '🛒' },
  { text: 'Oma hat 75 Kekse gebacken. Die Familie isst 38 davon. Wie viele Kekse bleiben?', answer: 37, emoji: '🍪' },
  // Simple multiplication
  { text: 'Jedes Kind bekommt 5 Bonbons. Es sind 4 Kinder da. Wie viele Bonbons braucht man?', answer: 20, emoji: '🍭' },
  { text: 'In einem Korb liegen 3 Äpfel. Oma hat 6 Körbe. Wie viele Äpfel hat sie?', answer: 18, emoji: '🧺' },
  { text: 'Ein Tisch hat 4 Beine. Wie viele Beine haben 7 Tische zusammen?', answer: 28, emoji: '🪑' },
  { text: 'Jede Packung hat 8 Buntstifte. Lena kauft 3 Packungen. Wie viele Stifte hat sie?', answer: 24, emoji: '🖍️' },
  { text: 'Im Zoo leben 6 Affen in jedem Gehege. Es gibt 5 Gehege. Wie viele Affen gibt es?', answer: 30, emoji: '🐒' },
  { text: 'Ein Fahrrad hat 2 Räder. Wie viele Räder haben 9 Fahrräder?', answer: 18, emoji: '🚲' },
  { text: 'Eine Spinne hat 8 Beine. Wie viele Beine haben 3 Spinnen zusammen?', answer: 24, emoji: '🕷️' },
  { text: 'In jeder Schachtel sind 7 Schokoladen. Anna kauft 4 Schachteln. Wie viele Schokoladen hat sie?', answer: 28, emoji: '🍫' },
  { text: 'Jede Blume hat 5 Blütenblätter. Im Garten stehen 6 Blumen. Wie viele Blütenblätter gibt es?', answer: 30, emoji: '🌸' },
  // Simple division problems (as word problems)
  { text: '20 Kinder teilen sich gleich auf 4 Tische auf. Wie viele Kinder sitzen an jedem Tisch?', answer: 5, emoji: '🏫' },
  { text: 'Mama verteilt 18 Erdbeeren gleichmäßig auf 3 Teller. Wie viele Erdbeeren sind auf jedem Teller?', answer: 6, emoji: '🍓' },
  { text: 'Papa hat 24 Plätzchen. Er legt sie in Gruppen zu je 6. Wie viele Gruppen gibt es?', answer: 4, emoji: '🍪' },
];

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
    if (candidate !== correct) set.add(candidate);
  }
  return shuffle(Array.from(set));
}

/** Build a balanced set of exercises for a 5-minute session */
function buildSession(): ExerciseData[] {
  // Pick 12 random word problems from the pool
  const picked = shuffle(WORD_PROBLEM_POOL).slice(0, 12);
  const wordProblems: WordProblemData[] = picked.map((p) => ({
    type: 'wordproblem',
    text: p.text,
    emoji: p.emoji,
    correctAnswer: p.answer,
    choices: generateChoices(
      p.answer,
      Math.max(1, p.answer - 10),
      Math.min(100, p.answer + 10),
    ),
  }));

  // 2 drawing exercises with random digits
  const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 2);
  const drawings: DrawingData[] = digits.map((d) => ({ type: 'drawing', digit: d }));

  // Interleave: 6 word problems, 1 drawing, …
  const result: ExerciseData[] = [];
  let wi = 0;
  let di = 0;
  while (wi < wordProblems.length || di < drawings.length) {
    for (let k = 0; k < 6 && wi < wordProblems.length; k++) result.push(wordProblems[wi++]);
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
            {exercise.type === 'wordproblem' ? (
              <span className="bg-pink-100 text-pink-700 text-lg md:text-xl font-black px-4 md:px-6 py-2 rounded-full uppercase">
                📖 SACHAUFGABEN
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
            {exercise.type === 'wordproblem' ? (
              <WordProblem2Exercise
                key={currentIdx}
                text={exercise.text}
                emoji={exercise.emoji}
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
