import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  operation: '+' | '-';
  num1: number;
  num2: number;
  correctAnswer: number;
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

export default function PlusMinusExercise({ operation, num1, num2, correctAnswer, choices, onAnswer }: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const feedbackText = selected === null ? ' ' : selected === correctAnswer ? 'SUPER! RICHTIG!' : 'NICHT GANZ...';

  const handleChoice = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    setTimeout(() => { onAnswer(value === correctAnswer); setSelected(null); }, 900);
  };

  const getButtonClass = (value: number) => {
    const base = 'flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) return base + theme.buttonIdle;
    if (value === correctAnswer) return base + 'bg-green-400 text-white scale-110';
    if (value === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase text-center">
        RECHNE AUS!
      </p>

      {/* Problem display */}
      <div className="bg-white rounded-3xl shadow-lg px-8 py-5 flex items-center gap-4">
        <span className="text-6xl md:text-7xl font-black text-purple-700">{num1}</span>
        <span className={`text-5xl md:text-6xl font-black ${operation === '+' ? 'text-green-500' : 'text-red-500'}`}>{operation}</span>
        <span className="text-6xl md:text-7xl font-black text-blue-700">{num2}</span>
        <span className="text-5xl md:text-6xl font-black text-gray-400">=</span>
        <span className="text-6xl md:text-7xl font-black text-orange-400">?</span>
      </div>

      {/* Visual aid */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        <div className="flex flex-wrap gap-1 justify-center max-w-[180px]">
          {Array.from({ length: num1 }, (_, i) => (
            <span key={`a${i}`} className="text-xl select-none">{theme.items[0]}</span>
          ))}
        </div>
        {operation === '+' ? (
          <>
            <span className="text-3xl font-black text-green-500">+</span>
            <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
              {Array.from({ length: num2 }, (_, i) => (
                <span key={`b${i}`} className="text-xl select-none">{theme.items[1]}</span>
              ))}
            </div>
          </>
        ) : (
          <>
            <span className="text-3xl font-black text-red-500">−</span>
            <div className="flex flex-wrap gap-1 justify-center max-w-[120px]">
              {Array.from({ length: num2 }, (_, i) => (
                <span key={`b${i}`} className="text-xl select-none opacity-30 line-through">{theme.items[0]}</span>
              ))}
            </div>
          </>
        )}
      </div>

      <p className="text-xl md:text-2xl font-black text-gray-600 uppercase">TIPPE DIE RICHTIGE ZAHL!</p>

      <div className="grid grid-cols-2 gap-4">
        {choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            <span className="text-5xl md:text-6xl">{value}</span>
          </button>
        ))}
      </div>

      <div className={`min-h-12 text-3xl md:text-4xl font-black ${selected === null ? 'invisible' : selected === correctAnswer ? 'text-green-500 animate-bounce-in' : 'text-red-500 animate-bounce-in'}`}>
        {feedbackText}
      </div>
    </div>
  );
}
