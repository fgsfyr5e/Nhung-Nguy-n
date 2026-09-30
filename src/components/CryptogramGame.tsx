import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Clock, CheckCircle, XCircle, RotateCcw, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { CRYPTOGRAM_ITEMS } from '../data/cryptograms';
import { CryptogramItem } from '../types';
import { sounds } from '../utils/sound';

type DecodeStep = 'location' | 'person' | 'work' | 'historyEvent' | 'completed';

export const CryptogramGame: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentItem: CryptogramItem = CRYPTOGRAM_ITEMS[currentIndex];

  const [step, setStep] = useState<DecodeStep>('location');
  const [userChoices, setUserChoices] = useState({
    location: '',
    person: '',
    work: '',
    historyEvent: '',
  });

  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  useEffect(() => {
    if (step === 'completed') return;

    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          sounds.playWrong();
          setFeedback({ isCorrect: false, text: 'Hết thời gian giải mã bước này!' });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [step, currentIndex]);

  const handleSelectOption = (choice: string) => {
    if (feedback) return;

    sounds.playClick();
    let isCorrect = false;
    let nextStep: DecodeStep = 'location';

    if (step === 'location') {
      isCorrect = choice === currentItem.answers.location;
      setUserChoices((prev) => ({ ...prev, location: choice }));
      nextStep = 'person';
    } else if (step === 'person') {
      isCorrect = choice === currentItem.answers.person;
      setUserChoices((prev) => ({ ...prev, person: choice }));
      nextStep = 'work';
    } else if (step === 'work') {
      isCorrect = choice === currentItem.answers.work;
      setUserChoices((prev) => ({ ...prev, work: choice }));
      nextStep = 'historyEvent';
    } else if (step === 'historyEvent') {
      isCorrect = choice === currentItem.answers.historyEvent;
      setUserChoices((prev) => ({ ...prev, historyEvent: choice }));
      nextStep = 'completed';
    }

    if (isCorrect) {
      sounds.playCorrect();
      const points = 500 + Math.round(timeLeft * 15) + streak * 50;
      setScore((s) => s + points);
      setStreak((st) => st + 1);
      setFeedback({ isCorrect: true, text: `✓ Chính xác! +${points} điểm` });

      setTimeout(() => {
        setFeedback(null);
        setStep(nextStep);
        if (nextStep === 'completed') {
          sounds.playVictory();
        }
      }, 1000);
    } else {
      sounds.playWrong();
      setStreak(0);
      setFeedback({ isCorrect: false, text: '✕ Chưa chính xác! Vui lòng thử lại.' });

      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const handleNextCryptogram = () => {
    sounds.playClick();
    const nextIdx = (currentIndex + 1) % CRYPTOGRAM_ITEMS.length;
    setCurrentIndex(nextIdx);
    setStep('location');
    setUserChoices({ location: '', person: '', work: '', historyEvent: '' });
    setFeedback(null);
  };

  const stepLabels = [
    { key: 'location', label: '1. Địa Danh (Không gian)', icon: '🗺️' },
    { key: 'person', label: '2. Nhân Vật (Con người)', icon: '👤' },
    { key: 'work', label: '3. Tác Phẩm (Văn thi)', icon: '📖' },
    { key: 'historyEvent', label: '4. Sự Kiện (Lịch sử)', icon: '🏛️' },
  ];

  const currentOptions = step !== 'completed' ? currentItem.options[step] : [];
  const currentClue = step !== 'completed' ? (
    step === 'location' ? currentItem.clues.geoClue :
    step === 'person' ? currentItem.clues.personClue :
    step === 'work' ? currentItem.clues.workClue : currentItem.clues.historyClue
  ) : '';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chế Độ Mật Mã Văn Thi Realtime</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            Giải Mã Thơ Ca → Không Gian → Con Người → Lịch Sử
          </h2>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 p-2 rounded-lg bg-stone-900 border border-stone-800 text-amber-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold">{score.toLocaleString()} ĐIỂM</span>
          </div>
          {streak >= 2 && (
            <div className="flex items-center gap-1 p-2 rounded-lg bg-orange-950/80 border border-orange-500/40 text-orange-400 font-bold">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>x{streak}</span>
            </div>
          )}
        </div>
      </div>

      {/* Clue Verse Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl space-y-4 text-center">
        <span className="text-[11px] font-mono text-amber-500 uppercase tracking-widest block">
          {currentItem.authorOrSource}
        </span>
        <blockquote className="font-serif text-lg sm:text-2xl text-amber-100 font-semibold leading-relaxed max-w-2xl mx-auto italic">
          {currentItem.verseOrExcerpt}
        </blockquote>
      </div>

      {/* Progress Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {stepLabels.map((st) => {
          const isDone = userChoices[st.key as keyof typeof userChoices] !== '';
          const isCurrent = step === st.key;

          return (
            <div
              key={st.key}
              className={`p-3 rounded-xl border text-xs transition-all ${
                isCurrent
                  ? 'bg-amber-950/80 border-amber-500 text-amber-200 ring-2 ring-amber-500/30'
                  : isDone
                  ? 'bg-emerald-950/50 border-emerald-600/40 text-emerald-200'
                  : 'bg-stone-900/50 border-stone-800 text-stone-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>{st.icon}</span>
                {isDone && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="font-medium block truncate">{st.label}</span>
              {isDone && (
                <span className="text-[10px] text-emerald-300 font-bold block truncate mt-0.5">
                  {userChoices[st.key as keyof typeof userChoices]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Step Question */}
      {step !== 'completed' ? (
        <div className="p-6 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-amber-400">
              Gợi ý manh mối: <span className="text-stone-200 font-normal">{currentClue}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-stone-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{timeLeft}s</span>
            </span>
          </div>

          {feedback && (
            <div className={`p-3 rounded-xl text-center text-xs font-bold animate-fadeIn ${
              feedback.isCorrect ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-red-950 text-red-300 border border-red-500/40'
            }`}>
              {feedback.text}
            </div>
          )}

          {/* 4 Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                className="p-4 rounded-xl bg-stone-950/70 hover:bg-amber-950/40 border border-stone-800 hover:border-amber-600/50 text-left text-sm font-semibold text-stone-200 hover:text-white transition-all active:scale-98"
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Completed Interdisciplinary Summary */
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-amber-950/40 to-stone-950 border border-amber-500/50 shadow-2xl space-y-4 text-center animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-2xl mx-auto">
            🏆
          </div>

          <h3 className="font-serif text-2xl font-bold text-amber-200">
            GIẢI MÃ MẬT THƯ THÀNH CÔNG!
          </h3>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            {currentItem.interdisciplinaryLesson}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleNextCryptogram}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <span>MẬT MÃ TIẾP THEO</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
