import { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../auth/AuthContext';

interface ExerciseCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
  textColor: string;
  available: boolean;
}

interface Props {
  readonly onSelectExercise: (exerciseId: string) => void;
  readonly onProfile: () => void;
}

const CLASS_1_EXERCISES: ExerciseCard[] = [
  {
    id: '1/numberrange20',
    title: 'ZAHLENRAUM',
    description: 'Zahlen bis 10 und 20',
    emoji: '🔟',
    color: 'bg-indigo-400',
    textColor: 'text-indigo-700',
    available: true,
  },
  {
    id: '1/plusminus',
    title: 'PLUS & MINUS',
    description: 'Addieren und Subtrahieren',
    emoji: '➕',
    color: 'bg-purple-400',
    textColor: 'text-purple-700',
    available: true,
  },
  {
    id: '1/numbers',
    title: 'ZÄHLEN',
    description: 'Zählen und Mengen erkennen',
    emoji: '🧮',
    color: 'bg-green-400',
    textColor: 'text-green-700',
    available: true,
  },
  {
    id: '1/comparison',
    title: 'VERGLEICHEN',
    description: 'Zahlen vergleichen (>, <)',
    emoji: '⚖️',
    color: 'bg-orange-400',
    textColor: 'text-orange-700',
    available: true,
  },
  {
    id: '1/wordproblems',
    title: 'SACHAUFGABEN',
    description: 'Einfache Sachaufgaben lösen',
    emoji: '📖',
    color: 'bg-pink-400',
    textColor: 'text-pink-700',
    available: true,
  },
  {
    id: '1/addition',
    title: 'ADDITION',
    description: 'Zahlen bis 10 addieren',
    emoji: '🔢',
    color: 'bg-blue-400',
    textColor: 'text-blue-700',
    available: true,
  },
  {
    id: '1/subtraction',
    title: 'SUBTRAKTION',
    description: 'Zahlen bis 10 subtrahieren',
    emoji: '➖',
    color: 'bg-cyan-400',
    textColor: 'text-cyan-700',
    available: true,
  },
  {
    id: '1/multiplication',
    title: 'MALNEHMEN',
    description: 'Einfache Multiplikation',
    emoji: '✖️',
    color: 'bg-rose-400',
    textColor: 'text-rose-700',
    available: true,
  },
  {
    id: '1/complement',
    title: 'ERGÄNZEN',
    description: 'Finde die fehlende Zahl',
    emoji: '🧩',
    color: 'bg-teal-400',
    textColor: 'text-teal-700',
    available: true,
  },
  {
    id: '1/doubling',
    title: 'DOPPELT & HALB',
    description: 'Verdoppeln und Halbieren',
    emoji: '🪞',
    color: 'bg-amber-400',
    textColor: 'text-amber-700',
    available: true,
  },
  {
    id: '1/patterns',
    title: 'ZAHLEN-MUSTER',
    description: 'Fehlende Zahl im Muster finden',
    emoji: '🔢',
    color: 'bg-violet-400',
    textColor: 'text-violet-700',
    available: true,
  },
];

const CLASS_2_EXERCISES: ExerciseCard[] = [
  {
    id: '2/addition100',
    title: 'PLUS BIS 100',
    description: 'Addieren im Zahlenraum bis 100',
    emoji: '➕',
    color: 'bg-blue-400',
    textColor: 'text-blue-700',
    available: true,
  },
  {
    id: '2/subtraction100',
    title: 'MINUS BIS 100',
    description: 'Subtrahieren im Zahlenraum bis 100',
    emoji: '➖',
    color: 'bg-cyan-400',
    textColor: 'text-cyan-700',
    available: true,
  },
  {
    id: '2/einmaleins',
    title: 'EINMALEINS',
    description: 'Das kleine Einmaleins üben',
    emoji: '✖️',
    color: 'bg-rose-400',
    textColor: 'text-rose-700',
    available: true,
  },
  {
    id: '2/division',
    title: 'TEILEN',
    description: 'Einfaches Teilen ohne Rest',
    emoji: '➗',
    color: 'bg-emerald-400',
    textColor: 'text-emerald-700',
    available: true,
  },
  {
    id: '2/numberrange100',
    title: 'ZAHLENRAUM 100',
    description: 'Zahlen bis 100 kennenlernen',
    emoji: '🔟',
    color: 'bg-indigo-400',
    textColor: 'text-indigo-700',
    available: true,
  },
  {
    id: '2/wordproblems',
    title: 'SACHAUFGABEN',
    description: 'Sachaufgaben bis 100',
    emoji: '📖',
    color: 'bg-pink-400',
    textColor: 'text-pink-700',
    available: true,
  },
  {
    id: '2/missingop',
    title: 'GEHEIMZAHL',
    description: 'Finde die fehlende Zahl',
    emoji: '🔍',
    color: 'bg-violet-400',
    textColor: 'text-violet-700',
    available: true,
  },
];

