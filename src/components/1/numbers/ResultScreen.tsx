import { useTheme } from '../../../theme/ThemeContext';

interface Props {
  readonly score: number;
  readonly total: number;
  readonly onRestart: () => void;
  readonly onHome: () => void;
}

function getStars(score: number, total: number): number {
  const ratio = total > 0 ? score / total : 0;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.6) return 2;
  return 1;
}

function getMessage(stars: number): { title: string; sub: string; emoji: string } {
  if (stars === 3) {
    return {
      title: 'SUPER GEMACHT!',
      sub: 'DU BIST EIN MATHE-STAR! 🌟',
      emoji: '🏆',
    };
  }
  if (stars === 2) {
    return {
      title: 'TOLL GEMACHT!',
      sub: 'NOCH EIN BISSCHEN ÜBEN! 💪',
      emoji: '🎉',
    };
  }
  return {
    title: 'WEITER ÜBEN!',
    sub: 'DU SCHAFFST DAS! WIR PROBIEREN NOCHMAL! 😊',
    emoji: '💡',
  };
}

export default function ResultScreen({ score, total, onRestart, onHome }: Props) {
  const { theme } = useTheme();
  const stars = getStars(score, total);
  const { title, sub, emoji } = getMessage(stars);

  return (
    <div className={`tablet-screen flex flex-col items-center justify-center h-full p-3 text-center bg-gradient-to-b ${theme.sessionBg}`}>
      {/* Trophy */}
      <div className="text-6xl mb-1">{emoji}</div>

      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-black text-purple-700 uppercase mb-1 drop-shadow-md animate-bounce-in">
        {title}
      </h1>
      <p className="text-lg md:text-2xl font-black text-blue-600 uppercase mb-2">{sub}</p>

      {/* Stars */}
      <div className="flex gap-2 mb-2">
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className="text-6xl md:text-7xl animate-star-pop"
            style={{
              animationDelay: `${i * 0.15}s`,
              opacity: i <= stars ? 1 : 0.2,
            }}
          >
            ⭐
          </span>
        ))}
      </div>

      {/* Score card */}
      <div className="bg-white rounded-3xl shadow-lg px-6 py-3 mb-3 flex flex-col items-center gap-1">
        <p className="text-2xl font-black text-gray-500 uppercase">DEIN ERGEBNIS</p>
        <div className="flex items-center gap-2">
          <span className="text-6xl md:text-7xl font-black text-green-500">{score}</span>
          <span className="text-4xl font-black text-gray-400">/</span>
          <span className="text-6xl md:text-7xl font-black text-purple-500">{total}</span>
        </div>
        <p className="text-xl font-black text-gray-500 uppercase">RICHTIG</p>
      </div>

      {/* Restart button */}
      <button
        onClick={onRestart}
        className="bg-green-400 hover:bg-green-500 active:scale-95 active:bg-green-600 text-white text-xl md:text-3xl font-black py-3 px-8 rounded-full shadow-xl transform hover:scale-105 transition-all uppercase"
      >
        🔄 NOCHMAL SPIELEN!
      </button>

      {/* Home button */}
      <button
        onClick={onHome}
        className="mt-2 bg-white hover:bg-gray-50 active:scale-95 text-purple-600 text-lg md:text-2xl font-black py-2.5 px-7 rounded-full shadow-md border-4 border-purple-300 transform hover:scale-105 transition-all uppercase"
      >
        🏠 ZURÜCK ZUR ÜBERSICHT
      </button>

      {/* Encouragement emojis */}
      <div className="tablet-compact-hide flex gap-2 mt-3 text-3xl">
        {theme.decorations.map((e, i) => (
          <span key={`dec-${i}`} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
