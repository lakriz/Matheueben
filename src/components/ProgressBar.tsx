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
    <div className="w-full bg-white rounded-3xl shadow-md p-4">
      {/* Exercise progress */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">⭐</span>
        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
          <div
            className="h-full bg-purple-400 rounded-full transition-all duration-500"
            style={{ width: `${exercisePercent}%` }}
          />
        </div>
        <span className="text-xl font-black text-purple-700 min-w-[60px] text-right">
          {current}/{total}
        </span>
      </div>

      {/* Time progress */}
      <div className="flex items-center gap-3">
        <span className="text-2xl">⏱️</span>
        <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
          <div
            className={`h-full ${timeColor} rounded-full transition-all duration-1000`}
            style={{ width: `${timePercent}%` }}
          />
        </div>
        <span
          className={`text-xl font-black min-w-[60px] text-right ${
            timeLeft <= 60 ? 'text-red-500' : 'text-green-600'
          }`}
        >
          {timeStr}
        </span>
      </div>
    </div>
  );
}
