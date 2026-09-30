import React from 'react';
import { Volume2, VolumeX, Shield, GraduationCap, School, BookOpen, KeyRound, Palette, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

export type ActiveTab = 'arena' | 'themes' | 'cryptogram' | 'pictionary' | 'cards' | 'teacher' | 'admin';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  openPinModal: () => void;
  onHomeClick?: () => void;
  currentRole?: 'student' | 'teacher' | 'admin' | null;
  activeRoomCode?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  openPinModal,
  onHomeClick,
  currentRole,
  activeRoomCode,
}) => {
  const toggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) sounds.playClick();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md px-4 sm:px-6 py-3 transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with historical prestige */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onHomeClick) onHomeClick();
              else setActiveTab('arena');
            }}
            className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-600 to-red-800 flex items-center justify-center shadow-md shadow-red-950/40 border border-amber-500/30 group-hover:scale-105 transition-transform">
              <span className="text-lg">⚔️</span>
            </div>
            <div>
              <span className="block font-serif text-base sm:text-lg font-bold tracking-tight text-amber-200 group-hover:text-amber-100 transition-colors uppercase">
                Đấu Trường Liên Môn
              </span>
              <span className="block text-[11px] font-medium tracking-wider text-amber-500/80 uppercase">
                Sử • Địa • Văn
              </span>
            </div>
          </button>

          {activeRoomCode && (
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/50 border border-amber-600/30 text-xs font-mono text-amber-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>PHÒNG: {activeRoomCode}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs sm:text-sm font-medium text-stone-400">
          <button
            onClick={() => setActiveTab('arena')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'arena' ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 font-semibold' : 'hover:text-stone-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Đấu Trường</span>
          </button>
          <button
            onClick={() => setActiveTab('themes')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'themes' ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 font-semibold' : 'hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Chuyên Đề</span>
          </button>
          <button
            onClick={() => setActiveTab('cryptogram')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'cryptogram' ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 font-semibold' : 'hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Mật Mã Thi</span>
          </button>
          <button
            onClick={() => setActiveTab('pictionary')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'pictionary' ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 font-semibold' : 'hover:text-stone-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Họa Sĩ</span>
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'cards' ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 font-semibold' : 'hover:text-stone-200'
            }`}
          >
            <span>Thẻ Tướng</span>
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'teacher' ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 font-semibold' : 'hover:text-stone-200'
            }`}
          >
            <School className="w-4 h-4" />
            <span>Giáo Viên</span>
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'admin' ? 'text-amber-300 bg-amber-950/40 border border-amber-600/30 font-semibold' : 'hover:text-stone-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin AI</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {currentRole && onHomeClick && (
            <button
              onClick={onHomeClick}
              className="px-2.5 py-1.5 rounded-md border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 text-xs font-medium transition-colors"
              title="Quay lại chọn vai trò"
            >
              <span>Đổi Vai Trò</span>
            </button>
          )}

          <button
            onClick={openPinModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-md shadow-sm transition-transform active:scale-95"
            title="Nhập mã PIN tham gia trận đấu"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nhập PIN</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-md border border-stone-800 bg-stone-900/80 hover:bg-stone-800 text-stone-300 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-label="Chuyển đổi âm thanh"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="flex lg:hidden overflow-x-auto gap-1.5 pt-2.5 mt-2 border-t border-stone-800/60 no-scrollbar text-xs">
        <button
          onClick={() => setActiveTab('arena')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'arena' ? 'bg-amber-900/60 text-amber-300 font-medium' : 'text-stone-400'}`}
        >
          Đấu Trường
        </button>
        <button
          onClick={() => setActiveTab('themes')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'themes' ? 'bg-amber-900/60 text-amber-300 font-medium' : 'text-stone-400'}`}
        >
          Chuyên Đề
        </button>
        <button
          onClick={() => setActiveTab('cryptogram')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'cryptogram' ? 'bg-amber-900/60 text-amber-300 font-medium' : 'text-stone-400'}`}
        >
          Mật Mã Thi
        </button>
        <button
          onClick={() => setActiveTab('pictionary')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'pictionary' ? 'bg-amber-900/60 text-amber-300 font-medium' : 'text-stone-400'}`}
        >
          Họa Sĩ
        </button>
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'cards' ? 'bg-amber-900/60 text-amber-300 font-medium' : 'text-stone-400'}`}
        >
          Thẻ Tướng
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'teacher' ? 'bg-amber-900/60 text-amber-300 font-medium' : 'text-stone-400'}`}
        >
          Giáo Viên
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          className={`px-2.5 py-1 rounded whitespace-nowrap ${activeTab === 'admin' ? 'bg-amber-900/60 text-amber-300 font-medium' : 'text-stone-400'}`}
        >
          Admin AI
        </button>
      </div>
    </header>
  );
};
