import React, { useState } from 'react';
import { Award, Sparkles, Shield, BookOpen, MapPin, Calendar, Star, Info } from 'lucide-react';
import { CHARACTER_CARDS } from '../data/cards';
import { CharacterCard } from '../types';
import { sounds } from '../utils/sound';

export const CharacterCardsView: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<CharacterCard | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredCards = CHARACTER_CARDS.filter((c) => {
    if (filterType === 'all') return true;
    return c.type === filterType;
  });

  const getRarityBadge = (rarity: CharacterCard['rarity']) => {
    switch (rarity) {
      case 'legendary':
        return { label: 'Huyền Thoại', bg: 'bg-amber-950/80 border-amber-500 text-amber-300' };
      case 'epic':
        return { label: 'Sử Thi', bg: 'bg-purple-950/80 border-purple-500 text-purple-300' };
      case 'rare':
        return { label: 'Hiếm', bg: 'bg-blue-950/80 border-blue-500 text-blue-300' };
      default:
        return { label: 'Thường', bg: 'bg-stone-800 border-stone-600 text-stone-300' };
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Bộ Sưu Tập Danh Nhân & Tác Phẩm Cổ Phong</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Thẻ Tướng Cổ Phong – Hào Khí Ngàn Năm
          </h2>
          <p className="text-xs sm:text-sm text-stone-400">
            Mở khóa các vị tướng quân lừng lẫy, đại thi hào kiệt xuất và địa danh thiêng liêng qua các trận đấu quiz realtime.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-xl border border-stone-800">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'all' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Tất cả ({CHARACTER_CARDS.length})
          </button>
          <button
            onClick={() => setFilterType('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'history' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Lịch Sử
          </button>
          <button
            onClick={() => setFilterType('literature')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filterType === 'literature' ? 'bg-amber-600 text-white font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Văn Học
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredCards.map((card) => {
          const rarity = getRarityBadge(card.rarity);

          return (
            <div
              key={card.id}
              onClick={() => {
                sounds.playClick();
                setSelectedCard(card);
              }}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-stone-800 bg-stone-900/60 hover:border-amber-500/60 hover:bg-stone-900 transition-all duration-300 shadow-xl hover:-translate-y-1 flex flex-col"
            >
              {/* Card Portrait Art */}
              <div className="relative aspect-square w-full overflow-hidden bg-stone-950">
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />

                {/* Top Rarity Badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${rarity.bg}`}>
                    {rarity.label}
                  </span>
                </div>

                {/* Bottom Card Title Overlay */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="text-[10px] text-amber-400 font-mono block truncate">
                    {card.title}
                  </span>
                  <h4 className="font-serif text-base font-bold text-white leading-tight">
                    {card.name}
                  </h4>
                </div>
              </div>

              {/* Card Meta & Stats */}
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1 text-xs text-stone-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{card.era}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{card.location}</span>
                  </div>
                </div>

                {/* Mini Stat Bars */}
                <div className="pt-2 border-t border-stone-800/80 grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1 rounded bg-stone-950/70 border border-stone-800">
                    <span className="text-amber-400 font-mono block font-bold">{card.stats.historySkill}</span>
                    <span className="text-stone-500">Sử</span>
                  </div>
                  <div className="p-1 rounded bg-stone-950/70 border border-stone-800">
                    <span className="text-emerald-400 font-mono block font-bold">{card.stats.geoSkill}</span>
                    <span className="text-stone-500">Địa</span>
                  </div>
                  <div className="p-1 rounded bg-stone-950/70 border border-stone-800">
                    <span className="text-sky-400 font-mono block font-bold">{card.stats.litSkill}</span>
                    <span className="text-stone-500">Văn</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-stone-900 border border-amber-500/50 p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-lg p-1"
            >
              ✕
            </button>

            <div className="flex items-start gap-4">
              <img
                src={selectedCard.imageUrl}
                alt={selectedCard.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover border-2 border-amber-500 shadow-md shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1">
                <span className="text-xs text-amber-400 font-mono font-semibold">
                  {selectedCard.title}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                  {selectedCard.name}
                </h3>
                <div className="text-xs text-stone-400 space-y-0.5">
                  <div><strong>Thời kỳ:</strong> {selectedCard.era}</div>
                  <div><strong>Địa danh:</strong> {selectedCard.location}</div>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/30 text-xs text-amber-200 italic font-serif leading-relaxed">
              {selectedCard.quote}
            </div>

            <div className="space-y-1 text-xs text-stone-300">
              <strong className="text-stone-100 block">Tiểu sử & Đóng góp văn hóa:</strong>
              <p className="leading-relaxed text-stone-400">
                {selectedCard.bio}
              </p>
            </div>

            {/* Triad Skill Radar / Stats */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-800 text-center">
              <div className="p-2 rounded-lg bg-stone-950 border border-amber-600/20">
                <span className="text-xs text-stone-400 block">Chỉ số Lịch Sử</span>
                <span className="font-mono text-base font-bold text-amber-300">{selectedCard.stats.historySkill}/100</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-950 border border-emerald-600/20">
                <span className="text-xs text-stone-400 block">Chỉ số Địa Lý</span>
                <span className="font-mono text-base font-bold text-emerald-300">{selectedCard.stats.geoSkill}/100</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-950 border border-sky-600/20">
                <span className="text-xs text-stone-400 block">Chỉ số Ngữ Văn</span>
                <span className="font-mono text-base font-bold text-sky-300">{selectedCard.stats.litSkill}/100</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
