import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

export interface WordProblem {
  text: string;
  emoji: string;
  correctAnswer: number;
  choices: number[];
}

interface Props {
  problem: WordProblem;
  onAnswer: (correct: boolean) => void;
}

export default function WordProblemExercise({ problem, onAnswer }: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const feedbackText = selected === null ? ' ' : selected === problem.correctAnswer ? 'SUPER! RICHTIG!' : 'NICHT GANZ...';

  const handleChoice = (value: number) => {
    if (selected !== null) return;
    setSelected(value);
    setTimeout(() => { onAnswer(value === problem.correctAnswer); setSelected(null); }, 900);
  };

  const getButtonClass = (value: number) => {
    const base = 'flex items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-3xl font-black shadow-lg transition-all duration-200 select-none ';
    if (selected === null) return base + theme.buttonIdle;
    if (value === problem.correctAnswer) return base + 'bg-green-400 text-white scale-110';
    if (value === selected) return base + 'bg-red-400 text-white animate-wiggle';
    return base + 'bg-gray-200 text-gray-400';
  };

  return (
    <div className="flex flex-col items-center gap-5 p-3">
      <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase text-center">
        LIES DIE AUFGABE!
      </p>

      {/* Problem card */}
      <div className="bg-white rounded-3xl shadow-lg p-5 max-w-sm w-full flex flex-col items-center gap-3">
        <span className="text-5xl">{problem.emoji}</span>
        <p className="text-lg md:text-xl font-bold text-gray-700 text-center leading-relaxed">
          {problem.text}
        </p>
      </div>

      <p className="text-xl md:text-2xl font-black text-gray-600 uppercase">TIPPE DIE RICHTIGE ZAHL!</p>

      <div className="grid grid-cols-2 gap-4">
        {problem.choices.map((value) => (
          <button key={value} onClick={() => handleChoice(value)} className={getButtonClass(value)}>
            <span className="text-5xl md:text-6xl">{value}</span>
          </button>
        ))}
      </div>

      <div className={`min-h-12 text-3xl md:text-4xl font-black ${selected === null ? 'invisible' : selected === problem.correctAnswer ? 'text-green-500 animate-bounce-in' : 'text-red-500 animate-bounce-in'}`}>
        {feedbackText}
      </div>
    </div>
  );
}
