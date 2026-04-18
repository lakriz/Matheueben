import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

export type MissingOpType = 'addMissing1' | 'addMissing2' | 'subMissing1' | 'subMissing2';

interface Props {
  opType: MissingOpType;
  known1: number;
  known2: number;
  correctAnswer: number;
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

function getEquationParts(opType: MissingOpType, known1: number, known2: number) {
  // Returns the parts of the equation as strings for display
  // addMissing1: ? + known2 = known1+known2  →  known1 is result, known2 is second addend
  // addMissing2: known1 + ? = result
  // subMissing1: ? - known2 = result         →  known1 is minuend, known2 is result
  // subMissing2: known1 - ? = result
  switch (opType) {
    case 'addMissing1':
      return { left: '☐', op: '+', right: String(known2), eq: '=', result: String(known1 + known2) };
    case 'addMissing2':
      return { left: String(known1), op: '+', right: '☐', eq: '=', result: String(known1 + known2) };
    case 'subMissing1':
      return { left: '☐', op: '−', right: String(known2), eq: '=', result: String(known1 - known2) };
    case 'subMissing2':
      return { left: String(known1), op: '−', right: '☐', eq: '=', result: String(known1 - known2) };
  }
}

export default function MissingOpExercise({
  opType,
  known1,
  known2,
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

  const parts = getEquationParts(opType, known1, known2);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      {/* Instruction */}
      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        🔍 FINDE DIE GEHEIMZAHL!
      </p>

      {/* Equation display */}
      <div className="bg-white rounded-3xl shadow-lg px-4 md:px-8 py-5 flex items-center gap-2 md:gap-3 flex-wrap justify-center">
        {[parts.left, parts.op, parts.right, parts.eq, parts.result].map((part, idx) => {
          const isMissing = part === '☐';
          const isOperator = part === '+' || part === '−' || part === '=';
          return (
            <span
              key={idx}
              className={
                isMissing
                  ? 'text-4xl md:text-6xl font-black text-orange-400 bg-orange-50 border-4 border-dashed border-orange-300 rounded-2xl px-3 py-1 animate-pulse'
                  : isOperator
                    ? 'text-4xl md:text-6xl font-black text-pink-500'
                    : 'text-5xl md:text-7xl font-black text-purple-700'
              }
            >
              {part}
            </span>
          );
        })}
      </div>

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-4 md:gap-5">
        {choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            <span className="text-4xl md:text-5xl">{value}</span>
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
