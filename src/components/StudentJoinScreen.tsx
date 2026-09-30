import React, { useState } from 'react';
import { KeyRound, Play, Sparkles, BookOpen, Palette, ArrowLeft, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/sound';

interface StudentJoinScreenProps {
  onJoinPin: (pin: string, name: string) => void;
  onStartSolo: (themeId?: string) => void;
  onBackToRoles: () => void;
  onOpenThemes: () => void;
  onOpenCryptogram: () => void;
  onOpenPictionary: () => void;
  onOpenCards: () => void;
  defaultName: string;
  setPlayerName: (n: string) => void;
}

export const StudentJoinScreen: React.FC<StudentJoinScreenProps> = ({
  onJoinPin,
  onStartSolo,
  onBackToRoles,
  onOpenThemes,
  onOpenCryptogram,
  onOpenPictionary,
  onOpenCards,
  defaultName,
  setPlayerName,
}) => {
  const [pin, setPin] = useState('');
  const [name, setName] = useState(defaultName || 'Nguyễn Văn An');
  const [statusMessage, setStatusMessage] = useState<{ type: 'checking' | 'valid' | 'error' | 'ended'; text: string } | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    sounds.playClick();
    setIsChecking(true);
    setStatusMessage({ type: 'checking', text: 'Đang kiểm tra mã phòng...' });

    try {
      const res = await fetch(`/api/rooms/${pin.trim()}`);
      const data = await res.json();

      if (!res.ok || !data.exists) {
        sounds.playWrong();
        setStatusMessage({
          type: 'error',
          text: data.message || '❌ Không tìm thấy phòng. Vui lòng kiểm tra lại mã PIN.',
        });
        setIsChecking(false);
        return;
      }

      if (data.status === 'FINISHED') {
        sounds.playWrong();
        setStatusMessage({
          type: 'ended',
          text: '⚠️ Trận đấu này đã kết thúc.',
        });
        setIsChecking(false);
        return;
      }

      // Valid room!
      sounds.playCorrect();
      setStatusMessage({
        type: 'valid',
        text: `✓ Phòng hợp lệ (${data.title})! Đang vào phòng chờ...`,
      });

      setTimeout(() => {
        setPlayerName(name.trim() || 'Học Viên');
        onJoinPin(pin.trim(), name.trim() || 'Học Viên');
      }, 600);
    } catch {
      // If server check fails, attempt direct socket join
      setPlayerName(name.trim() || 'Học Viên');
      onJoinPin(pin.trim(), name.trim() || 'Học Viên');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSolo = () => {
    sounds.playClick();
    setPlayerName(name.trim() || 'Học Viên');
    onStartSolo('dien-bien-phu');
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-fadeIn py-4">
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToRoles}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Đổi vai trò</span>
        </button>

        <span className="text-xs font-mono text-amber-500 font-semibold">
          CHẾ ĐỘ HỌC SINH 👨‍🎓
        </span>
      </div>

      {/* Main Join Card (Clean Quiz.com style) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/90 border-2 border-amber-600/40 shadow-2xl space-y-6 text-center">
        <div className="space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-2xl mx-auto shadow-lg shadow-amber-950/50">
            ⚔️
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
            THAM GIA ĐẤU TRƯỜNG
          </h2>
          <p className="text-xs text-stone-400">
            Nhập mã PIN do giáo viên cung cấp để cùng tranh tài trực tuyến thời gian thực!
          </p>
        </div>

        {/* PIN Input & Name Form */}
        <form onSubmit={handleJoin} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 text-center">
              NHẬP MÃ PIN PHÒNG
            </label>
            <input
              type="text"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value.replace(/\D/g, ''));
                if (statusMessage) setStatusMessage(null);
              }}
              placeholder="728451"
              required
              autoFocus
              className="w-full py-3.5 px-4 rounded-xl bg-stone-950 border-2 border-stone-700 text-amber-300 text-3xl font-mono tracking-widest text-center font-bold focus:border-amber-500 focus:outline-none placeholder:text-stone-700 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1.5 text-center">
              TÊN NGƯỜI CHƠI
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              required
              className="w-full py-2.5 px-4 rounded-xl bg-stone-950 border border-stone-700 text-white text-sm text-center font-medium focus:border-amber-500 focus:outline-none placeholder:text-stone-600"
            />
          </div>

          {/* Validation Feedback Banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold text-center animate-fadeIn ${
                statusMessage.type === 'checking'
                  ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300'
                  : statusMessage.type === 'valid'
                  ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-200'
                  : 'bg-red-950/80 border border-red-500/60 text-red-200'
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={pin.length < 4 || isChecking}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-black text-sm tracking-wide shadow-xl shadow-red-950/50 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>THAM GIA PHÒNG REALTIME</span>
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-stone-800"></div>
          <span className="flex-shrink mx-4 text-[11px] font-mono uppercase text-stone-500">Hoặc</span>
          <div className="flex-grow border-t border-stone-800"></div>
        </div>

        {/* Instant Solo Play Button */}
        <div>
          <button
            onClick={handleSolo}
            className="w-full py-3 rounded-xl bg-stone-800/80 hover:bg-stone-700 border border-stone-700 text-stone-200 font-bold text-xs transition-colors flex items-center justify-center gap-2 active:scale-98"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>ĐẤU SOLO VỚI ĐỐI THỦ BOT NGAY (KHÔNG CẦN PIN)</span>
          </button>
        </div>
      </div>

      {/* Extra Learning Modes for Students */}
      <div className="p-4 rounded-xl bg-stone-900/40 border border-stone-800/80 space-y-3">
        <span className="text-xs font-semibold text-stone-400 block text-center uppercase tracking-wider">
          Các Hoạt Động Khám Phá Khác:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <button
            onClick={onOpenThemes}
            className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-600/40 text-stone-300 hover:text-amber-300 font-medium transition-colors"
          >
            📖 Chuyên Đề
          </button>
          <button
            onClick={onOpenCryptogram}
            className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-600/40 text-stone-300 hover:text-amber-300 font-medium transition-colors"
          >
            ✨ Mật Mã Thi
          </button>
          <button
            onClick={onOpenPictionary}
            className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-600/40 text-stone-300 hover:text-amber-300 font-medium transition-colors"
          >
            🎨 Họa Sĩ Vẽ
          </button>
          <button
            onClick={onOpenCards}
            className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 hover:border-amber-600/40 text-stone-300 hover:text-amber-300 font-medium transition-colors"
          >
            👑 Thẻ Tướng
          </button>
        </div>
      </div>
    </div>
  );
};
