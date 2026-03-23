import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  question: string;
  correctAnswer: number;
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

export default function NumberRange100Exercise({
  question,
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
    if (selected !== null) return; // prevent multiple clicks
    setSelected(value);
    const isCorrect = value === correctAnswer;
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
    }, 900);
  };

  const getButtonClass = (value: number) => {
    const base =
      'flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-3xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) {
      return base + theme.buttonIdle;
    }
    if (value === correctAnswer) {
      return base + 'bg-green-400 text-white scale-110';
    }
    if (value === selected) {
      return base + 'bg-red-400 text-white animate-wiggle';
    }
    return base + 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4">
      {/* Question display */}
      <div className="bg-white rounded-3xl shadow-lg px-10 py-8 flex items-center justify-center">
        <span className="text-4xl md:text-5xl font-black text-indigo-700 text-center">
          {question}
        </span>
      </div>

      {/* Instruction */}
      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        TIPPE DIE RICHTIGE ANTWORT! 👇
      </p>

      {/* Answer choices */}
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
