import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  exerciseType: 'count' | 'missing';
  num: number;
  sequence?: number[]; // for 'missing' type: full sequence with the number
  missingIdx?: number; // index of missing number in sequence
  emojiIdx?: number;   // for 'count' type
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

export default function NumberRange20Exercise({ exerciseType, num, sequence, missingIdx, emojiIdx, choices, onAnswer }: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const feedbackText = selected === null ? ' ' : selected === num ? 'SUPER! RICHTIG!' : 'NICHT GANZ...';

  const handleChoice = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    setTimeout(() => { onAnswer(value === num); setSelected(null); }, 900);
  };

  const getButtonClass = (value: number) => {
    const base = 'flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) return base + theme.buttonIdle;
    if (value === num) return base + 'bg-green-400 text-white scale-110';
    if (value === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {exerciseType === 'count' ? (
        <>
          <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase text-center">
            WIE VIELE {theme.itemLabels[(emojiIdx ?? 0) % 8].toUpperCase()} SIEHST DU?
          </p>
          <div className="bg-white rounded-3xl shadow-lg px-6 py-4 flex flex-wrap justify-center gap-1 max-w-sm">
            {Array.from({ length: num }, (_, i) => (
              <span key={i} className="text-2xl select-none">{theme.items[(emojiIdx ?? 0) % 8]}</span>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase text-center">
            WELCHE ZAHL FEHLT?
          </p>
          <div className="bg-white rounded-3xl shadow-lg px-4 py-4 flex flex-wrap justify-center gap-2 max-w-md">
            {(sequence ?? []).map((n, i) => (
              <div
                key={i}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-black text-lg md:text-xl shadow ${
                  i === missingIdx
                    ? 'bg-yellow-300 text-yellow-900 border-2 border-yellow-500'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                {i === missingIdx ? '?' : n}
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        TIPPE DIE RICHTIGE ZAHL!
      </p>

      <div className="grid grid-cols-2 gap-4">
        {choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            <span className="text-5xl md:text-6xl">{value}</span>
          </button>
        ))}
      </div>

      <div className={`min-h-12 md:min-h-14 text-3xl md:text-4xl font-black whitespace-nowrap ${
        selected === null ? 'invisible' : selected === num ? 'text-green-500 animate-bounce-in' : 'text-red-500 animate-bounce-in'
      }`}>
        {feedbackText}
      </div>
    </div>
  );
}
