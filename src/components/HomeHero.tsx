import React, { useState } from 'react';
import { Play, Users, Sparkles, BookOpen, KeyRound, Award, School, ShieldAlert, Zap, Compass, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/sound';
import { INTERDISCIPLINARY_THEMES } from '../data/themes';

interface HomeHeroProps {
  onJoinPin: (pin: string, name: string) => void;
  onStartSolo: (themeId?: string) => void;
  onOpenTeacher: () => void;
  onOpenAdmin: () => void;
  onOpenThemes: () => void;
  onOpenCards: () => void;
  playerName: string;
  setPlayerName: (n: string) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onJoinPin,
  onStartSolo,
  onOpenTeacher,
  onOpenAdmin,
  onOpenThemes,
  onOpenCards,
  playerName,
  setPlayerName,
}) => {
  const [pinCode, setPinCode] = useState('');
  const [selectedThemeId, setSelectedThemeId] = useState<string>('dien-bien-phu');

  const handleJoinPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinCode.trim()) return;
    sounds.playClick();
    onJoinPin(pinCode.trim(), playerName.trim() || 'Học Viên Thi Đấu');
  };

  const handleSolo = () => {
    sounds.playClick();
    onStartSolo(selectedThemeId);
  };

  return (
    <div className="w-full space-y-8 sm:space-y-12">
      {/* Hero Visual Banner & Direct PIN Entry */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-800 bg-stone-900/60 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/arena_hero_banner_1790757687116.jpg"
            alt="Đấu Trường Liên Môn Sử Địa Văn"
            className="w-full h-full object-cover opacity-25 filter saturate-125"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/70 to-transparent" />
        </div>

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nền tảng Quiz Realtime Liên Môn Đầu Tiên tại Việt Nam</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            ĐẤU TRƯỜNG LIÊN MÔN
            <span className="block text-2xl sm:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-red-400 mt-2">
              SỬ • ĐỊA • VĂN
            </span>
          </h1>

          <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Kết nối trọn vẹn: <span className="text-amber-300 font-semibold">Lịch sử (Thời gian)</span> →{' '}
            <span className="text-emerald-300 font-semibold">Địa lý (Không gian)</span> →{' '}
            <span className="text-sky-300 font-semibold">Văn học (Con người & Tác phẩm)</span>. Thi đấu trực tuyến thời gian thực, bứt phá phản xạ và làm chủ kiến thức đỉnh cao!
          </p>

          {/* Quick PIN Input Bar */}
          <div className="p-4 sm:p-5 rounded-xl bg-stone-950/90 border border-amber-600/30 shadow-xl max-w-xl">
            <form onSubmit={handleJoinPin} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Tên Hiệp Sĩ / Học Sinh
                  </label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A..."
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-white text-sm focus:border-amber-500 focus:outline-none placeholder:text-stone-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-400 mb-1">
                    Mã Phòng PIN (6 chữ số)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="728451"
                    className="w-full px-3 py-2 rounded-lg bg-stone-900 border border-stone-700 text-amber-300 text-sm font-mono tracking-widest text-center focus:border-amber-500 focus:outline-none placeholder:text-stone-600 font-bold"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={pinCode.length < 4}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-bold text-sm shadow-lg shadow-red-950/40 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>VÀO PHÒNG REALTIME</span>
                </button>

                <button
                  type="button"
                  onClick={handleSolo}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-600 text-stone-200 font-semibold text-sm transition-colors active:scale-95"
                >
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span>ĐẤU SOLO VỚI BOT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* 3 Main Role Portals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Student Card */}
        <div className="group relative rounded-xl border border-stone-800 bg-stone-900/40 p-6 hover:border-amber-600/50 hover:bg-stone-900/70 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-600/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👨‍🎓
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-amber-200">Khu Vực Học Sinh</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Tham gia phòng thi đấu bằng PIN, tranh tài solo với bot thời gian thực, mở khóa thẻ tướng cổ phong và thực hiện nhiệm vụ mỗi ngày.
              </p>
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 pt-2 border-t border-stone-800/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Thi đấu Realtime nhận combo tốc độ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Khám phá 5 chuyên đề liên môn cốt lõi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Sưu tầm Thẻ tướng: Trần Hưng Đạo, Nguyễn Du...</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 flex items-center gap-2">
            <button
              onClick={handleSolo}
              className="flex-1 py-2 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Đấu Solo Ngay</span>
            </button>
            <button
              onClick={onOpenCards}
              className="py-2 px-3 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-colors"
            >
              Thẻ Tướng
            </button>
          </div>
        </div>

        {/* Teacher Card */}
        <div className="group relative rounded-xl border border-stone-800 bg-stone-900/40 p-6 hover:border-emerald-600/50 hover:bg-stone-900/70 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-600/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👨‍🏫
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-emerald-200">Khu Vực Giáo Viên</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Tạo phòng quiz realtime, tùy chỉnh thời gian (5s–60s), điều khiển nhịp độ trận đấu, theo dõi tiến độ học sinh và xuất báo cáo CSV.
              </p>
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 pt-2 border-t border-stone-800/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Tạo phòng với mã PIN 6 số riêng biệt</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Host console điều khiển trận đấu trực tiếp</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Theo dõi câu sai nhiều nhất & độ chính xác</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={onOpenTeacher}
              className="w-full py-2 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <School className="w-3.5 h-3.5" />
              <span>Mở Bảng Điều Khiển Giáo Viên</span>
            </button>
          </div>
        </div>

        {/* Admin AI Card */}
        <div className="group relative rounded-xl border border-stone-800 bg-stone-900/40 p-6 hover:border-red-600/50 hover:bg-stone-900/70 transition-all flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-600/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-red-200">Quản Trị Viên & AI Studio</h3>
              <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                Tự động sinh câu hỏi trắc nghiệm liên môn chuẩn mực với Google Gemini 3.8 Flash, quản lý ngân hàng dữ liệu câu hỏi và thống kê hệ thống.
              </p>
            </div>
            <ul className="text-xs text-stone-300 space-y-1.5 pt-2 border-t border-stone-800/60">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>AI tạo 10 câu liên môn kèm giải thích</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Kiểm duyệt & xuất bản vào ngân hàng đề</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span>Server-authoritative scoring & chống gian lận</span>
              </li>
            </ul>
          </div>

          <div className="pt-6">
            <button
              onClick={onOpenAdmin}
              className="w-full py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Tạo Đề & Quản Lý</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Interdisciplinary Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Chuyên Đề Liên Môn Tiêu Biểu
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Mỗi sự kiện lịch sử đều gắn với một không gian địa lý và một áng văn tuyệt tác.
            </p>
          </div>
          <button
            onClick={onOpenThemes}
            className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>Xem tất cả chuyên đề</span>
            <span>→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTERDISCIPLINARY_THEMES.slice(0, 3).map((theme) => (
            <div
              key={theme.id}
              onClick={() => {
                setSelectedThemeId(theme.id);
                handleSolo();
              }}
              className="cursor-pointer group rounded-xl border border-stone-800 bg-stone-900/40 hover:border-amber-600/40 hover:bg-stone-900/80 p-5 transition-all space-y-3"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/30 text-amber-300 font-semibold">
                  {theme.badge}
                </span>
                <span className="text-stone-500 group-hover:text-amber-400 transition-colors">Vào Đấu ⚔️</span>
              </div>

              <h3 className="font-serif text-base font-bold text-stone-100 group-hover:text-amber-200 transition-colors">
                {theme.title}
              </h3>
              <p className="text-xs text-stone-400 line-clamp-2">
                {theme.description}
              </p>

              <div className="pt-2 border-t border-stone-800/80 space-y-1 text-[11px] text-stone-400">
                <div className="truncate"><span className="text-amber-400 font-medium">Sử:</span> {theme.historyTime}</div>
                <div className="truncate"><span className="text-emerald-400 font-medium">Địa:</span> {theme.geographySpace}</div>
                <div className="truncate"><span className="text-sky-400 font-medium">Văn:</span> {theme.literatureWorks}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
