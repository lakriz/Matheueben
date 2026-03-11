import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  readonly num1: number;
  readonly num2: number;
  readonly correctAnswer: number;
  readonly choices: number[];
  readonly onAnswer: (correct: boolean) => void;
}

export default function MultiplicationExercise({ num1, num2, correctAnswer, choices, onAnswer }: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const [emoji] = useState(() => theme.items[Math.floor(Math.random() * theme.items.length)]);

  const feedbackText = selected === null
    ? ' '
    : selected === correctAnswer
      ? '⭐ SUPER! RICHTIG! 🎉'
      : '❌ NICHT GANZ... 💪';

  const handleChoice = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    setTimeout(() => { onAnswer(value === correctAnswer); setSelected(null); }, 900);
  };

  const getButtonClass = (value: number) => {
    const base =
      'flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-3xl text-5xl md:text-6xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) return base + theme.buttonIdle;
    if (value === correctAnswer) return base + 'bg-green-400 text-white scale-110';
    if (value === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  const additionStr = Array.from({ length: num1 }, () => num2).join(' + ');

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Problem display */}
      <div className="bg-white rounded-3xl shadow-lg px-8 py-6 flex items-center gap-4">
        <span className="text-7xl md:text-8xl font-black text-pink-700">{num1}</span>
        <span className="text-6xl md:text-7xl font-black text-pink-500">×</span>
        <span className="text-7xl md:text-8xl font-black text-pink-700">{num2}</span>
        <span className="text-6xl md:text-7xl font-black text-gray-400">=</span>
        <span className="text-7xl md:text-8xl font-black text-orange-400">?</span>
      </div>

      {/* Visual: groups of objects + addition hint */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2 flex-wrap justify-center">
          {Array.from({ length: num1 }, (_, g) => (
            <div key={g} className={`${theme.accentLight} border-2 ${theme.accentBorder} rounded-2xl px-3 py-2 flex gap-1`}>
              {Array.from({ length: num2 }, (_, j) => (
                <span key={j} className="text-2xl md:text-3xl select-none">{emoji}</span>
              ))}
            </div>
          ))}
        </div>
        <p className="text-base md:text-lg font-black text-gray-400 uppercase">
          {num1} MAL {num2} → {additionStr}
        </p>
      </div>

      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        TIPPE DIE RICHTIGE ANTWORT! 👇
      </p>

      <div className="grid grid-cols-2 gap-5">
        {choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            {value}
          </button>
        ))}
      </div>

      <div
        className={`min-h-12 md:min-h-14 text-3xl md:text-4xl font-black whitespace-nowrap ${
          selected === null
            ? 'invisible'
            : selected === correctAnswer
              ? 'text-green-500 animate-bounce-in'
              : 'text-red-500 animate-bounce-in'
        }`}
      >
        {feedbackText}
      </div>
    </div>
  );
}

