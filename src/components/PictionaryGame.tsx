import React, { useState, useRef, useEffect } from 'react';
import { Palette, Eraser, Trash2, Clock, Trophy, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { PICTIONARY_ITEMS } from '../data/pictionary';
import { PictionaryItem } from '../types';
import { sounds } from '../utils/sound';

export const PictionaryGame: React.FC = () => {
  const [itemIndex, setItemIndex] = useState<number>(0);
  const currentItem: PictionaryItem = PICTIONARY_ITEMS[itemIndex];

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>('#ffffff');
  const [brushSize, setBrushSize] = useState<number>(4);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [gameRole, setGameRole] = useState<'painter' | 'guesser'>('painter');
  const [hasGuessedCorrect, setHasGuessedCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#1c1917'; // stone-900 background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [itemIndex]);

  // 60s timer countdown
  useEffect(() => {
    setTimeLeft(60);
    setHasGuessedCorrect(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [itemIndex]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    sounds.playClick();
  };

  const handleGuess = (choice: string) => {
    if (hasGuessedCorrect) return;

    if (choice === currentItem.keyword) {
      sounds.playCorrect();
      const points = 500 + timeLeft * 10;
      setScore((s) => s + points);
      setHasGuessedCorrect(true);
    } else {
      sounds.playWrong();
    }
  };

  const handleNextWord = () => {
    sounds.playClick();
    setItemIndex((prev) => (prev + 1) % PICTIONARY_ITEMS.length);
  };

  const colors = ['#ffffff', '#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span>Họa Sĩ Liên Môn & Vẽ Tiếp Sức</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Vẽ Hình Minh Họa & Đoán Từ Khóa Liên Môn
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{score.toLocaleString()} ĐIỂM</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-stone-900 border border-stone-800 text-stone-300">
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{timeLeft}s</span>
          </div>
        </div>
      </div>

      {/* Target Word & Prompt Banner */}
      <div className="p-4 sm:p-5 rounded-xl bg-stone-900/90 border border-amber-600/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-amber-400 font-mono uppercase font-semibold">
            Chủ đề: {currentItem.theme}
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Từ khóa: <span className="text-amber-300">{currentItem.keyword}</span>
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            💡 <strong>Gợi ý vẽ:</strong> {currentItem.promptHint}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setGameRole(gameRole === 'painter' ? 'guesser' : 'painter')}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-stone-200"
          >
            Chế độ: {gameRole === 'painter' ? '🎨 Bạn đang Vẽ' : '🔍 Bạn đang Đoán'}
          </button>
        </div>
      </div>

      {/* Canvas Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Drawing Canvas */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl overflow-hidden border-2 border-stone-700 shadow-2xl bg-stone-900">
            <canvas
              ref={canvasRef}
              width={700}
              height={420}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="w-full h-auto cursor-crosshair touch-none"
            />
          </div>

          {/* Palette & Tools */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-stone-900 border border-stone-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">Màu:</span>
              <div className="flex items-center gap-1.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c);
                      sounds.playClick();
                    }}
                    style={{ backgroundColor: c }}
                    className={`w-6 h-6 rounded-full border transition-transform ${
                      color === c ? 'scale-125 border-white ring-2 ring-amber-500' : 'border-stone-700'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-400 font-medium">Nét:</span>
              <input
                type="range"
                min={2}
                max={16}
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-20 accent-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setColor('#1c1917');
                  sounds.playClick();
                }}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1"
                title="Tẩy"
              >
                <Eraser className="w-4 h-4" />
                <span>Tẩy</span>
              </button>
              <button
                onClick={clearCanvas}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs flex items-center gap-1"
                title="Xóa bảng"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa hết</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Guessing & Lesson Deck */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
            <h4 className="font-serif font-bold text-sm uppercase text-amber-300">
              Đoán Từ Khóa Liên Môn
            </h4>

            {hasGuessedCorrect ? (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500 text-center space-y-2 animate-fadeIn">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <span className="font-bold text-sm text-emerald-200 block">
                  Đoán đúng rồi! +{500 + timeLeft * 10} điểm
                </span>
                <p className="text-xs text-stone-300">
                  {currentItem.keyword}
                </p>
                <button
                  onClick={handleNextWord}
                  className="mt-2 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  Từ Khóa Tiếp Theo
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-xs text-stone-400">Chọn phương án đúng từ nét vẽ:</span>
                <div className="space-y-2">
                  {currentItem.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGuess(choice)}
                      className="w-full p-3 rounded-xl bg-stone-950 hover:bg-amber-950/50 border border-stone-800 hover:border-amber-600/40 text-left text-xs font-semibold text-stone-200 hover:text-white transition-colors"
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Triad Insights */}
          <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-2 text-xs">
            <span className="font-bold text-amber-400 uppercase text-[11px] block">
              Liên kết Sử - Địa - Văn của từ khóa:
            </span>
            <div className="text-stone-300 space-y-1 text-[11px]">
              <div><strong>🏛️ Sử:</strong> {currentItem.historyLink}</div>
              <div><strong>🗺️ Địa:</strong> {currentItem.geoLink}</div>
              <div><strong>📖 Văn:</strong> {currentItem.litLink}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
