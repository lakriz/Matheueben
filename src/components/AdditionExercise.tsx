import { useState } from 'react';

interface Props {
  num1: number;
  num2: number;
  correctAnswer: number;
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

export default function AdditionExercise({
  num1,
  num2,
  correctAnswer,
  choices,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleChoice = (value: number) => {
    if (selected !== null) return; // prevent multiple clicks
    setSelected(value);
    const isCorrect = value === correctAnswer;
    // Delay to show feedback before advancing
    setTimeout(() => {
      onAnswer(isCorrect);
      setSelected(null);
    }, 900);
  };

  // Color per button state
  const getButtonClass = (value: number) => {
    const base =
      'flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-3xl text-5xl md:text-6xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) {
      return base + 'bg-blue-200 hover:bg-blue-300 active:scale-95 text-blue-900';
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
      {/* Problem display */}
      <div className="bg-white rounded-3xl shadow-lg px-10 py-8 flex items-center gap-4">
        <span className="text-7xl md:text-8xl font-black text-purple-700">{num1}</span>
        <span className="text-6xl md:text-7xl font-black text-pink-500">+</span>
        <span className="text-7xl md:text-8xl font-black text-purple-700">{num2}</span>
        <span className="text-6xl md:text-7xl font-black text-gray-400">=</span>
        <span className="text-7xl md:text-8xl font-black text-orange-400">?</span>
      </div>

      {/* Instruction */}
      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        TIPPE DIE RICHTIGE ANTWORT! 👇
      </p>

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-5">
        {choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            {value}
            {selected !== null && value === correctAnswer && ' ✓'}
          </button>
        ))}
      </div>

      {/* Feedback message */}
      {selected !== null && (
        <div
          className={`text-3xl md:text-4xl font-black animate-bounce-in ${
            selected === correctAnswer ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {selected === correctAnswer ? '⭐ SUPER! RICHTIG! 🎉' : '❌ NICHT GANZ... 💪'}
        </div>
      )}
    </div>
  );
}
