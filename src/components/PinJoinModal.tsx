import React, { useState } from 'react';
import { KeyRound, X, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/sound';

interface PinJoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (pin: string, name: string) => void;
  defaultName: string;
}

export const PinJoinModal: React.FC<PinJoinModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  defaultName,
}) => {
  const [pin, setPin] = useState('');
  const [name, setName] = useState(defaultName || 'Học Viên Thi Đấu');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;
    sounds.playClick();
    onJoin(pin.trim(), name.trim() || 'Học Viên Thi Đấu');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-2xl bg-stone-900 border border-amber-500/50 p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-xl mx-auto shadow-md">
            <KeyRound className="w-6 h-6 text-amber-400" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            Nhập Mã PIN Tham Gia Trận Đấu
          </h3>
          <p className="text-xs text-stone-400">
            Nhập mã phòng 6 chữ số do giáo viên hoặc bạn bè chia sẻ.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1">
              Tên Học Sinh / Người Chơi
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Trần Văn Bình"
              required
              className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-white text-sm focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-400 mb-1">
              Mã Phòng PIN (6 chữ số)
            </label>
            <input
              type="text"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="728451"
              required
              autoFocus
              className="w-full px-3.5 py-3 rounded-lg bg-stone-950 border border-stone-700 text-amber-300 text-2xl font-mono tracking-widest text-center font-bold focus:border-amber-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={pin.length < 4}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-bold text-sm shadow-xl shadow-red-950/40 transition-transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            <span>VÀO ĐẤU TRƯỜNG NGAY</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
