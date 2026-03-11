import { useState } from 'react';
import { useTheme } from '../../../theme/ThemeContext';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type CountingScenarioType =
  | 'dice'        // 2 Würfel
  | 'dice3'       // 3 Würfel
  | 'apples'      // Äpfel in Körben
  | 'ladder'      // Sprossen an Leitern
  | 'stars'       // Sterne am Himmel
  | 'flowers'     // Blumen in Töpfen
  | 'fish'        // Fische im Teich
  | 'birds';      // Vögel auf Ästen

export interface CountingScenario {
  type: CountingScenarioType;
  counts: number[]; // 2 values normally, 3 for dice3
}

interface Props {
  scenario: CountingScenario;
  correctAnswer: number;
  choices: number[];
  onAnswer: (correct: boolean) => void;
}

// ---------------------------------------------------------------------------
// Dice face dot patterns – 3×3 grid, true = dot visible
// ---------------------------------------------------------------------------
const DICE_PATTERNS: Record<number, boolean[]> = {
  1: [false, false, false, false, true,  false, false, false, false],
  2: [false, false, true,  false, false, false, true,  false, false],
  3: [false, false, true,  false, true,  false, true,  false, false],
  4: [true,  false, true,  false, false, false, true,  false, true ],
  5: [true,  false, true,  false, true,  false, true,  false, true ],
  6: [true,  false, true,  true,  false, true,  true,  false, true ],
};

function DiceFace({ value, label, small }: { value: number; label: string; small?: boolean }) {
  const dots = DICE_PATTERNS[value] ?? DICE_PATTERNS[1];
  const sizeClass = small
    ? 'w-16 h-16 rounded-xl border-2 p-1'
    : 'w-20 h-20 md:w-24 md:h-24 rounded-2xl border-4 p-2';
  const dotSize = small ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`bg-white ${sizeClass} border-gray-300 shadow-xl grid grid-cols-3 gap-0`}>
        {dots.map((active, i) => (
          <div key={i} className="flex items-center justify-center">
            {active && <div className={`${dotSize} bg-gray-800 rounded-full shadow`} />}
          </div>
        ))}
      </div>
      <span className="text-xs font-black text-gray-500 uppercase">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Emoji item grid (apples, stars, flowers, fish, birds, …)