const CLASS_3_EXERCISES: ExerciseCard[] = [
  {
    id: '3/addition1000',
    title: 'PLUS BIS 1000',
    description: 'Addieren im Zahlenraum bis 1000',
    emoji: '➕',
    color: 'bg-blue-400',
    textColor: 'text-blue-700',
    available: true,
  },
  {
    id: '3/subtraction1000',
    title: 'MINUS BIS 1000',
    description: 'Subtrahieren im Zahlenraum bis 1000',
    emoji: '➖',
    color: 'bg-cyan-400',
    textColor: 'text-cyan-700',
    available: true,
  },
  {
    id: '3/multiplication',
    title: 'MULTIPLIZIEREN',
    description: 'Größere Zahlen multiplizieren',
    emoji: '✖️',
    color: 'bg-rose-400',
    textColor: 'text-rose-700',
    available: true,
  },
  {
    id: '3/division',
    title: 'DIVIDIEREN',
    description: 'Division bis 100',
    emoji: '➗',
    color: 'bg-emerald-400',
    textColor: 'text-emerald-700',
    available: true,
  },
  {
    id: '3/numberrange1000',
    title: 'ZAHLENRAUM 1000',
    description: 'Zahlen bis 1000 kennenlernen',
    emoji: '🔢',
    color: 'bg-indigo-400',
    textColor: 'text-indigo-700',
    available: true,
  },
  {
    id: '3/wordproblems',
    title: 'SACHAUFGABEN',
    description: 'Sachaufgaben bis 1000',
    emoji: '📖',
    color: 'bg-pink-400',
    textColor: 'text-pink-700',
    available: true,
  },
];

type GradeId = 1 | 2 | 3;

const GRADES: { id: GradeId; label: string; exercises: ExerciseCard[] }[] = [
  { id: 1, label: '1. KLASSE', exercises: CLASS_1_EXERCISES },
  { id: 2, label: '2. KLASSE', exercises: CLASS_2_EXERCISES },
  { id: 3, label: '3. KLASSE', exercises: CLASS_3_EXERCISES },
];

export default function HomeScreen({ onSelectExercise, onProfile }: Props) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [selectedGrade, setSelectedGrade] = useState<GradeId>(1);

  const currentGrade = GRADES.find((g) => g.id === selectedGrade)!;

  return (
    <div className={`tablet-screen flex h-full flex-col items-center p-3 bg-gradient-to-b ${theme.homeBg}`}>
      {/* Header row with profile button */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-1 mt-1">
        <div className="w-12" /> {/* spacer */}
        <div className="text-5xl">{theme.emoji}</div>
        <button
          onClick={onProfile}
          className={`w-12 h-12 active:scale-95 rounded-2xl flex items-center justify-center text-2xl shadow-md transition-all border-2 ${
            user
              ? `${theme.accentBg} border-transparent`
              : 'bg-white/80 hover:bg-white border-white/60'
          }`}
          title={user ? 'Mein Profil' : 'Anmelden'}
        >
          👤
        </button>
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-purple-700 mb-1 uppercase leading-tight drop-shadow-md text-center">
        MATHE ÜBEN!
      </h1>
      <p className="text-xl md:text-2xl font-black text-blue-600 mb-2 uppercase">
        WAS MÖCHTEST DU ÜBEN?
      </p>

      {/* Class tabs */}
      <div className="flex gap-2 mb-2">
        {GRADES.map((grade) => (
          <button
            key={grade.id}
            onClick={() => setSelectedGrade(grade.id)}
            className={`flex items-center gap-2 rounded-2xl px-5 py-2 shadow-md transition-all font-black text-lg uppercase ${
              selectedGrade === grade.id
                ? `${theme.accentBg} text-white scale-105`
                : 'bg-white/80 text-gray-600 hover:bg-white hover:scale-105'
            }`}
          >
            <span className="text-2xl">🎒</span>
            {grade.label}
          </button>
        ))}
      </div>

      {/* Exercise cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 w-full max-w-4xl mb-2">
        {currentGrade.exercises.map((ex) => (
          <button
            key={ex.id}
            onClick={() => ex.available && onSelectExercise(ex.id)}
            disabled={!ex.available}
            className={`
              relative flex flex-col items-center gap-1.5 rounded-2xl p-3 md:p-4 shadow-lg
              transition-all text-center
              ${ex.available
                ? 'bg-white hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-gray-100 opacity-60 cursor-not-allowed'}
            `}
          >
            {!ex.available && (
              <span className="absolute top-2 right-3 text-xs font-black text-gray-400 uppercase bg-gray-200 rounded-full px-2 py-0.5">
                BALD ✨
              </span>
            )}
            <div
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-md
                ${ex.available ? ex.color : 'bg-gray-300'}`}
            >
              {ex.emoji}
            </div>
            <div>
              <p className={`text-base md:text-lg font-black uppercase ${ex.available ? ex.textColor : 'text-gray-400'}`}>
                {ex.title}
              </p>
              <p className="text-xs md:text-sm font-bold text-gray-500 mt-0.5">{ex.description}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Decorative theme items */}
      <div className="tablet-compact-hide flex gap-2 text-2xl mt-auto">
        {theme.decorations.map((dec, i) => (
          <span key={`dec-${i}`} style={{ animationDelay: `${i * 0.1}s` }} className="animate-bounce">
            {dec}
          </span>
        ))}
      </div>
    </div>
  );
}
