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
}

const CLASS_1_EXERCISES: ExerciseCard[] = [
  {
    id: '1/addition',
    title: 'ADDITION',
    description: 'Zahlen bis 10 addieren',
    emoji: '➕',
    color: 'bg-purple-400',
    textColor: 'text-purple-700',
    available: true,
  },
  {
    id: '1/subtraction',
    title: 'SUBTRAKTION',
    description: 'Zahlen bis 10 subtrahieren',
    emoji: '➖',
    color: 'bg-blue-400',
    textColor: 'text-blue-700',
    available: true,
  },
  {
    id: '1/numbers',
    title: 'ZAHLEN',
    description: 'Zahlen kennenlernen & schreiben',
    emoji: '🔢',
    color: 'bg-green-400',
    textColor: 'text-green-700',
    available: true,
  },
  {
    id: '1/comparison',
    title: 'VERGLEICHEN',
    description: 'Größer, kleiner, gleich',
    emoji: '⚖️',
    color: 'bg-orange-400',
    textColor: 'text-orange-700',
    available: true,
  },
  {
    id: '1/multiplication',
    title: 'MALNEHMEN',
    description: 'Einfache Multiplikation',
    emoji: '✖️',
    color: 'bg-pink-400',
    textColor: 'text-pink-700',
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
    color: 'bg-rose-400',
    textColor: 'text-rose-700',
    available: true,
  },
];

import { useTheme } from '../theme/ThemeContext';
import ThemePicker from './ThemePicker';

// ...existing code...

export default function HomeScreen({ onSelectExercise }: Props) {
  const { theme } = useTheme();

  return (
    <div className={`tablet-screen flex h-full flex-col items-center p-3 bg-gradient-to-b ${theme.homeBg}`}>
      {/* Header */}
      <div className="text-5xl mb-1 mt-1">{theme.emoji}</div>
      <h1 className="text-4xl md:text-5xl font-black text-purple-700 mb-1 uppercase leading-tight drop-shadow-md text-center">
        MATHE ÜBEN!
      </h1>
      <p className="text-xl md:text-2xl font-black text-blue-600 mb-2 uppercase">
        WAS MÖCHTEST DU ÜBEN?
      </p>

      {/* Theme picker */}
      <div className="w-full max-w-4xl mb-2">
        <ThemePicker />
      </div>

      {/* Class badge */}
      <div className={`flex items-center gap-2 ${theme.accentBg} rounded-2xl px-6 py-2 shadow-md mb-2`}>
        <span className="text-3xl">🎒</span>
        <span className="text-xl font-black text-white uppercase">1. KLASSE</span>
      </div>

      {/* Exercise cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 w-full max-w-4xl mb-2">
        {CLASS_1_EXERCISES.map((ex) => (
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