// ---------------------------------------------------------------------------
function ItemGrid({
  count,
  emoji,
  label,
  bgClass,
  borderClass,
}: {
  count: number;
  emoji: string;
  label: string;
  bgClass: string;
  borderClass: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${bgClass} ${borderClass} border-4 rounded-2xl p-3 flex flex-wrap justify-center gap-1 items-center`}
        style={{ minWidth: 90, minHeight: 80, maxWidth: 130 }}
      >
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className="text-3xl leading-tight select-none">
            {emoji}
          </span>
        ))}
      </div>
      <span className="text-xs font-black text-gray-500 uppercase">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SVG Ladder
// ---------------------------------------------------------------------------
function LadderSVG({ rungs, label }: { rungs: number; label: string }) {
  const rungSpacing = 22;
  const topPad = 14;
  const height = topPad + rungs * rungSpacing + 14;
  const width = 72;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={width} height={height} className="drop-shadow-md" role="img" aria-label={label}>
        {/* Left rail */}
        <line x1="12" y1="0" x2="12" y2={height} stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
        {/* Right rail */}
        <line x1="60" y1="0" x2="60" y2={height} stroke="#92400e" strokeWidth="8" strokeLinecap="round" />
        {/* Rungs */}
        {Array.from({ length: rungs }, (_, i) => {
          const y = topPad + i * rungSpacing;
          return (
            <line
              key={i}
              x1="12"
              y1={y}
              x2="60"
              y2={y}
              stroke="#d97706"
              strokeWidth="6"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <span className="text-xs font-black text-amber-700 uppercase">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scenario configuration
// ---------------------------------------------------------------------------
interface ScenarioConfig {
  title: string;
  groupEmoji?: string;
  bgClass: string;
  borderClass: string;
  groupLabel: (i: number) => string;
}

const SCENARIO_CONFIG: Record<CountingScenarioType, ScenarioConfig> = {
  dice: {
    title: '🎲 ZÄHLE DIE PUNKTE AUF DEN WÜRFELN!',
    bgClass: 'bg-white',
    borderClass: 'border-gray-300',
    groupLabel: (i) => `WÜRFEL ${i + 1}`,
  },
  dice3: {
    title: '🎲 ZÄHLE DIE PUNKTE AUF ALLEN DREI WÜRFELN!',
    bgClass: 'bg-white',
    borderClass: 'border-gray-300',
    groupLabel: (i) => `WÜRFEL ${i + 1}`,
  },
  apples: {
    title: '🍎 ZÄHLE DIE ÄPFEL IN DEN KÖRBEN!',
    groupEmoji: '🍎',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-400',
    groupLabel: (i) => `KORB ${i + 1}`,
  },
  ladder: {
    title: '🪜 ZÄHLE DIE SPROSSEN DER LEITERN!',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-400',
    groupLabel: (i) => `LEITER ${i + 1}`,
  },
  stars: {
    title: '⭐ ZÄHLE DIE STERNE AM HIMMEL!',
    groupEmoji: '⭐',
    bgClass: 'bg-indigo-100',
    borderClass: 'border-indigo-400',
    groupLabel: (i) => `HIMMEL ${i + 1}`,
  },
  flowers: {
    title: '🌸 ZÄHLE DIE BLUMEN IN DEN TÖPFEN!',
    groupEmoji: '🌸',
    bgClass: 'bg-pink-100',
    borderClass: 'border-pink-400',
    groupLabel: (i) => `TOPF ${i + 1}`,
  },
  fish: {
    title: '🐟 ZÄHLE DIE FISCHE IM TEICH!',
    groupEmoji: '🐟',
    bgClass: 'bg-blue-100',
    borderClass: 'border-blue-400',
    groupLabel: (i) => `TEICH ${i + 1}`,
  },
  birds: {
    title: '🐦 ZÄHLE DIE VÖGEL AUF DEM AST!',
    groupEmoji: '🐦',
    bgClass: 'bg-green-100',
    borderClass: 'border-green-400',
    groupLabel: (i) => `AST ${i + 1}`,
  },
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function CountingAdditionExercise({
  scenario,
  correctAnswer,
  choices,
  onAnswer,
}: Props) {
  const { theme } = useTheme();
  const [selected, setSelected] = useState<number | null>(null);
  const [emojiIdx] = useState(() => Math.floor(Math.random() * theme.items.length));

  const config = SCENARIO_CONFIG[scenario.type];
  const isEmojiScenario = scenario.type !== 'dice' && scenario.type !== 'dice3' && scenario.type !== 'ladder';
  const resolvedConfig = isEmojiScenario ? { ...config, groupEmoji: theme.items[emojiIdx] } : config;
  const feedbackText = selected === null
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
      'flex items-center justify-center w-28 h-28 md:w-36 md:h-36 rounded-3xl text-6xl md:text-7xl font-black shadow-lg transition-all duration-200 select-none ';
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

  const renderGroup = (count: number, index: number) => {
    const label = resolvedConfig.groupLabel(index);
    const isDice = scenario.type === 'dice' || scenario.type === 'dice3';
    if (isDice) {
      return <DiceFace key={index} value={count} label={label} small={scenario.type === 'dice3'} />;
    }
    if (scenario.type === 'ladder') {
      return <LadderSVG key={index} rungs={count} label={label} />;
    }
    return (
      <ItemGrid
        key={index}
        count={count}
        emoji={resolvedConfig.groupEmoji ?? '❓'}
        label={label}
        bgClass={resolvedConfig.bgClass}
        borderClass={resolvedConfig.borderClass}
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <p className="text-xl md:text-2xl font-black text-gray-700 uppercase text-center">
        {resolvedConfig.title}
      </p>

      {/* Visual groups */}
      <div className="bg-white rounded-3xl shadow-lg px-6 py-6 flex items-center gap-3 flex-wrap justify-center">
        {scenario.counts.map((count, i) => (
          <div key={i} className="flex items-center gap-3">
            {renderGroup(count, i)}
            {i < scenario.counts.length - 1 && (
              <span className="text-5xl font-black text-pink-500">+</span>
            )}
          </div>
        ))}
        <span className="text-5xl font-black text-gray-400 ml-1">=</span>
        <span className="text-5xl font-black text-orange-400">?</span>
      </div>

      {/* Prompt */}
      <p className="text-2xl md:text-3xl font-black text-gray-600 uppercase">
        TIPPE DIE RICHTIGE ANTWORT! 👇
      </p>

      {/* Answer choices */}
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
