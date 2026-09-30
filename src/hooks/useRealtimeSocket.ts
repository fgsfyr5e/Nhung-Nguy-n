import { useState, useEffect, useRef, useCallback } from 'react';
import { RoomState, Player, Question, PlayerAnswerRecord } from '../types';
import { sounds } from '../utils/sound';

export function useRealtimeSocket() {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSoloModeRef = useRef<boolean>(false);
  const soloBotIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError(null);
      };

      ws.onclose = () => {
        setConnected(false);
        // Automatic reconnection attempt after 2s if not in solo mode
        if (!isSoloModeRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 2000);
        }
      };

      ws.onerror = (e) => {
        console.warn('WebSocket connection error:', e);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const { type, room, message, count, notification: note } = data;

          if (type === 'ROOM_CREATED' || type === 'ROOM_UPDATE') {
            setRoomState(room);
            if (note) {
              setNotification(note);
              setTimeout(() => setNotification(null), 3000);
            }
          } else if (type === 'COUNTDOWN_TICK') {
            sounds.playCountdownTick();
            setRoomState(room);
          } else if (type === 'PLAYER_ANSWERED') {
            sounds.playClick();
          } else if (type === 'ERROR') {
            setError(message);
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err);
        }
      };
    } catch (e) {
      console.error('WebSocket initialization failure:', e);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (soloBotIntervalRef.current) clearInterval(soloBotIntervalRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [connect]);

  // Send message over WebSocket
  const send = useCallback((type: string, payload: unknown) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type, payload }));
    }
  }, []);

  const createRoom = useCallback((options: {
    code?: string;
    title: string;
    host: Player;
    questions?: Question[];
    themeId?: string;
    subject?: string;
    grade?: number;
    duration?: number;
  }) => {
    isSoloModeRef.current = false;
    send('CREATE_ROOM', options);
  }, [send]);

  const joinRoom = useCallback((code: string, player: Player) => {
    isSoloModeRef.current = false;
    send('JOIN_ROOM', { code, player });
  }, [send]);

  const submitAnswer = useCallback((code: string, userId: string, questionId: string, optionIndex: number, powerUpUsed?: string) => {
    if (isSoloModeRef.current) {
      // Handle local solo mode answer
      setRoomState((prev) => {
        if (!prev || prev.status !== 'QUESTION') return prev;
        const currentQ = prev.questions[prev.currentQuestionIndex];
        if (currentQ.id !== questionId) return prev;

        const player = prev.players[userId];
        if (!player || player.lastAnswer?.questionId === questionId) return prev;

        const responseTime = Math.max(0.2, Number(((Date.now() - prev.questionStartTime) / 1000).toFixed(2)));
        const isCorrect = optionIndex === currentQ.correctIndex;

        let scoreAwarded = 0;
        let newStreak = 0;
        if (isCorrect) {
          const speedRatio = Math.min(1, responseTime / prev.questionDuration);
          const speedMultiplier = Math.max(0.35, 1 - speedRatio * 0.65);
          const diffMultiplier = currentQ.difficulty === 'hard' ? 1.5 : currentQ.difficulty === 'medium' ? 1.2 : 1.0;
          newStreak = player.streak + 1;
          const comboBonus = 1 + Math.min(newStreak, 5) * 0.1;
          let calculated = Math.round(1000 * speedMultiplier * diffMultiplier * comboBonus);

          if (powerUpUsed === 'literature2x' && (currentQ.subject === 'literature' || currentQ.subject === 'interdisciplinary')) {
            calculated *= 2;
          }
          if (powerUpUsed === 'speedBoost') {
            calculated = Math.round(calculated * 1.25);
          }

          scoreAwarded = calculated;
          sounds.playCorrect(responseTime < 3.0);
          if (newStreak >= 2) sounds.playStreak(newStreak);
        } else {
          sounds.playWrong();
        }

        const answerRecord: PlayerAnswerRecord = {
          questionId,
          optionIndex,
          isCorrect,
          responseTime,
          scoreAwarded,
          combo: newStreak,
        };

        const updatedPlayer: Player = {
          ...player,
          score: player.score + scoreAwarded,
          streak: newStreak,
          maxStreak: Math.max(player.maxStreak, newStreak),
          correctCount: player.correctCount + (isCorrect ? 1 : 0),
          answersCount: player.answersCount + 1,
          totalResponseTime: player.totalResponseTime + responseTime,
          lastAnswer: answerRecord,
          historyAnswers: [...player.historyAnswers, answerRecord],
        };

        // Set status to REVEAL to show instant feedback
        setTimeout(() => {
          setRoomState((latest) => {
            if (!latest || latest.status !== 'REVEAL') return latest;
            const nextIdx = latest.currentQuestionIndex + 1;
            if (nextIdx >= latest.questions.length) {
              sounds.playVictory();
              return { ...latest, status: 'FINISHED' };
            }
            // Auto advance to next question
            const resetPlayers: Record<string, Player> = {};
            Object.entries(latest.players).forEach(([id, p]) => {
              resetPlayers[id] = { ...p, lastAnswer: undefined };
            });
            startSoloBotSimulation(nextIdx);
            return {
              ...latest,
              status: 'QUESTION',
              currentQuestionIndex: nextIdx,
              questionStartTime: Date.now(),
              players: resetPlayers,
            };
          });
        }, 1300);

        return {
          ...prev,
          status: 'REVEAL',
          players: {
            ...prev.players,
            [userId]: updatedPlayer,
          },
        };
      });
      return;
    }

    send('SUBMIT_ANSWER', { code, userId, questionId, optionIndex, powerUpUsed });
  }, [send]);

  const handleTimeExpired = useCallback((code: string, userId: string, questionId: string) => {
    if (isSoloModeRef.current) {
      setRoomState((prev) => {
        if (!prev || prev.status !== 'QUESTION') return prev;
        const currentQ = prev.questions[prev.currentQuestionIndex];
        if (currentQ.id !== questionId) return prev;

        const player = prev.players[userId];
        if (!player || (player.lastAnswer && player.lastAnswer.questionId === questionId)) return prev;

        sounds.playWrong();
        const answerRecord: PlayerAnswerRecord = {
          questionId,
          optionIndex: -1,
          isCorrect: false,
          responseTime: prev.questionDuration,
          scoreAwarded: 0,
          combo: 0,
        };

        const updatedPlayer: Player = {
          ...player,
          streak: 0,
          answersCount: player.answersCount + 1,
          totalResponseTime: player.totalResponseTime + prev.questionDuration,
          lastAnswer: answerRecord,
          historyAnswers: [...player.historyAnswers, answerRecord],
        };

        setTimeout(() => {
          setRoomState((latest) => {
            if (!latest || latest.status !== 'REVEAL') return latest;
            const nextIdx = latest.currentQuestionIndex + 1;
            if (nextIdx >= latest.questions.length) {
              sounds.playVictory();
              return { ...latest, status: 'FINISHED' };
            }
            const resetPlayers: Record<string, Player> = {};
            Object.entries(latest.players).forEach(([id, p]) => {
              resetPlayers[id] = { ...p, lastAnswer: undefined };
            });
            startSoloBotSimulation(nextIdx);
            return {
              ...latest,
              status: 'QUESTION',
              currentQuestionIndex: nextIdx,
              questionStartTime: Date.now(),
              players: resetPlayers,
            };
          });
        }, 1300);

        return {
          ...prev,
          status: 'REVEAL',
          players: {
            ...prev.players,
            [userId]: updatedPlayer,
          },
        };
      });
    }
  }, []);

  const startGame = useCallback((code: string, userId: string) => {
    if (isSoloModeRef.current) {
      // Local start countdown
      setRoomState((prev) => prev ? { ...prev, status: 'COUNTDOWN', countdownValue: 3 } : null);
      sounds.playCountdownTick();
      let count = 3;
      const timer = setInterval(() => {
        count -= 1;
        if (count > 0) {
          sounds.playCountdownTick();
          setRoomState((prev) => prev ? { ...prev, countdownValue: count } : null);
        } else {
          clearInterval(timer);
          sounds.playBattleStart();
          setRoomState((prev) => prev ? {
            ...prev,
            status: 'QUESTION',
            currentQuestionIndex: 0,
            questionStartTime: Date.now(),
            countdownValue: 0,
          } : null);
          startSoloBotSimulation(0);
        }
      }, 1000);
      return;
    }

    send('START_GAME', { code, userId });
  }, [send]);

  const nextQuestion = useCallback((code: string, userId: string) => {
    if (isSoloModeRef.current) {
      setRoomState((prev) => {
        if (!prev) return null;
        if (prev.status === 'REVEAL') {
          return { ...prev, status: 'LEADERBOARD' };
        } else if (prev.status === 'LEADERBOARD') {
          const nextIdx = prev.currentQuestionIndex + 1;
          if (nextIdx >= prev.questions.length) {
            sounds.playVictory();
            return { ...prev, status: 'FINISHED' };
          }
          // Reset answers for next question
          const resetPlayers: Record<string, Player> = {};
          Object.entries(prev.players).forEach(([id, p]) => {
            resetPlayers[id] = { ...p, lastAnswer: undefined };
          });
          startSoloBotSimulation(nextIdx);
          return {
            ...prev,
            status: 'QUESTION',
            currentQuestionIndex: nextIdx,
            questionStartTime: Date.now(),
            players: resetPlayers,
          };
        }
        return prev;
      });
      return;
    }

    send('NEXT_QUESTION', { code, userId });
  }, [send]);

  // Start local solo practice with smart rival bots
  const startSoloPractice = useCallback((player: Player, questions: Question[], themeId?: string) => {
    isSoloModeRef.current = true;
    const bot1: Player = {
      id: 'bot-1',
      name: 'Nguyễn Văn A (Hà Nội)',
      avatar: '🏛️',
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      answersCount: 0,
      totalResponseTime: 0,
      isHost: false,
      isBot: true,
      historyAnswers: [],
      powerUps: { literature2x: 1, geo5050: 1, historyHint: 1, speedBoost: 1 },
    };

    const bot2: Player = {
      id: 'bot-2',
      name: 'Trần Thị Mai (Đà Nẵng)',
      avatar: '🌊',
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      answersCount: 0,
      totalResponseTime: 0,
      isHost: false,
      isBot: true,
      historyAnswers: [],
      powerUps: { literature2x: 1, geo5050: 1, historyHint: 1, speedBoost: 1 },
    };

    const bot3: Player = {
      id: 'bot-3',
      name: 'Lê Hoàng Long (Huế)',
      avatar: '🌸',
      score: 0,
      streak: 0,
      maxStreak: 0,
      correctCount: 0,
      answersCount: 0,
      totalResponseTime: 0,
      isHost: false,
      isBot: true,
      historyAnswers: [],
      powerUps: { literature2x: 1, geo5050: 1, historyHint: 1, speedBoost: 1 },
    };

    const initialRoom: RoomState = {
      code: 'SOLO-ARENA',
      title: 'Đấu Trường Đơn Đấu & Luyện Tập',
      hostId: player.id,
      status: 'LOBBY',
      questions,
      currentQuestionIndex: 0,
      questionStartTime: 0,
      questionDuration: questions[0]?.timeLimit || 15,
      players: {
        [player.id]: {
          ...player,
          isHost: true,
          score: 0,
          streak: 0,
          maxStreak: 0,
          correctCount: 0,
          answersCount: 0,
          totalResponseTime: 0,
          historyAnswers: [],
          powerUps: { literature2x: 1, geo5050: 1, historyHint: 1, speedBoost: 1 },
        },
        [bot1.id]: bot1,
        [bot2.id]: bot2,
        [bot3.id]: bot3,
      },
      themeId,
      subject: 'interdisciplinary',
      grade: 12,
    };

    setRoomState(initialRoom);
  }, []);

  const startSoloBotSimulation = (qIndex: number) => {
    // Schedule realistic bot answers
    ['bot-1', 'bot-2', 'bot-3'].forEach((botId, idx) => {
      const delay = (2.0 + Math.random() * 4.5 + idx * 1.2) * 1000;
      setTimeout(() => {
        setRoomState((prev) => {
          if (!prev || prev.status !== 'QUESTION' || prev.currentQuestionIndex !== qIndex) return prev;
          const currentQ = prev.questions[qIndex];
          const bot = prev.players[botId];
          if (!bot || bot.lastAnswer?.questionId === currentQ.id) return prev;

          // 75% accuracy rate for competitive bots
          const isCorrect = Math.random() < 0.75;
          const optionIndex = isCorrect
            ? currentQ.correctIndex
            : (currentQ.correctIndex + 1 + Math.floor(Math.random() * 3)) % 4;

          const responseTime = Number((delay / 1000).toFixed(2));
          let scoreAwarded = 0;
          let newStreak = 0;

          if (isCorrect) {
            const speedRatio = Math.min(1, responseTime / prev.questionDuration);
            const speedMultiplier = Math.max(0.35, 1 - speedRatio * 0.65);
            newStreak = bot.streak + 1;
            const comboBonus = 1 + Math.min(newStreak, 5) * 0.1;
            scoreAwarded = Math.round(1000 * speedMultiplier * comboBonus);
          }

          const answerRecord: PlayerAnswerRecord = {
            questionId: currentQ.id,
            optionIndex,
            isCorrect,
            responseTime,
            scoreAwarded,
            combo: newStreak,
          };

          return {
            ...prev,
            players: {
              ...prev.players,
              [botId]: {
                ...bot,
                score: bot.score + scoreAwarded,
                streak: newStreak,
                maxStreak: Math.max(bot.maxStreak, newStreak),
                correctCount: bot.correctCount + (isCorrect ? 1 : 0),
                answersCount: bot.answersCount + 1,
                totalResponseTime: bot.totalResponseTime + responseTime,
                lastAnswer: answerRecord,
                historyAnswers: [...bot.historyAnswers, answerRecord],
              },
            },
          };
        });
      }, delay);
    });
  };

  const leaveRoom = useCallback(() => {
    isSoloModeRef.current = false;
    if (roomState) {
      send('LEAVE_ROOM', {});
    }
    setRoomState(null);
  }, [roomState, send]);

  return {
    roomState,
    setRoomState,
    connected,
    error,
    setError,
    notification,
    createRoom,
    joinRoom,
    submitAnswer,
    handleTimeExpired,
    startGame,
    nextQuestion,
    startSoloPractice,
    leaveRoom,
  };
}
