import { useState, useEffect, useId } from 'react';

interface Props {
  readonly onCancel: () => void;
}

export default function CancelButton({ onCancel }: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!showConfirm) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConfirm(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showConfirm]);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-sm font-black text-gray-400 hover:text-red-500 underline uppercase transition-colors px-2 py-1"
      >
        ✖ ABBRECHEN
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <div className="bg-white rounded-3xl shadow-2xl p-6 mx-4 max-w-sm w-full flex flex-col items-center gap-4">
            <span className="text-5xl">🚪</span>
            <p id={titleId} className="text-xl font-black text-gray-700 text-center uppercase">
              ÜBUNG ABBRECHEN?
            </p>
            <p className="text-base font-bold text-gray-500 text-center">
              Alle Ergebnisse dieser Aufgabe gehen verloren!
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 text-base font-black py-3 rounded-2xl transition-all uppercase"
              >
                WEITER SPIELEN
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-red-500 hover:bg-red-600 active:scale-95 text-white text-base font-black py-3 rounded-2xl transition-all uppercase"
              >
                JA, ABBRECHEN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
