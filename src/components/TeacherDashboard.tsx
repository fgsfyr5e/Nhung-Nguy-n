import React, { useState } from 'react';
import { School, Plus, Play, Users, Clock, FileDown, CheckCircle, AlertTriangle, BarChart3, BookOpen, Sparkles } from 'lucide-react';
import { INTERDISCIPLINARY_THEMES } from '../data/themes';
import { INITIAL_QUESTIONS } from '../data/questions';
import { Question } from '../types';
import { sounds } from '../utils/sound';

interface TeacherDashboardProps {
  onCreateRealtimeRoom: (config: {
    title: string;
    themeId?: string;
    subject: string;
    grade: number;
    duration: number;
    questionCount: number;
  }) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onCreateRealtimeRoom }) => {
  const [roomTitle, setRoomTitle] = useState('Đấu Trường Liên Môn – Lớp 12A1');
  const [selectedThemeId, setSelectedThemeId] = useState('dien-bien-phu');
  const [selectedGrade, setSelectedGrade] = useState<number>(12);
  const [duration, setDuration] = useState<number>(15);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [subject, setSubject] = useState<string>('interdisciplinary');

  // Simulated student class roster for teacher tracking & analytics
  const [students, setStudents] = useState([
    { id: '1', name: 'Nguyễn Văn An', score: 8.8, accuracy: 88, avgTime: '4.2s', strength: 'Địa lý', weakness: 'Văn học' },
    { id: '2', name: 'Trần Thị Bích', score: 9.4, accuracy: 94, avgTime: '3.8s', strength: 'Văn học', weakness: 'Lịch sử' },
    { id: '3', name: 'Lê Hoàng Cường', score: 7.6, accuracy: 76, avgTime: '6.1s', strength: 'Lịch sử', weakness: 'Địa lý' },
    { id: '4', name: 'Phạm Minh Đức', score: 8.2, accuracy: 82, avgTime: '5.0s', strength: 'Địa lý', weakness: 'Văn học' },
    { id: '5', name: 'Hoàng Mai Hương', score: 9.0, accuracy: 90, avgTime: '4.0s', strength: 'Văn học', weakness: 'Địa lý' },
  ]);

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playClick();
    onCreateRealtimeRoom({
      title: roomTitle,
      themeId: selectedThemeId,
      subject,
      grade: selectedGrade,
      duration,
      questionCount,
    });
  };

  const exportCSV = () => {
    sounds.playClick();
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Tên Học Sinh,Điểm Số,Độ Chính Xác (%),Thời Gian TB,Môn Mạnh,Môn Cần Ôn\n' +
      students
        .map((s) => `"${s.name}",${s.score},${s.accuracy}%,"${s.avgTime}","${s.strength}","${s.weakness}"`)
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_Cao_Dau_Truong_Lop_${selectedGrade}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const timerOptions = [5, 10, 15, 20, 30, 45, 60];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="space-y-1 pb-3 border-b border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          <School className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bảng Điều Khiển Sư Phạm & Tổ Chức Thi Đấu</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Tạo Phòng Thi Đấu Realtime & Quản Lý Lớp Học
        </h2>
        <p className="text-xs sm:text-sm text-stone-400">
          Chủ động thiết lập bộ câu hỏi liên môn, điều phối nhịp độ câu hỏi trực tiếp và thống kê chi tiết năng lực học sinh.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Create Room Form */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-300">
            <Plus className="w-4 h-4" />
            <span>Thiết Lập Trận Đấu Mới</span>
          </div>

          <form onSubmit={handleCreateRoom} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Tên Phòng / Buổi Học
              </label>
              <input
                type="text"
                value={roomTitle}
                onChange={(e) => setRoomTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-white text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Chuyên Đề Liên Môn
                </label>
                <select
                  value={selectedThemeId}
                  onChange={(e) => setSelectedThemeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:border-emerald-500 focus:outline-none"
                >
                  {INTERDISCIPLINARY_THEMES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Khối Lớp
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:border-emerald-500 focus:outline-none"
                >
                  <option value={10}>Lớp 10</option>
                  <option value={11}>Lớp 11</option>
                  <option value={12}>Lớp 12</option>
                </select>
              </div>
            </div>

            {/* Time selection (5s, 10s, 15s, 20s, 30s, 45s, 60s) */}
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-2">
                Thời Gian Mỗi Câu (Đếm ngược Server-authoritative)
              </label>
              <div className="flex flex-wrap gap-2">
                {timerOptions.map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setDuration(sec)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      duration === sec
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                        : 'bg-stone-950 border border-stone-800 text-stone-300 hover:border-emerald-600/50'
                    }`}
                  >
                    ⏱️ {sec}s
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Số Lượng Câu Hỏi
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:border-emerald-500 focus:outline-none"
              >
                <option value={5}>5 câu ngắn (Khởi động)</option>
                <option value={10}>10 câu chuẩn (Trọng tâm)</option>
                <option value={15}>15 câu nâng cao</option>
                <option value={20}>20 câu toàn diện</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-black text-sm shadow-xl shadow-emerald-950/40 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>TẠO MÃ PHÒNG REALTIME & MỞ HOST CONSOLE</span>
            </button>
          </form>
        </div>

        {/* Right: Class Tracking & Student Performance */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-100 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  <span>Theo Dõi Tiến Bộ Học Sinh (Lớp 12A1)</span>
                </h3>
                <span className="text-[11px] text-stone-400">
                  5/5 học sinh đã hoàn thành bài tập liên môn gần nhất
                </span>
              </div>
              <button
                onClick={exportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
                title="Xuất bảng điểm ra file CSV"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Xuất CSV</span>
              </button>
            </div>

            {/* Students table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-300">
                <thead className="bg-stone-950 text-stone-400 font-mono text-[10px] uppercase border-b border-stone-800">
                  <tr>
                    <th className="p-2.5">Học Sinh</th>
                    <th className="p-2.5">Điểm</th>
                    <th className="p-2.5">Độ Chính Xác</th>
                    <th className="p-2.5">Môn Mạnh</th>
                    <th className="p-2.5">Cần Ôn Tập</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-medium">
                  {students.map((st) => (
                    <tr key={st.id} className="hover:bg-stone-950/40">
                      <td className="p-2.5 text-stone-100 font-semibold">{st.name}</td>
                      <td className="p-2.5 font-mono text-emerald-400 font-bold">{st.score}/10</td>
                      <td className="p-2.5 font-mono text-amber-300">{st.accuracy}%</td>
                      <td className="p-2.5 text-emerald-300">{st.strength}</td>
                      <td className="p-2.5 text-red-300">{st.weakness}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 text-xs space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Khuyến nghị giảng dạy tự động:</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                60% học sinh trả lời chậm ở các câu hỏi kết hợp Văn học (tác giả & bối cảnh tác phẩm). Giáo viên nên bổ sung chuyên đề kết nối giữa các thi phẩm kháng chiến và địa bàn Tây Bắc / Trường Sơn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
