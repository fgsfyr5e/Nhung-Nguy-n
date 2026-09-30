import React, { useState } from 'react';
import { BookOpen, MapPin, Landmark, ArrowRight, Play, CheckCircle, Sparkles } from 'lucide-react';
import { INTERDISCIPLINARY_THEMES } from '../data/themes';
import { InterdisciplinaryTheme } from '../types';
import { sounds } from '../utils/sound';

interface ThemeExplorerProps {
  onStartThemeQuiz: (themeId: string) => void;
}

export const ThemeExplorer: React.FC<ThemeExplorerProps> = ({ onStartThemeQuiz }) => {
  const [selectedTheme, setSelectedTheme] = useState<InterdisciplinaryTheme>(INTERDISCIPLINARY_THEMES[0]);

  const handleStart = (themeId: string) => {
    sounds.playClick();
    onStartThemeQuiz(themeId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Header Description */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Trọng Tâm Tri Thức: Học Gộp – Liên Môn</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
          Chuyên Đề Liên Môn Lịch Sử • Địa Lý • Ngữ Văn
        </h2>
        <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
          Không học các môn biệt lập rời rạc. Mỗi trang sử oai hùng đều gắn liền với không gian non sông hiểm trở và hồn thiêng sông núi qua từng tác phẩm nghệ thuật.
        </p>
      </div>

      {/* Triad Architecture Visualization */}
      <div className="p-4 sm:p-6 rounded-2xl bg-stone-900/80 border border-amber-600/30 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="p-4 rounded-xl bg-stone-950/70 border border-amber-600/30 space-y-2">
          <div className="w-10 h-10 rounded-full bg-amber-950 flex items-center justify-center text-xl mx-auto border border-amber-500/40">
            🏛️
          </div>
          <span className="font-serif font-bold text-amber-300 text-sm block">1. LỊCH SỬ</span>
          <span className="text-xs text-amber-400 font-mono font-semibold block">THỜI GIAN & SỰ KIỆN</span>
          <p className="text-[11px] text-stone-400">
            Khi nào diễn ra? Bối cảnh thời đại, nguyên nhân, diễn biến và ý nghĩa thời đại.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-stone-950/70 border border-emerald-600/30 space-y-2">
          <div className="w-10 h-10 rounded-full bg-emerald-950 flex items-center justify-center text-xl mx-auto border border-emerald-500/40">
            🗺️
          </div>
          <span className="font-serif font-bold text-emerald-300 text-sm block">2. ĐỊA LÝ</span>
          <span className="text-xs text-emerald-400 font-mono font-semibold block">KHÔNG GIAN & VỊ THẾ</span>
          <p className="text-[11px] text-stone-400">
            Ở đâu? Địa hình, thủy triều, hiểm trở đồi núi sông ngòi, khí hậu và tài nguyên.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-stone-950/70 border border-sky-600/30 space-y-2">
          <div className="w-10 h-10 rounded-full bg-sky-950 flex items-center justify-center text-xl mx-auto border border-sky-500/40">
            📖
          </div>
          <span className="font-serif font-bold text-sky-300 text-sm block">3. VĂN HỌC</span>
          <span className="text-xs text-sky-400 font-mono font-semibold block">CON NGƯỜI & TÁC PHẨM</span>
          <p className="text-[11px] text-stone-400">
            Ai là người kiến tạo? Thơ ca, áng văn, thiên tùy bút khắc họa tâm hồn dân tộc.
          </p>
        </div>
      </div>

      {/* Main Theme Detail & Selectors */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Theme list */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block px-1">
            Chọn Chuyên Đề Khám Phá:
          </span>
          <div className="space-y-2">
            {INTERDISCIPLINARY_THEMES.map((th) => {
              const isSelected = th.id === selectedTheme.id;
              return (
                <div
                  key={th.id}
                  onClick={() => {
                    sounds.playClick();
                    setSelectedTheme(th);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-500 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="px-2 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-[10px]">
                      {th.badge}
                    </span>
                    {isSelected && (
                      <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                        <span>Đang chọn</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-serif font-bold text-stone-100 text-sm sm:text-base">
                    {th.title}
                  </h4>
                  <p className="text-xs text-stone-400 line-clamp-1 mt-0.5">
                    {th.subtitle}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Deep Dive & Action to Play */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded bg-amber-950 border border-amber-600/40 text-amber-300 text-xs font-semibold">
              {selectedTheme.badge}
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              {selectedTheme.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 italic">
              “{selectedTheme.subtitle}”
            </p>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed pt-1">
              {selectedTheme.description}
            </p>
          </div>

          {/* Triad Breakdown */}
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-stone-950/80 border border-amber-600/30 space-y-1.5">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                <Landmark className="w-4 h-4" />
                <span>🏛️ Lịch Sử · Thời Gian:</span>
              </span>
              <p className="text-xs text-stone-300">
                {selectedTheme.historyTime}
              </p>
              <div className="text-[11px] text-stone-400 pt-1">
                <strong>Nhân vật lịch sử tiêu biểu:</strong> {selectedTheme.keyFigures.join(', ')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/80 border border-emerald-600/30 space-y-1.5">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                <MapPin className="w-4 h-4" />
                <span>🗺️ Địa Lý · Không Gian:</span>
              </span>
              <p className="text-xs text-stone-300">
                {selectedTheme.geographySpace}
              </p>
              <div className="text-[11px] text-stone-400 pt-1">
                <strong>Địa danh chiến lược:</strong> {selectedTheme.keyLocations.join(', ')}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-950/80 border border-sky-600/30 space-y-1.5">
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5 uppercase">
                <BookOpen className="w-4 h-4" />
                <span>📖 Ngữ Văn · Tác Phẩm & Con Người:</span>
              </span>
              <p className="text-xs text-stone-300">
                {selectedTheme.literatureWorks}
              </p>
              <div className="space-y-1 pt-1.5">
                {selectedTheme.keyLiteraryTexts.map((txt, idx) => (
                  <div key={idx} className="p-2 rounded bg-stone-900 border border-stone-800 text-[11px] text-stone-300 italic font-serif">
                    {txt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleStart(selectedTheme.id)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-bold text-sm shadow-xl shadow-red-950/40 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>VÀO ĐẤU TRƯỜNG CHUYÊN ĐỀ NÀY ⚔️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
