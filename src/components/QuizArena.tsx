import React, { useState, useEffect, useRef, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, Clock, Zap, Flame, Award, ChevronRight, Share2, 
  RotateCcw, Sparkles, BookOpen, MapPin, Landmark, HelpCircle, 
  CheckCircle, XCircle, ArrowUpRight, ArrowDownRight, Eye, ShieldAlert,
  Users, KeyRound, AlertCircle
} from 'lucide-react';
import { RoomState, Player, Question, PlayerPowerUps } from '../types';
import { DeviceInfo } from '../hooks/useDeviceDetect';
import { sounds } from '../utils/sound';

interface QuizArenaProps {
  roomState: RoomState;
  userId: string;
  deviceInfo: DeviceInfo;
  onSubmitAnswer: (optionIndex: number, powerUpUsed?: string) => void;
  onTimeExpired?: () => void;
  onStartGame: () => void;
  onNextQuestion: () => void;
  onLeaveRoom: () => void;
}

export const QuizArena: React.FC<QuizArenaProps> = ({
  roomState,
  userId,
  deviceInfo,
  onSubmitAnswer,
  onTimeExpired,
  onStartGame,
  onNextQuestion,
  onLeaveRoom,
}) => {
  const { status, questions, currentQuestionIndex, questionStartTime, questionDuration, players, code, hostId, countdownValue } = roomState;
  const isHost = userId === hostId;
  const currentQ: Question | undefined = questions[currentQuestionIndex];
  const currentPlayer: Player | undefined = players[userId];

  // Active power-ups state for current question
  const [activePowerUp, setActivePowerUp] = useState<string | null>(null);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [showHistoryHint, setShowHistoryHint] = useState<boolean>(false);
  const [showMobileLeaderboardModal, setShowMobileLeaderboardModal] = useState<boolean>(false);

  // Remaining time in milliseconds for smooth animation
  const [timeLeft, setTimeLeft] = useState<number>(questionDuration);
  const [previousRanks, setPreviousRanks] = useState<Record<string, number>>({});
  const [rankSurpassNotice, setRankSurpassNotice] = useState<string | null>(null);

  // Confetti trigger once on finished
  const confettiFiredRef = useRef<boolean>(false);

  // Sort players for leaderboard
  const sortedPlayers = useMemo(() => {
    return Object.values(players).sort((a, b) => b.score - a.score);
  }, [players]);

  const currentRank = useMemo(() => {
    return sortedPlayers.findIndex((p) => p.id === userId) + 1;
  }, [sortedPlayers, userId]);

  // Track rank surpass animation
  useEffect(() => {
    if (status === 'LEADERBOARD') {
      const oldRank = previousRanks[userId] || currentRank;
      if (oldRank > currentRank && currentRank > 0) {
        const surpassedPlayer = sortedPlayers[currentRank]; // The one who used to be ahead
        if (surpassedPlayer && surpassedPlayer.id !== userId) {
          setRankSurpassNotice(`⚡ BẠN VỪA VƯỢT QUA ${surpassedPlayer.name.toUpperCase()}!`);
          setTimeout(() => setRankSurpassNotice(null), 4000);
        }
      }
      // Save current ranks for next round
      const newRanks: Record<string, number> = {};
      sortedPlayers.forEach((p, idx) => {
        newRanks[p.id] = idx + 1;
      });
      setPreviousRanks(newRanks);
    }
  }, [status, currentRank, sortedPlayers, userId]);

  // Timer loop for QUESTION status
  useEffect(() => {
    if (status !== 'QUESTION' || !questionStartTime) return;

    // Reset powerups state for new question
    setActivePowerUp(null);
    setEliminatedOptions([]);
    setShowHistoryHint(false);

    const updateTimer = () => {
      const elapsed = (Date.now() - questionStartTime) / 1000;
      const remaining = Math.max(0, questionDuration - elapsed);
      setTimeLeft(remaining);

      // Warning tick sound at last 3 seconds
      if (remaining <= 3.2 && remaining > 0.5 && Math.floor(remaining) !== Math.floor(remaining + 0.1)) {
        sounds.playCountdownTick();
      }

      if (remaining <= 0) {
        onTimeExpired?.();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 50);

    return () => clearInterval(interval);
  }, [status, questionStartTime, questionDuration, currentQuestionIndex]);

  // Confetti on finished state
  useEffect(() => {
    if (status === 'FINISHED' && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      sounds.playVictory();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
    if (status !== 'FINISHED') {
      confettiFiredRef.current = false;
    }
  }, [status]);

  // Keyboard shortcut listener for Desktop (A, B, C, D or 1, 2, 3, 4)
  useEffect(() => {
    if (status !== 'QUESTION' || !deviceInfo.hasKeyboard) return;
    if (currentPlayer?.lastAnswer && currentPlayer.lastAnswer.questionId === currentQ?.id) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      const key = e.key.toUpperCase();
      let index = -1;
      if (key === 'A' || key === '1') index = 0;
      if (key === 'B' || key === '2') index = 1;
      if (key === 'C' || key === '3') index = 2;
      if (key === 'D' || key === '4') index = 3;

      if (index !== -1 && !eliminatedOptions.includes(index)) {
        handleOptionClick(index);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, deviceInfo.hasKeyboard, currentPlayer, currentQ, eliminatedOptions]);

  const handleOptionClick = (index: number) => {
    if (!currentQ || !currentPlayer) return;
    if (currentPlayer.lastAnswer?.questionId === currentQ.id) return;
    if (eliminatedOptions.includes(index)) return;

    sounds.playClick();
    onSubmitAnswer(index, activePowerUp || undefined);
  };

  // Power-up handlers
  const usePowerUp = (type: keyof PlayerPowerUps) => {
    if (!currentPlayer || currentPlayer.powerUps[type] <= 0) return;
    if (activePowerUp === type) return;

    sounds.playPowerup();

    if (type === 'geo5050') {
      // Eliminate 2 wrong choices
      if (!currentQ) return;
      const wrongIndices = [0, 1, 2, 3].filter((idx) => idx !== currentQ.correctIndex);
      // Pick 2 random wrong indices
      const shuffled = wrongIndices.sort(() => 0.5 - Math.random());
      setEliminatedOptions(shuffled.slice(0, 2));
      setActivePowerUp('geo5050');
    } else if (type === 'historyHint') {
      setShowHistoryHint(true);
      setActivePowerUp('historyHint');
    } else if (type === 'literature2x') {
      setActivePowerUp('literature2x');
    } else if (type === 'speedBoost') {
      setActivePowerUp('speedBoost');
    }

    // Decrement player's power-up
    currentPlayer.powerUps[type] -= 1;
  };

  // -------------------------------------------------------------
  // 1. LOBBY VIEW
  // -------------------------------------------------------------
  if (status === 'LOBBY') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-amber-600/40 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Phòng Chờ Trực Tuyến</span>
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
              {roomState.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              Chia sẻ mã PIN bên dưới để bạn bè hoặc cả lớp tham gia cùng một trận đấu!
            </p>
          </div>

          {/* Giant PIN Badge */}
          <div className="inline-block p-4 sm:p-6 rounded-2xl bg-stone-900 border-2 border-amber-500 shadow-xl shadow-amber-950/50">
            <span className="block text-xs uppercase tracking-widest text-amber-400 font-semibold mb-1">
              Mã Phòng PIN
            </span>
            <span className="font-mono text-4xl sm:text-6xl font-black text-amber-300 tracking-wider">
              {code}
            </span>
          </div>

          {/* Player list */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Người chơi đã sẵn sàng ({Object.keys(players).length})</span>
              </span>
              <span>{isHost ? 'Bạn là Chủ Phòng' : 'Đang chờ Chủ phòng bắt đầu...'}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2 max-h-56 overflow-y-auto no-scrollbar">
              {Object.values(players).map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                    p.id === userId
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                      : 'bg-stone-900/60 border-stone-800 text-stone-200'
                  }`}
                >
                  <span className="text-xl">{p.avatar || '👤'}</span>
                  <div className="truncate text-left text-xs">
                    <span className="block font-semibold truncate">{p.name}</span>
                    {p.isHost && (
                      <span className="text-[10px] text-amber-400 font-mono">CHỦ PHÒNG</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {isHost ? (
              <button
                onClick={onStartGame}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-black text-base shadow-xl shadow-red-950/60 transition-transform active:scale-95 flex items-center justify-center gap-2"
              >
                <span>⚔️ BẮT ĐẦU TRẬN ĐẤU</span>
              </button>
            ) : (
              <div className="text-xs text-amber-400/90 font-medium py-3 animate-pulse">
                ⏳ Chủ phòng đang chuẩn bị trận đấu... Hãy sẵn sàng tinh thần!
              </div>
            )}

            <button
              onClick={onLeaveRoom}
              className="px-4 py-2.5 text-xs text-stone-400 hover:text-stone-200 transition-colors"
            >
              Rời Phòng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. COUNTDOWN VIEW
  // -------------------------------------------------------------
  if (status === 'COUNTDOWN') {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
          CHUẨN BỊ CHIẾN ĐẤU
        </span>
        <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-amber-500 bg-stone-900/90 flex items-center justify-center shadow-2xl shadow-red-950/60 animate-pulse">
          <span className="font-serif text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-red-500">
            {countdownValue && countdownValue > 0 ? countdownValue : '⚔️'}
          </span>
        </div>
        <p className="font-serif text-xl sm:text-2xl text-stone-300 font-bold">
          {countdownValue && countdownValue > 0 ? 'Bắt đầu sau giây lát...' : 'ĐẤU TRƯỜNG KHAI HỎA!'}
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. QUESTION VIEW
  // -------------------------------------------------------------
  if (status === 'QUESTION' && currentQ) {
    const hasAnswered = Boolean(currentPlayer?.lastAnswer && currentPlayer.lastAnswer.questionId === currentQ.id);
    const selectedIndex = currentPlayer?.lastAnswer?.optionIndex;
    const timePercentage = Math.max(0, Math.min(100, (timeLeft / questionDuration) * 100));
    const isUrgent = timeLeft <= 4.0;

    // Distinct Quiz Choice Colors (Kahoot & Quizizz style aesthetic with Vietnamese lacquer tones)
    const choiceColors = [
      { bg: 'bg-red-700/80 hover:bg-red-600', border: 'border-red-500/50', key: 'A', symbol: '▲' },
      { bg: 'bg-blue-700/80 hover:bg-blue-600', border: 'border-blue-500/50', key: 'B', symbol: '◆' },
      { bg: 'bg-amber-600/80 hover:bg-amber-500', border: 'border-amber-400/50', key: 'C', symbol: '●' },
      { bg: 'bg-emerald-700/80 hover:bg-emerald-600', border: 'border-emerald-500/50', key: 'D', symbol: '■' },
    ];

    return (
      <div className="w-full max-w-6xl mx-auto space-y-4">
        {/* Top Progress & Timer Bar */}
        <div className="p-3 sm:p-4 rounded-xl bg-stone-900/80 border border-stone-800 shadow-md space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-300">
                CÂU {String(currentQuestionIndex + 1).padStart(2, '0')} / {String(questions.length).padStart(2, '0')}
              </span>
              <span className="text-stone-500">·</span>
              <span className="text-xs text-stone-400 uppercase font-medium">
                {currentQ.subject === 'interdisciplinary' ? '🏛️ Liên Môn Sử - Địa - Văn' :
                 currentQ.subject === 'history' ? '🏛️ Lịch Sử' :
                 currentQ.subject === 'geography' ? '🗺️ Địa Lý' : '📖 Văn Học'}
              </span>
            </div>

            {/* Live Timer Clock */}
            <div className={`flex items-center gap-1.5 font-mono text-sm sm:text-base font-bold ${
              isUrgent ? 'text-red-400 animate-pulse' : 'text-amber-300'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{timeLeft.toFixed(1)}s</span>
            </div>
          </div>

          {/* Progress bar with color shift */}
          <div className="w-full h-2.5 rounded-full bg-stone-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-100 ease-linear ${
                isUrgent ? 'bg-gradient-to-r from-red-600 to-orange-500' : 'bg-gradient-to-r from-amber-500 to-emerald-500'
              }`}
              style={{ width: `${timePercentage}%` }}
            />
          </div>
        </div>

        {/* Question Stage & Layout */}
        <div className={`grid gap-4 ${
          deviceInfo.isDesktop ? 'grid-cols-12' : 'grid-cols-1'
        }`}>
          {/* Main Question & Answer Zone */}
          <div className={deviceInfo.isDesktop ? 'col-span-8 space-y-4' : 'w-full space-y-4'}>
            {/* Question Text Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-xl min-h-[160px] sm:min-h-[200px] flex flex-col justify-center items-center text-center space-y-3">
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-white leading-relaxed max-w-3xl">
                {currentQ.question}
              </h2>

              {showHistoryHint && (
                <div className="mt-2 p-2.5 rounded-lg bg-amber-950/70 border border-amber-600/40 text-xs text-amber-200 animate-fadeIn">
                  💡 <strong>Gợi ý Lịch sử:</strong> {currentQ.historyLink}
                </div>
              )}
            </div>

            {/* Answer Options: Responsive Grid */}
            <div className={`grid gap-3 sm:gap-4 ${
              deviceInfo.isDesktop || deviceInfo.isTablet || (deviceInfo.isMobile && deviceInfo.isLandscape)
                ? 'grid-cols-2' // 2x2 grid
                : 'grid-cols-1' // 1-column mobile-first touch buttons
            }`}>
              {currentQ.options.map((opt, idx) => {
                const color = choiceColors[idx];
                const isEliminated = eliminatedOptions.includes(idx);
                const isSelected = selectedIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={hasAnswered || isEliminated}
                    className={`relative p-4 sm:p-5 rounded-xl border text-left transition-all duration-150 flex items-center justify-between group ${
                      isEliminated
                        ? 'opacity-20 line-through cursor-not-allowed bg-stone-900 border-stone-800'
                        : isSelected
                        ? 'ring-4 ring-amber-400 bg-amber-900/80 border-amber-400 scale-[1.02]'
                        : hasAnswered
                        ? 'opacity-60 cursor-not-allowed bg-stone-900 border-stone-800'
                        : `${color.bg} ${color.border} shadow-lg active:scale-98 cursor-pointer`
                    }`}
                  >
                    <div className="flex items-center gap-3 pr-2">
                      <span className="w-8 h-8 rounded-lg bg-black/30 border border-white/20 flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {deviceInfo.hasKeyboard ? color.key : color.symbol}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-white leading-snug">
                        {opt}
                      </span>
                    </div>

                    {deviceInfo.hasKeyboard && (
                      <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-black/40 text-[10px] font-mono text-stone-300">
                        Phím {color.key}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Power-up Bar */}
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium text-stone-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Bùa Lợi Trợ Lực:</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => usePowerUp('literature2x')}
                  disabled={hasAnswered || (currentPlayer?.powerUps.literature2x || 0) <= 0 || activePowerUp === 'literature2x'}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-700 text-xs text-amber-300 font-medium transition-colors"
                  title="Nhân đôi điểm câu Văn học"
                >
                  📖 Văn Học x2 ({currentPlayer?.powerUps.literature2x || 0})
                </button>

                <button
                  onClick={() => usePowerUp('geo5050')}
                  disabled={hasAnswered || (currentPlayer?.powerUps.geo5050 || 0) <= 0 || eliminatedOptions.length > 0}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-700 text-xs text-emerald-300 font-medium transition-colors"
                  title="Địa Lý 50:50 (Loại 2 đáp án sai)"
                >
                  🗺️ Địa Lý 50:50 ({currentPlayer?.powerUps.geo5050 || 0})
                </button>

                <button
                  onClick={() => usePowerUp('historyHint')}
                  disabled={hasAnswered || (currentPlayer?.powerUps.historyHint || 0) <= 0 || showHistoryHint}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-700 text-xs text-sky-300 font-medium transition-colors"
                  title="Sử Học (Hiện gợi ý thời gian)"
                >
                  🏛️ Sử Học ({currentPlayer?.powerUps.historyHint || 0})
                </button>

                <button
                  onClick={() => usePowerUp('speedBoost')}
                  disabled={hasAnswered || (currentPlayer?.powerUps.speedBoost || 0) <= 0 || activePowerUp === 'speedBoost'}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-30 disabled:cursor-not-allowed border border-stone-700 text-xs text-red-300 font-medium transition-colors"
                  title="Tăng tốc (+25% điểm tốc độ)"
                >
                  ⚡ Tăng Tốc ({currentPlayer?.powerUps.speedBoost || 0})
                </button>
              </div>
            </div>

            {hasAnswered && (
              <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-center text-xs text-amber-300 font-semibold animate-fadeIn">
                ✓ Đã ghi nhận câu trả lời! Đang chờ kết thúc thời gian để chấm điểm...
              </div>
            )}
          </div>

          {/* Side Leaderboard: On Desktop visible alongside; on Mobile accessible via button */}
          {deviceInfo.isDesktop ? (
            <div className="col-span-4 p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                <span className="font-serif font-bold text-xs uppercase text-amber-300 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bảng Xếp Hạng Trực Tiếp</span>
                </span>
                <span className="text-[11px] text-stone-400 font-mono">
                  Hạng {currentRank} / {sortedPlayers.length}
                </span>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[380px] no-scrollbar">
                {sortedPlayers.slice(0, 7).map((p, idx) => (
                  <div
                    key={p.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between text-xs transition-colors ${
                      p.id === userId
                        ? 'bg-amber-950/60 border-amber-500/60 text-amber-200'
                        : 'bg-stone-950/50 border-stone-800/80 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-5 font-mono font-bold text-stone-400 text-center">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                      </span>
                      <span className="truncate font-medium">{p.name}</span>
                    </div>

                    <div className="flex items-center gap-2 font-mono shrink-0">
                      {p.streak >= 2 && (
                        <span className="flex items-center text-[10px] text-orange-400 font-bold">
                          <Flame className="w-3 h-3 fill-orange-500" />
                          <span>{p.streak}</span>
                        </span>
                      )}
                      <span className="font-bold text-amber-300 tabular-nums">
                        {p.score.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-900 border border-stone-800 text-xs">
              <span className="text-stone-300">
                Thứ hạng: <strong className="text-amber-300">#{currentRank}</strong> ({currentPlayer?.score.toLocaleString()} điểm)
              </span>
              <button
                onClick={() => setShowMobileLeaderboardModal(true)}
                className="text-amber-400 font-semibold underline"
              >
                Xem Xếp Hạng
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. REVEAL STATE (After Question Ends)
  // -------------------------------------------------------------
  if (status === 'REVEAL' && currentQ) {
    const myAnswer = currentPlayer?.lastAnswer;
    const isCorrect = myAnswer?.isCorrect;
    const isExpired = !myAnswer || myAnswer.optionIndex === -1;
    const isSuperFast = isCorrect && (myAnswer?.responseTime || 99) < 2.0;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        {/* Outcome Card */}
        <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 shadow-2xl animate-fadeIn ${
          isCorrect
            ? 'bg-gradient-to-b from-emerald-950/80 to-stone-950 border-emerald-500/50'
            : 'bg-gradient-to-b from-red-950/80 to-stone-950 border-red-500/50'
        }`}>
          <div className="inline-block">
            {isCorrect ? (
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-emerald-950/60">
                ⚡
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-400 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-red-950/60">
                ✕
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-white">
              {isCorrect
                ? (isSuperFast ? '⚡ SIÊU TỐC & CHÍNH XÁC!' : '✓ CHÍNH XÁC!')
                : (isExpired ? '⏰ HẾT GIỜ! Bạn chưa kịp chọn.' : '✕ CHƯA CHÍNH XÁC!')}
            </h2>

            {isCorrect && (
              <div className="flex items-center justify-center gap-3 pt-1 text-sm font-mono">
                <span className="text-emerald-400 font-bold text-lg">
                  +{myAnswer?.scoreAwarded} ĐIỂM
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-300">
                  Thời gian: {myAnswer?.responseTime}s
                </span>
                {(myAnswer?.combo || 0) >= 2 && (
                  <span className="px-2 py-0.5 rounded bg-orange-950 border border-orange-500/50 text-orange-400 font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-orange-500" />
                    <span>x{myAnswer?.combo}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="pt-2 text-xs sm:text-sm text-stone-300">
            <span>Đáp án đúng: </span>
            <strong className="text-amber-300 font-serif font-bold text-base">
              {['A', 'B', 'C', 'D'][currentQ.correctIndex]}. {currentQ.options[currentQ.correctIndex]}
            </strong>
          </div>
        </div>

        {/* Section IV/XIII: Triad Interdisciplinary Insight Card */}
        <div className="p-6 rounded-2xl bg-stone-900/90 border border-amber-600/30 shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-400 tracking-wider">
            <Landmark className="w-4 h-4 text-amber-400" />
            <span>Kết Nối Tri Thức Liên Môn</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-amber-600/20 space-y-1">
              <span className="text-[11px] font-bold uppercase text-amber-400 flex items-center gap-1">
                <span>🏛️ Lịch Sử</span>
                <span className="text-stone-500 font-normal">· Thời gian</span>
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentQ.historyLink}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-emerald-600/20 space-y-1">
              <span className="text-[11px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                <span>🗺️ Địa Lý</span>
                <span className="text-stone-500 font-normal">· Không gian</span>
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentQ.geographyLink}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-950/60 border border-sky-600/20 space-y-1">
              <span className="text-[11px] font-bold uppercase text-sky-400 flex items-center gap-1">
                <span>📖 Văn Học</span>
                <span className="text-stone-500 font-normal">· Tác phẩm</span>
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentQ.literatureLink}
              </p>
            </div>
          </div>

          <div className="pt-2 text-xs text-stone-400 border-t border-stone-800">
            <strong>Lời giải chi tiết:</strong> {currentQ.explanation}
          </div>
        </div>

        {/* Automatic Transition Indicator (No manual Next button required) */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-stone-900/90 border border-amber-500/50 text-amber-300 text-xs sm:text-sm font-semibold shadow-xl shadow-amber-950/40 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Tự động chuyển câu tiếp theo... ⏱️</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 5. LEADERBOARD STATE
  // -------------------------------------------------------------
  if (status === 'LEADERBOARD') {
    const isFinalQuestion = currentQuestionIndex >= questions.length - 1;

    return (
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/30 text-amber-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BẢNG XẾP HẠNG SAU CÂU {currentQuestionIndex + 1}</span>
          </div>

          {rankSurpassNotice && (
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300 font-bold text-sm animate-bounce">
              {rankSurpassNotice}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 rounded-2xl bg-stone-900/90 border border-stone-800 shadow-2xl space-y-3">
          {sortedPlayers.map((p, idx) => {
            const isMe = p.id === userId;
            const rank = idx + 1;

            return (
              <div
                key={p.id}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-300 ${
                  isMe
                    ? 'bg-amber-950/70 border-amber-500/70 text-amber-200 ring-2 ring-amber-500/30'
                    : 'bg-stone-950/60 border-stone-800 text-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 font-mono font-bold text-base text-center">
                    {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                  </span>
                  <span className="text-xl">{p.avatar || '👤'}</span>
                  <div>
                    <span className="font-semibold text-sm sm:text-base block">
                      {p.name} {isMe && '(Bạn)'}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {p.correctCount}/{currentQuestionIndex + 1} đúng
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-extrabold text-base sm:text-lg text-amber-300 tabular-nums">
                    {p.score.toLocaleString()}
                  </div>
                  {p.streak >= 2 && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-orange-400 font-semibold">
                      <Flame className="w-3 h-3 fill-orange-500" />
                      <span>Chuỗi x{p.streak}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Question Control */}
        <div className="text-center pt-2">
          {isHost ? (
            <button
              onClick={onNextQuestion}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-stone-950 font-bold text-sm shadow-xl shadow-red-950/50 transition-transform active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <span>{isFinalQuestion ? 'KẾT THÚC ĐẤU TRƯỜNG 🏆' : 'CÂU TIẾP THEO ⚔️'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-stone-400 animate-pulse">
              Đang đợi Chủ phòng sang câu tiếp theo...
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 6. FINISHED PODIUM & POST-MATCH REVIEW
  // -------------------------------------------------------------
  if (status === 'FINISHED') {
    const accuracy = currentPlayer?.answersCount
      ? Math.round((currentPlayer.correctCount / currentPlayer.answersCount) * 100)
      : 0;
    const avgResponseTime = currentPlayer?.answersCount
      ? (currentPlayer.totalResponseTime / currentPlayer.answersCount).toFixed(2)
      : '0.0';

    return (
      <div className="w-full max-w-4xl mx-auto space-y-8 animate-fadeIn">
        {/* Podium Celebration */}
        <div className="p-6 sm:p-10 rounded-2xl border border-amber-600/40 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>KẾT THÚC ĐẤU TRƯỜNG LIÊN MÔN</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-red-400">
            VINH DANH ANH TÀI
          </h2>

          {/* Top 3 Podium Visual */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 max-w-md mx-auto">
            {/* Rank 2 (Silver) */}
            {sortedPlayers[1] && (
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-2xl">🥈</span>
                <span className="font-semibold text-xs sm:text-sm text-stone-300 truncate max-w-[90px]">
                  {sortedPlayers[1].name}
                </span>
                <div className="w-full h-24 sm:h-32 rounded-t-xl bg-slate-800/80 border-t-2 border-slate-400 flex flex-col justify-end p-2 text-center">
                  <span className="font-mono font-bold text-xs text-slate-200">
                    {sortedPlayers[1].score.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) */}
            {sortedPlayers[0] && (
              <div className="space-y-2 flex flex-col items-center -mt-6">
                <span className="text-4xl animate-bounce">👑</span>
                <span className="font-bold text-sm sm:text-base text-amber-200 truncate max-w-[110px]">
                  {sortedPlayers[0].name}
                </span>
                <div className="w-full h-32 sm:h-44 rounded-t-xl bg-gradient-to-t from-amber-950 to-amber-700/80 border-t-4 border-amber-400 flex flex-col justify-end p-2 text-center shadow-lg shadow-amber-950/60">
                  <span className="text-xl">🥇</span>
                  <span className="font-mono font-extrabold text-sm sm:text-base text-amber-100">
                    {sortedPlayers[0].score.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {sortedPlayers[2] && (
              <div className="space-y-2 flex flex-col items-center">
                <span className="text-2xl">🥉</span>
                <span className="font-semibold text-xs sm:text-sm text-stone-300 truncate max-w-[90px]">
                  {sortedPlayers[2].name}
                </span>
                <div className="w-full h-20 sm:h-24 rounded-t-xl bg-amber-950/50 border-t-2 border-amber-700 flex flex-col justify-end p-2 text-center">
                  <span className="font-mono font-bold text-xs text-amber-300">
                    {sortedPlayers[2].score.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Personal Performance Analytics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-800/80 text-center">
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="block text-[11px] text-stone-400">Độ Chính Xác</span>
              <span className="font-mono text-xl font-bold text-emerald-400 tabular-nums">{accuracy}%</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="block text-[11px] text-stone-400">Thời Gian TB</span>
              <span className="font-mono text-xl font-bold text-sky-400 tabular-nums">{avgResponseTime}s</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="block text-[11px] text-stone-400">Số Câu Đúng</span>
              <span className="font-mono text-xl font-bold text-amber-400 tabular-nums">
                {currentPlayer?.correctCount}/{questions.length}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-stone-900/60 border border-stone-800">
              <span className="block text-[11px] text-stone-400">Chuỗi Cao Nhất</span>
              <span className="font-mono text-xl font-bold text-orange-400 tabular-nums">
                🔥 x{currentPlayer?.maxStreak || 0}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onLeaveRoom}
              className="px-6 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Về Trang Chủ Đấu Trường</span>
            </button>
          </div>
        </div>

        {/* Section XX: ÔN TẬP SAU TRẬN (Timeline & Interdisciplinary Map) */}
        <div className="p-6 sm:p-8 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-200 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>📚 Ôn Tập Sau Trận – Dòng Chảy Liên Môn</span>
            </h3>
            <p className="text-xs text-stone-400">
              Hệ thống hóa toàn bộ kiến thức qua sợi dây liên kết Thời gian (Sử) – Không gian (Địa) – Con người / Tác phẩm (Văn).
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((q, idx) => {
              const myAnswer = currentPlayer?.historyAnswers.find((a) => a.questionId === q.id);
              const isCorrect = myAnswer?.isCorrect;

              return (
                <div
                  key={q.id}
                  className="p-4 sm:p-5 rounded-xl border border-stone-800/80 bg-stone-950/60 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-300">
                      Câu {idx + 1}: {q.question}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      isCorrect ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                    }`}>
                      {isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs pt-1">
                    <div className="p-2.5 rounded-lg bg-stone-900/60 border border-amber-600/20">
                      <span className="block text-[10px] uppercase font-bold text-amber-400">🏛️ Lịch Sử:</span>
                      <span className="text-stone-300">{q.historyLink}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-900/60 border border-emerald-600/20">
                      <span className="block text-[10px] uppercase font-bold text-emerald-400">🗺️ Địa Lý:</span>
                      <span className="text-stone-300">{q.geographyLink}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-stone-900/60 border border-sky-600/20">
                      <span className="block text-[10px] uppercase font-bold text-sky-400">📖 Văn Học:</span>
                      <span className="text-stone-300">{q.literatureLink}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Mobile Leaderboard Modal
  if (showMobileLeaderboardModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
        <div className="w-full max-w-sm rounded-2xl bg-stone-900 border border-stone-700 p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="font-serif font-bold text-amber-300 text-sm">Bảng Xếp Hạng Trực Tiếp</h3>
            <button
              onClick={() => setShowMobileLeaderboardModal(false)}
              className="text-stone-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sortedPlayers.map((p, idx) => (
              <div
                key={p.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                  p.id === userId ? 'bg-amber-950/60 border-amber-500 text-amber-200' : 'bg-stone-950 border-stone-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="font-mono font-bold text-stone-400">#{idx + 1}</span>
                  <span className="truncate">{p.name}</span>
                </div>
                <span className="font-mono font-bold text-amber-300">{p.score.toLocaleString()}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowMobileLeaderboardModal(false)}
            className="w-full py-2 rounded-lg bg-stone-800 text-stone-200 text-xs font-semibold"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  return null;
};
