import React from 'react';
import { GraduationCap, School, Shield, Sparkles, ArrowRight } from 'lucide-react';
import { sounds } from '../utils/sound';

interface RoleSelectScreenProps {
  onSelectRole: (role: 'student' | 'teacher' | 'admin') => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({ onSelectRole }) => {
  const handleSelect = (role: 'student' | 'teacher' | 'admin') => {
    sounds.playClick();
    onSelectRole(role);
  };

  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center py-6 px-4 animate-fadeIn">
      <div className="w-full max-w-4xl space-y-8 text-center">
        {/* Main Branding Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-semibold uppercase tracking-wider shadow-lg shadow-amber-950/40">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Nền tảng Quiz Realtime Liên Môn Đầu Tiên tại Việt Nam</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            🏯 ĐẤU TRƯỜNG LIÊN MÔN
          </h1>

          <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-red-400 uppercase tracking-wide">
            SỬ • ĐỊA • VĂN
          </h2>

          <p className="font-serif text-base sm:text-xl text-amber-200/90 font-medium italic">
            “Học – Chơi – Thi đấu – Chinh phục tri thức”
          </p>

          <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto pt-1">
            Vui lòng chọn vai trò để bắt đầu trải nghiệm đấu trường tri thức thời gian thực.
          </p>
        </div>

        {/* 3 Prominent Modes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-2">
          {/* 1. Học sinh */}
          <div
            onClick={() => handleSelect('student')}
            className="group cursor-pointer rounded-2xl border-2 border-stone-800 bg-stone-900/60 hover:border-amber-500/80 hover:bg-stone-900/90 p-6 sm:p-7 transition-all duration-300 shadow-xl hover:-translate-y-1.5 flex flex-col justify-between space-y-6 ring-1 ring-amber-500/0 hover:ring-amber-500/20"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-md shadow-amber-950/50">
                👨‍🎓
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-amber-500 font-semibold block">
                  Chế Độ 01
                </span>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-amber-300 transition-colors">
                  HỌC SINH
                </h3>
                <p className="text-xs text-stone-300 mt-1.5 font-medium leading-relaxed">
                  Tham gia quiz và học tập
                </p>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-800/80 pt-3">
                Nhập mã PIN 6 số để vào phòng thi đấu của lớp, hoặc chơi solo rèn luyện phản xạ với đối thủ thời gian thực.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300">
              <span>Vào Đấu Trường Học Sinh</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Giáo viên */}
          <div
            onClick={() => handleSelect('teacher')}
            className="group cursor-pointer rounded-2xl border-2 border-stone-800 bg-stone-900/60 hover:border-emerald-500/80 hover:bg-stone-900/90 p-6 sm:p-7 transition-all duration-300 shadow-xl hover:-translate-y-1.5 flex flex-col justify-between space-y-6 ring-1 ring-emerald-500/0 hover:ring-emerald-500/20"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-md shadow-emerald-950/50">
                👨‍🏫
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 font-semibold block">
                  Chế Độ 02
                </span>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                  GIÁO VIÊN
                </h3>
                <p className="text-xs text-stone-300 mt-1.5 font-medium leading-relaxed">
                  Tạo và điều khiển trận đấu
                </p>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-800/80 pt-3">
                Thiết lập phòng thi đấu với mã PIN riêng, tùy chỉnh thời gian (5s–60s), điều khiển trận đấu và xuất báo cáo CSV.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
              <span>Bảng Điều Khiển Giáo Viên</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Admin */}
          <div
            onClick={() => handleSelect('admin')}
            className="group cursor-pointer rounded-2xl border-2 border-stone-800 bg-stone-900/60 hover:border-red-500/80 hover:bg-stone-900/90 p-6 sm:p-7 transition-all duration-300 shadow-xl hover:-translate-y-1.5 flex flex-col justify-between space-y-6 ring-1 ring-red-500/0 hover:ring-red-500/20"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-md shadow-red-950/50">
                🛡️
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-red-500 font-semibold block">
                  Chế Độ 03
                </span>
                <h3 className="font-serif text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                  ADMIN
                </h3>
                <p className="text-xs text-stone-300 mt-1.5 font-medium leading-relaxed">
                  Quản trị hệ thống và nội dung
                </p>
              </div>
              <p className="text-xs text-stone-400 leading-relaxed border-t border-stone-800/80 pt-3">
                Biên soạn câu hỏi chuẩn với Gemini 3.8 Flash, quản lý ngân hàng câu hỏi và giám sát hệ thống server-authoritative.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 group-hover:text-red-300">
              <span>Bảng Quản Trị & Gemini AI</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
