interface Props {
  score: number;
  total: number;
  onRestart: () => void;
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

export default function ResultScreen({ score, total, onRestart }: Props) {
  const stars = getStars(score, total);
  const { title, sub, emoji } = getMessage(stars);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-b from-purple-200 via-pink-100 to-yellow-200">
      {/* Trophy */}
      <div className="text-8xl mb-4 animate-bounce">{emoji}</div>

      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-black text-purple-700 uppercase mb-3 drop-shadow-md animate-bounce-in">
        {title}
      </h1>
      <p className="text-2xl md:text-3xl font-black text-blue-600 uppercase mb-6">{sub}</p>

      {/* Stars */}
      <div className="flex gap-3 mb-6">
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
      <div className="bg-white rounded-3xl shadow-lg px-10 py-6 mb-8 flex flex-col items-center gap-2">
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
        className="bg-green-400 hover:bg-green-500 active:scale-95 active:bg-green-600 text-white text-3xl md:text-4xl font-black py-5 px-12 rounded-full shadow-xl transform hover:scale-105 transition-all uppercase"
      >
        🔄 NOCHMAL SPIELEN!
      </button>

      {/* Encouragement emojis */}
      <div className="flex gap-3 mt-8 text-4xl">
        {['🌈', '⭐', '🎈', '⭐', '🌈'].map((e, i) => (
          <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}
