import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  readonly mode: 'double' | 'half';
  readonly inputNumber: number;
  readonly correctAnswer: number;
  readonly choices: number[];
  readonly onAnswer: (correct: boolean) => void;
}

export default function DoublingExercise({ mode, inputNumber, correctAnswer, choices, onAnswer }: Props) {
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
      'flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-3xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) return base + theme.buttonIdle;
    if (value === correctAnswer) return base + 'bg-green-400 text-white scale-110';
    if (value === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  const isDouble = mode === 'double';

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Title */}
      <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase text-center">
        {isDouble ? '🪞 VERDOPPLE DIE ZAHL!' : '✂️ HALBIERE DIE ZAHL!'}
      </p>

      {/* Number display */}
      <div className="bg-white rounded-3xl shadow-lg px-10 py-6 flex items-center gap-4">
        <span className="text-7xl md:text-8xl font-black text-rose-700">{inputNumber}</span>
        <span className="text-5xl md:text-6xl font-black text-gray-400">→</span>
        <span className="text-7xl md:text-8xl font-black text-orange-400">?</span>
      </div>

      {/* Visual */}
      <div className="flex flex-col items-center gap-2">
        {isDouble ? (
          <div className="flex gap-4 items-center">
            <div className={`${theme.accentLight} border-2 ${theme.accentBorder} rounded-2xl px-3 py-2 flex gap-1 flex-wrap justify-center`} style={{ maxWidth: 140 }}>
              {Array.from({ length: inputNumber }, (_, i) => (
                <span key={i} className="text-2xl md:text-3xl select-none">{emoji}</span>
              ))}
            </div>
            <span className={`text-4xl font-black ${theme.accentText}`}>+</span>
            <div className={`${theme.accentLight} border-2 ${theme.accentBorder} rounded-2xl px-3 py-2 flex gap-1 flex-wrap justify-center`} style={{ maxWidth: 140 }}>
              {Array.from({ length: inputNumber }, (_, i) => (
                <span key={i} className="text-2xl md:text-3xl select-none">{emoji}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex gap-1 flex-wrap justify-center max-w-xs">
            {Array.from({ length: inputNumber }, (_, i) => (
              <span
                key={i}
                className={`text-3xl md:text-4xl select-none transition-all ${
                  i >= correctAnswer ? 'opacity-25 line-through' : ''
                }`}
              >
                {emoji}
              </span>
            ))}
          </div>
        )}
        <p className="text-base md:text-lg font-black text-gray-400 uppercase">
          {isDouble
            ? `${inputNumber} + ${inputNumber} = ?`
            : `${inputNumber} GETEILT DURCH 2 = ?`
          }
        </p>
      </div>

      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        TIPPE DIE RICHTIGE ANTWORT! 👇
      </p>

      <div className="grid grid-cols-2 gap-5">
        {choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            <span className="text-7xl md:text-8xl">{value}</span>
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

