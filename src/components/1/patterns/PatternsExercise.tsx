import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  sequence: number[];
  missingIdx: number;
  correctAnswer: number;
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

export default function PatternsExercise({
  sequence,
  missingIdx,
  correctAnswer,
  choices,
  onAnswer,
}: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);

  const feedbackText =
    selected === null
      ? ' '
      : selected === correctAnswer
        ? '⭐ SUPER! RICHTIG! 🎉'
        : '❌ NICHT GANZ... 💪';

  const handleChoice = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    const isCorrect = value === correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
    }, 900);
  };

  const getButtonClass = (value: number) => {
    const base =
      'flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) return base + theme.buttonIdle;
    if (value === correctAnswer) return base + 'bg-green-400 text-white scale-110';
    if (value === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Instruction */}
      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        🔍 WELCHE ZAHL FEHLT?
      </p>

      {/* Sequence display */}
      <div className="bg-white rounded-3xl shadow-lg px-4 md:px-6 py-4 flex items-center gap-2 md:gap-3 flex-wrap justify-center">
        {sequence.map((num, idx) => (
          <div key={idx} className="flex items-center gap-2 md:gap-3">
            {idx > 0 && (
              <span className="text-2xl md:text-3xl font-black text-gray-300">→</span>
            )}
            {idx === missingIdx ? (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-4 border-dashed border-orange-400 bg-orange-50 flex items-center justify-center">
                <span className="text-3xl md:text-4xl">❓</span>
              </div>
            ) : (
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-purple-100 flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-black text-purple-700">{num}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-4 md:gap-5">
        {choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            <span className="text-5xl md:text-6xl">{value}</span>
          </button>
        ))}
      </div>

      <div
        className={`min-h-10 md:min-h-12 text-2xl md:text-3xl font-black whitespace-nowrap ${
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
