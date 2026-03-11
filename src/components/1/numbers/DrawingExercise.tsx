import { useRef, useEffect, useState, useCallback } from 'react';

interface Props {
  digit: number;
  onDone: () => void;
}

// Stroke guide data: SVG-like path hints for digits 0-9
// Each entry is an array of emoji arrows that show stroke direction
const STROKE_HINTS: Record<number, string[]> = {
  0: ['⬇️ Oval zeichnen', '↩️ Zurück oben'],
  1: ['⬇️ Gerade Linie runter'],
  2: ['↪️ Bogen oben', '↘️ Diagonal', '➡️ Linie rechts'],
  3: ['↪️ Halbkreis', '↪️ Nochmal'],
  4: ['⬇️ Links', '➡️ Horizontal', '⬇️ Rechts'],
  5: ['⬅️ Oben links', '⬇️ Dann Bogen'],
  6: ['↘️ Bogen runter', '↩️ Kreis unten'],
  7: ['➡️ Oben', '↙️ Diagonal'],
  8: ['↩️ Doppelter S'],
  9: ['↩️ Kreis oben', '⬇️ Linie runter'],
};

// How to write each digit in words (German, child-friendly)
const DIGIT_TIPS: Record<number, string> = {
  0: 'EIN GROSSES OVAL MALEN',
  1: 'EINEN STRICH RUNTER',
  2: 'BOGEN, DANN SCHRÄG, DANN QUER',
  3: 'ZWEI HALBKREISE',
  4: 'STRICH, QUER, DANN NOCHMAL RUNTER',
  5: 'STRICH LINKS, BAUCH RECHTS',
  6: 'BOGEN MIT KREIS UNTEN',
  7: 'QUER, DANN SCHRÄG RUNTER',
  8: 'WIE ZWEI KREISE',
  9: 'KREIS OBEN, DANN RUNTER',
};

export default function DrawingExercise({ digit, onDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Paint the canvas background, guide lines, and ghost digit
  const paintCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#FFFDE7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw guide lines (like a writing notebook)
    ctx.strokeStyle = '#B0BEC5';
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 6]);
    const midY = canvas.height / 2;
    ctx.beginPath();
    ctx.moveTo(20, midY);
    ctx.lineTo(canvas.width - 20, midY);
    ctx.stroke();

    // Draw baseline
    ctx.strokeStyle = '#90A4AE';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    const baseY = (canvas.height * 3) / 4;
    ctx.beginPath();
    ctx.moveTo(20, baseY);
    ctx.lineTo(canvas.width - 20, baseY);
    ctx.stroke();

    // Draw faint guide digit
    ctx.font = `bold ${canvas.height * 0.65}px 'Nunito', cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(180, 200, 255, 0.35)';
    ctx.fillText(String(digit), canvas.width / 2, canvas.height * 0.45);

    ctx.setLineDash([]);
  }, [digit]);

  // Initialize canvas on mount (component is remounted per exercise via key prop)
  useEffect(() => {
    paintCanvas();
  }, [paintCanvas]);

  // Clear canvas and reset drawing state (called from the "NOCHMAL" button)
  const handleClear = () => {
    paintCanvas();
    setHasDrawn(false);
  };

  // Get canvas-relative position from event
  const getPos = (canvas: HTMLCanvasElement, e: React.PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setHasDrawn(true);
    lastPos.current = getPos(canvas, e);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPos.current) return;

    const pos = getPos(canvas, e);

    ctx.strokeStyle = '#1A237E';
    ctx.lineWidth = e.pressure > 0 ? Math.max(4, e.pressure * 14) : 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    lastPos.current = pos;
  };

  const endDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
    lastPos.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-5 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <span className="text-3xl">✏️</span>
        <p className="text-2xl md:text-3xl font-black text-gray-700 uppercase">
          SCHREIBE DIE ZAHL:
        </p>
      </div>

      {/* Large digit example */}
      <div className="bg-white rounded-3xl shadow-lg px-10 py-4 flex flex-col items-center">
        <span className="text-9xl md:text-[10rem] font-black text-purple-700 leading-none select-none">
          {digit}
        </span>
        <span className="text-lg font-black text-gray-400 uppercase mt-1">
          {DIGIT_TIPS[digit]}
        </span>
      </div>

      {/* Stroke hints */}
      <div className="flex gap-2 flex-wrap justify-center">
        {STROKE_HINTS[digit].map((hint, i) => (
          <span
            key={i}
            className="bg-yellow-100 rounded-full px-4 py-1 text-base font-bold text-yellow-800"
          >
            {hint}
          </span>
        ))}
      </div>

      {/* Canvas */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-purple-200">
        <canvas
          ref={canvasRef}
          width={360}
          height={280}
          className="block w-[360px] h-[280px] max-w-full cursor-crosshair"
          onPointerDown={startDraw}
          onPointerMove={draw}
          onPointerUp={endDraw}
          onPointerLeave={endDraw}
          onPointerCancel={endDraw}
        />
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 flex-wrap justify-center">
        <button
          onClick={handleClear}
          className="bg-yellow-300 hover:bg-yellow-400 active:scale-95 text-yellow-900 text-2xl font-black py-4 px-8 rounded-full shadow-md transition-all uppercase"
        >
          🔄 NOCHMAL
        </button>
        <button
          onClick={onDone}
          disabled={!hasDrawn}
          className={`text-2xl font-black py-4 px-8 rounded-full shadow-md transition-all uppercase ${
            hasDrawn
              ? 'bg-green-400 hover:bg-green-500 active:scale-95 text-white'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          ✅ FERTIG!
        </button>
      </div>
    </div>
  );
}
