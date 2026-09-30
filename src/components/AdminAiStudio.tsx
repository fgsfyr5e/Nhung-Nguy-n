import React, { useState } from 'react';
import { Sparkles, Shield, Database, Plus, CheckCircle, Trash2, Edit3, Send, RefreshCw, AlertCircle } from 'lucide-react';
import { Question } from '../types';
import { INITIAL_QUESTIONS } from '../data/questions';
import { sounds } from '../utils/sound';

export const AdminAiStudio: React.FC = () => {
  const [topic, setTopic] = useState('Chiến thắng Điện Biên Phủ 1954');
  const [grade, setGrade] = useState<number>(12);
  const [count, setCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<string>('medium');
  const [subjectType, setSubjectType] = useState<string>('interdisciplinary');

  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [questionBank, setQuestionBank] = useState<Question[]>(INITIAL_QUESTIONS);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    sounds.playClick();
    setLoading(true);
    setNotification(null);

    try {
      const response = await fetch('/api/gemini/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          grade,
          count,
          difficulty,
          subjectType,
        }),
      });

      const data = await response.json();
      if (data.success && Array.isArray(data.questions)) {
        sounds.playVictory();
        setGeneratedQuestions(data.questions);
        setNotification({
          type: 'success',
          message: `Gemini AI đã tạo thành công ${data.questions.length} câu hỏi liên môn!`,
        });
      } else {
        throw new Error(data.message || 'Không thể tạo câu hỏi');
      }
    } catch (err: unknown) {
      console.error(err);
      sounds.playWrong();
      setNotification({
        type: 'error',
        message: 'Lỗi khi gọi Gemini AI. Vui lòng kiểm tra API key hoặc thử lại sau!',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveQuestion = (q: Question) => {
    sounds.playClick();
    setQuestionBank((prev) => [q, ...prev]);
    setGeneratedQuestions((prev) => prev.filter((item) => item.id !== q.id));
    setNotification({
      type: 'success',
      message: 'Đã duyệt và xuất bản câu hỏi vào Ngân Hàng Đề!',
    });
  };

  const handleDeleteFromBank = (id: string) => {
    sounds.playClick();
    setQuestionBank((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn">
      {/* Title */}
      <div className="space-y-1 pb-3 border-b border-stone-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-600/40 text-red-300 text-xs font-semibold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5 text-red-400" />
          <span>Hệ Thống Quản Trị & Gemini AI Engine</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
          Tạo Câu Hỏi Bằng AI & Kiểm Duyệt Ngân Hàng Đề
        </h2>
        <p className="text-xs sm:text-sm text-stone-400">
          Tự động sinh câu hỏi trắc nghiệm liên môn Sử - Địa - Văn chuẩn kiến thức theo sách giáo khoa Việt Nam bằng mô hình Gemini 3.8 Flash.
        </p>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn ${
            notification.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/50 text-emerald-200'
              : 'bg-red-950/80 border border-red-500/50 text-red-200'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-stone-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: AI Generation Studio */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-sm font-bold text-red-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Tạo Câu Hỏi Tự Động (Gemini 3.8 Flash)</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-400 mb-1">
                Chủ Đề Yêu Cầu
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="VD: Chiến thắng Bạch Đằng 1288, Sông Hương và văn học Huế..."
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-stone-950 border border-stone-700 text-white text-sm focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Khối Lớp
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value={10}>Lớp 10</option>
                  <option value={11}>Lớp 11</option>
                  <option value={12}>Lớp 12</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Độ Khó
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="easy">Dễ (Nhận biết)</option>
                  <option value="medium">Trung bình (Thông hiểu)</option>
                  <option value="hard">Khó (Vận dụng cao)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Phân Loại
                </label>
                <select
                  value={subjectType}
                  onChange={(e) => setSubjectType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="interdisciplinary">Liên Môn Sử - Địa - Văn</option>
                  <option value="history">Lịch Sử</option>
                  <option value="geography">Địa Lý</option>
                  <option value="literature">Văn Học</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-400 mb-1">
                  Số Câu Sinh Ra
                </label>
                <select
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-stone-950 border border-stone-700 text-stone-200 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value={2}>2 câu</option>
                  <option value={3}>3 câu</option>
                  <option value={5}>5 câu</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-red-950/40 transition-transform active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>GEMINI ĐANG BIÊN SOẠN CÂU HỎI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>KÍCH HOẠT AI TẠO ĐỀ NGAY</span>
                </>
              )}
            </button>
          </form>

          {/* Staging Area for AI Questions */}
          {generatedQuestions.length > 0 && (
            <div className="pt-4 border-t border-stone-800 space-y-3">
              <span className="text-xs font-bold text-amber-300 block">
                Câu Hỏi Đang Chờ Admin Duyệt ({generatedQuestions.length}):
              </span>

              <div className="space-y-3">
                {generatedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-stone-950/90 border border-amber-600/40 space-y-2 text-xs"
                  >
                    <span className="font-bold text-stone-200 block">{q.question}</span>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-stone-400">
                      {q.options.map((opt, i) => (
                        <div
                          key={i}
                          className={i === q.correctIndex ? 'text-emerald-400 font-bold' : ''}
                        >
                          {['A', 'B', 'C', 'D'][i]}. {opt}
                        </div>
                      ))}
                    </div>
                    <div className="text-[11px] text-stone-400 border-t border-stone-800 pt-1">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleApproveQuestion(q)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Duyệt & Xuất Bản</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Question Bank Manager */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  <span>Ngân Hàng Câu Hỏi Hệ Thống ({questionBank.length})</span>
                </h3>
                <span className="text-[11px] text-stone-400">
                  Dữ liệu đã được kiểm duyệt và sẵn sàng cho các trận đấu
                </span>
              </div>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto no-scrollbar">
              {questionBank.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-300">
                      #{idx + 1} · {q.subject === 'interdisciplinary' ? '🏛️ Liên môn' : q.subject} · Lớp {q.grade}
                    </span>
                    <button
                      onClick={() => handleDeleteFromBank(q.id)}
                      className="text-stone-500 hover:text-red-400 p-1"
                      title="Xóa câu hỏi khỏi ngân hàng"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-stone-200 font-medium">{q.question}</p>

                  <div className="text-[11px] text-emerald-400">
                    ✓ Đáp án: {q.options[q.correctIndex]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
