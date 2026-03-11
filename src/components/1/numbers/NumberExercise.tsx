import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  count: number;
  emoji: string;
  label: string;
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

export default function NumberExercise({ count, emoji, label, choices, onAnswer }: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const feedbackText = selected === null
    ? ' '
    : selected === count
      ? 'SUPER! RICHTIG!'
      : 'NICHT GANZ... ';

  const handleChoice = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    setTimeout(() => { onAnswer(value === count); setSelected(null); }, 900);
  };

  const getButtonClass = (value: number) => {
    const base =
      'flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-3xl text-6xl md:text-7xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) return base + theme.buttonIdle;
    if (value === count) return base + 'bg-green-400 text-white scale-110';
    if (value === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase text-center">
        WIE VIELE {label.toUpperCase()} SIEHST DU?
      </p>

      <div className="bg-white rounded-3xl shadow-lg px-8 py-6 flex flex-wrap justify-center gap-2 max-w-sm">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="text-4xl select-none">{emoji}</span>
        ))}
      </div>

      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        TIPPE DIE RICHTIGE ZAHL!
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
            : selected === count
              ? 'text-green-500 animate-bounce-in'
              : 'text-red-500 animate-bounce-in'
        }`}
      >
        {feedbackText}
      </div>
    </div>
  );
}
