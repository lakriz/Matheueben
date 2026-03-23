import { useState, useEffect, useCallback } from 'react';
import ProgressBar from './ProgressBar';
import WordProblem3Exercise from './WordProblem3Exercise';
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
  { text: 'In der Schule gibt es 345 Schüler. 128 sind in der Mensa. Wie viele sind nicht in der Mensa?', answer: 217, emoji: '🏫' },
  { text: 'Ein Bauer hat 8 Reihen mit je 12 Apfelbäumen. Wie viele Bäume hat er?', answer: 96, emoji: '🌳' },
  { text: 'Anna hat 450 Sticker. Sie verschenkt 175. Wie viele hat sie noch?', answer: 275, emoji: '⭐' },
  { text: 'In einem Zug sitzen 236 Fahrgäste. An der nächsten Haltestelle steigen 148 zu. Wie viele sind jetzt im Zug?', answer: 384, emoji: '🚂' },
  { text: 'Im Sportverein sind 6 Mannschaften mit je 11 Spielern. Wie viele Spieler sind es insgesamt?', answer: 66, emoji: '⚽' },
  { text: 'Ein Buch hat 248 Seiten. Tom hat schon 163 gelesen. Wie viele Seiten fehlen noch?', answer: 85, emoji: '📚' },
  { text: 'In der Bäckerei werden 72 Brötchen gleichmäßig auf 8 Körbe verteilt. Wie viele sind in jedem Korb?', answer: 9, emoji: '🥐' },
  { text: 'Mama kauft 3 Packungen mit je 125 Bonbons. Wie viele Bonbons sind es insgesamt?', answer: 375, emoji: '🍬' },
  { text: 'Auf dem Schulhof spielen 189 Kinder. 94 gehen rein. Wie viele bleiben draußen?', answer: 95, emoji: '🏃' },
  { text: 'Eine Schachtel hat 144 Buntstifte. Sie werden auf 12 Kinder verteilt. Wie viele bekommt jedes Kind?', answer: 12, emoji: '🖍️' },
  { text: 'Der Zoo hat 267 Tiere. 134 davon sind Vögel. Wie viele sind keine Vögel?', answer: 133, emoji: '🦁' },
  { text: 'Im Kino sind 9 Reihen mit je 15 Sitzen. Wie viele Sitze gibt es?', answer: 135, emoji: '🎬' },
  { text: 'Lisa spart 478 Euro. Sie kauft ein Fahrrad für 289 Euro. Wie viel bleibt übrig?', answer: 189, emoji: '🚲' },
  { text: 'Ein Parkplatz hat 350 Plätze. 178 sind belegt. Wie viele sind frei?', answer: 172, emoji: '🚗' },
  { text: 'Im Garten wachsen 7 Reihen mit je 9 Sonnenblumen. Wie viele sind es?', answer: 63, emoji: '🌻' },
  { text: 'Die Bibliothek bekommt 264 neue Bücher und hat schon 589. Wie viele sind es jetzt?', answer: 853, emoji: '📖' },
  { text: 'Ein Schwimmbad hat 108 Besucher. Gleichmäßig auf 9 Bahnen verteilt. Wie viele pro Bahn?', answer: 12, emoji: '🏊' },
  { text: 'Auf dem Markt kauft Opa 5 Körbe Äpfel mit je 18 Äpfeln. Wie viele Äpfel hat er?', answer: 90, emoji: '🍎' },
  { text: 'In der Klasse sammeln 24 Kinder jeweils 4 Euro. Wie viel Geld haben sie zusammen?', answer: 96, emoji: '💰' },
  { text: 'Ein Flugzeug fliegt 756 Kilometer. Nach 398 Kilometern macht es Pause. Wie weit noch?', answer: 358, emoji: '✈️' },
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
  const picked = shuffle(WORD_PROBLEM_POOL).slice(0, 12);
  const wordProblems: WordProblemData[] = picked.map((p) => ({
    type: 'wordproblem',
    text: p.text,
    emoji: p.emoji,
    correctAnswer: p.answer,
    choices: generateChoices(
      p.answer,
      Math.max(1, p.answer - 15),
      p.answer + 15,
    ),
  }));

  const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  const drawings: DrawingData[] = digits.map((d) => ({ type: 'drawing', digit: d }));

  const result: ExerciseData[] = [];
  let wi = 0;
  let di = 0;
  while (wi < wordProblems.length || di < drawings.length) {
    if (wi < wordProblems.length) result.push(wordProblems[wi++]);
    if (wi < wordProblems.length) result.push(wordProblems[wi++]);
    if (wi < wordProblems.length) result.push(wordProblems[wi++]);
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

        <div className="tablet-session-main flex-1 flex items-center justify-center p-1 md:p-2">
          <div className="exercise-scale-wrap">
            {exercise.type === 'wordproblem' ? (
              <WordProblem3Exercise
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
