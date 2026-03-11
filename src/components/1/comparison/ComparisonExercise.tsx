import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

type Symbol = '>' | '<' | '=';

interface Props {
  num1: number;
  num2: number;
  onAnswer: (correct: boolean) => void;
}

function getCorrect(num1: number, num2: number): Symbol {
  if (num1 > num2) return '>';
  if (num1 < num2) return '<';
  return '=';
}

const SYMBOLS: Symbol[] = ['<', '=', '>'];

const SYMBOL_LABELS: Record<Symbol, string> = {
  '>': 'GRÖSSER',
  '<': 'KLEINER',
  '=': 'GLEICH',
};

export default function ComparisonExercise({ num1, num2, onAnswer }: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<Symbol | null>(null);
  const correct = getCorrect(num1, num2);
  const feedbackText = selected === null
    ? ' '
    : selected === correct
      ? 'SUPER! RICHTIG!'
      : 'NICHT GANZ...';

  const handleChoice = (sym: Symbol) => {
    if (selected !== null) return;
    setSelected(sym);
    setTimeout(() => { onAnswer(sym === correct); setSelected(null); }, 900);
  };

  const getButtonClass = (sym: Symbol) => {
    const base =
      'flex flex-col items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-3xl font-black shadow-lg transition-all duration-200 select-none gap-1 ';
    if (selected === null) return base + theme.buttonIdle;
    if (sym === correct) return base + 'bg-green-400 text-white scale-110';
    if (sym === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase text-center">
        VERGLEICHE DIE ZAHLEN!
      </p>

      {/* Numbers display */}
      <div className="bg-white rounded-3xl shadow-lg px-10 py-8 flex items-center gap-6">
        <span className="text-7xl md:text-8xl font-black text-purple-700">{num1}</span>
        <span className="text-6xl md:text-7xl font-black text-orange-400">?</span>
        <span className="text-7xl md:text-8xl font-black text-blue-700">{num2}</span>
      </div>

      {/* Dot visualisation */}
      <div className="flex items-center gap-6">
        <div className="flex flex-wrap gap-1 justify-center" style={{ maxWidth: 120 }}>
          {Array.from({ length: num1 }, (_, i) => (
            <span key={i} className="text-2xl select-none">🔴</span>
          ))}
        </div>
        <span className="text-3xl font-black text-gray-400">vs</span>
        <div className="flex flex-wrap gap-1 justify-center" style={{ maxWidth: 120 }}>
          {Array.from({ length: num2 }, (_, i) => (
            <span key={i} className="text-2xl select-none">🔵</span>
          ))}
        </div>
      </div>

      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        WELCHES ZEICHEN PASST?
      </p>

      {/* Symbol choices - 3 buttons in a row */}
      <div className="flex gap-5 flex-wrap justify-center">
        {SYMBOLS.map((sym) => (
          <button key={sym} onClick={() => handleChoice(sym)} className={getButtonClass(sym)}>
            <span className="text-5xl md:text-6xl">{sym}</span>
            <span className="text-sm md:text-base font-black uppercase">{SYMBOL_LABELS[sym]}</span>
          </button>
        ))}
      </div>

      <div
        className={`min-h-12 md:min-h-14 text-3xl md:text-4xl font-black whitespace-nowrap ${
          selected === null
            ? 'invisible'
            : selected === correct
              ? 'text-green-500 animate-bounce-in'
              : 'text-red-500 animate-bounce-in'
        }`}
      >
        {feedbackText}
      </div>
    </div>
  );
}
