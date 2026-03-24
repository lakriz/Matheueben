interface Props {
  current: number; // exercises completed
  total: number;   // total exercises in session
  timeLeft: number; // seconds remaining
}

const SESSION_SECONDS = 300; // 5 minutes

export default function ProgressBar({ current, total, timeLeft }: Props) {
  const exercisePercent = total > 0 ? (current / total) * 100 : 0;
  const timePercent = (timeLeft / SESSION_SECONDS) * 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Color changes as time runs low
  const timeColor =
    timeLeft > 120 ? 'bg-green-400' :
    timeLeft > 60  ? 'bg-yellow-400' :
                     'bg-red-400';

  return (
    <div className="w-full bg-white/95 rounded-2xl shadow-md p-2.5 border border-white/70">
      {/* Exercise progress */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">⭐</span>
        <div className="flex-1 bg-gray-100 rounded-full h-3.5 overflow-hidden">
          <div
            className="h-full bg-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${exercisePercent}%` }}
          />
        </div>
        <span className="text-sm font-black text-purple-700 min-w-[40px] text-right">
          {current}/{total}
        </span>
      </div>

      {/* Time progress */}
      <div className="flex items-center gap-2">
        <span className="text-lg">⏱️</span>
        <div className="flex-1 bg-gray-100 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full ${timeColor} rounded-full transition-all duration-1000`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
        <span
          className={`text-sm font-black min-w-[40px] text-right ${
            timeLeft <= 60 ? 'text-red-500' : 'text-green-600'
          }`}
        >
          {timeStr}
        </span>
      </div>
    </div>
  );
}
