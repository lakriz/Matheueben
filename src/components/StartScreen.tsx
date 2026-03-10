interface Props {
  onStart: () => void;
}

export default function StartScreen({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-b from-yellow-200 via-pink-100 to-blue-200">
      {/* Title */}
      <div className="text-7xl mb-2 animate-bounce">🌈</div>
      <h1 className="text-5xl md:text-7xl font-black text-purple-700 mb-3 uppercase leading-tight drop-shadow-md">
        MATHE ÜBEN!
      </h1>
      <p className="text-3xl md:text-4xl font-black text-blue-600 mb-6 uppercase">
        FÜR DIE 1. KLASSE ⭐
      </p>

      {/* Feature icons */}
      <div className="flex gap-6 mb-8">
        <div className="flex flex-col items-center gap-2 bg-white rounded-3xl p-4 shadow-md">
          <span className="text-5xl">➕</span>
          <span className="text-xl font-black text-purple-600 uppercase">RECHNEN</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white rounded-3xl p-4 shadow-md">
          <span className="text-5xl">✏️</span>
          <span className="text-xl font-black text-blue-600 uppercase">SCHREIBEN</span>
        </div>
        <div className="flex flex-col items-center gap-2 bg-white rounded-3xl p-4 shadow-md">
          <span className="text-5xl">🏆</span>
          <span className="text-xl font-black text-green-600 uppercase">PUNKTE</span>
        </div>
      </div>

      {/* Time info */}
      <div className="bg-white rounded-3xl px-8 py-4 shadow-md mb-8 flex items-center gap-3">
        <span className="text-4xl">⏱️</span>
        <span className="text-2xl font-black text-orange-500 uppercase">5 MINUTEN ÜBUNG</span>
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="bg-green-400 hover:bg-green-500 active:bg-green-600 active:scale-95 text-white text-4xl md:text-5xl font-black py-6 px-14 rounded-full shadow-xl transform hover:scale-105 transition-all uppercase tracking-wide"
      >
        LOS GEHT'S! 🚀
      </button>

      {/* Decorative stars */}
      <div className="flex gap-3 mt-8 text-4xl">
        {['⭐', '🌟', '✨', '🌟', '⭐'].map((star, i) => (
          <span key={i} style={{ animationDelay: `${i * 0.1}s` }} className="animate-bounce">
            {star}
          </span>
        ))}
      </div>
    </div>
  );
}
