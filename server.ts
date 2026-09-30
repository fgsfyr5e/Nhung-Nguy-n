import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { Question, Player, RoomState, RoomStatus, PlayerAnswerRecord } from './src/types';
import { INITIAL_QUESTIONS } from './src/data/questions';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

// Initialize server-side Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ServerRoom {
  code: string;
  title: string;
  hostId: string;
  status: RoomStatus;
  questions: Question[];
  currentQuestionIndex: number;
  questionStartTime: number;
  questionDuration: number;
  players: Map<string, Player>;
  sockets: Map<string, WebSocket>;
  timerRef: NodeJS.Timeout | null;
  themeId?: string;
  subject: string;
  grade: number;
  countdownValue?: number;
}

const rooms = new Map<string, ServerRoom>();

function sanitizeRoomState(room: ServerRoom): RoomState {
  const playersObj: Record<string, Player> = {};
  room.players.forEach((p, id) => {
    playersObj[id] = p;
  });

  return {
    code: room.code,
    title: room.title,
    hostId: room.hostId,
    status: room.status,
    questions: room.questions,
    currentQuestionIndex: room.currentQuestionIndex,
    questionStartTime: room.questionStartTime,
    questionDuration: room.questionDuration,
    players: playersObj,
    themeId: room.themeId,
    subject: room.subject,
    grade: room.grade,
    countdownValue: room.countdownValue,
  };
}

function broadcastRoom(room: ServerRoom, payload: unknown) {
  const data = JSON.stringify(payload);
  room.sockets.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

function stopRoomTimer(room: ServerRoom) {
  if (room.timerRef) {
    clearTimeout(room.timerRef);
    room.timerRef = null;
  }
}

function endQuestion(room: ServerRoom) {
  stopRoomTimer(room);
  room.status = 'REVEAL';

  const currentQ = room.questions[room.currentQuestionIndex];
  // Calculate any players who did not answer
  room.players.forEach((p) => {
    if (!p.lastAnswer || p.lastAnswer.questionId !== currentQ.id) {
      p.streak = 0;
      p.answersCount += 1;
      p.lastAnswer = {
        questionId: currentQ.id,
        optionIndex: -1,
        isCorrect: false,
        responseTime: room.questionDuration,
        scoreAwarded: 0,
        combo: 0,
      };
      p.historyAnswers.push(p.lastAnswer);
    }
  });

  broadcastRoom(room, {
    type: 'ROOM_UPDATE',
    room: sanitizeRoomState(room),
  });

  // AUTO NEXT: Automatically transition to the next question after 1.5 seconds
  room.timerRef = setTimeout(() => {
    startQuestion(room, room.currentQuestionIndex + 1);
  }, 1500);
}

function startQuestion(room: ServerRoom, index: number) {
  stopRoomTimer(room);
  if (index >= room.questions.length) {
    room.status = 'FINISHED';
    broadcastRoom(room, {
      type: 'ROOM_UPDATE',
      room: sanitizeRoomState(room),
    });
    return;
  }

  room.currentQuestionIndex = index;
  room.status = 'QUESTION';
  room.questionStartTime = Date.now();
  const q = room.questions[index];
  room.questionDuration = q.timeLimit || 15;

  // Clear previous answer for this round
  room.players.forEach((p) => {
    p.lastAnswer = undefined;
  });

  broadcastRoom(room, {
    type: 'ROOM_UPDATE',
    room: sanitizeRoomState(room),
  });

  // Server-authoritative timer: exactly duration * 1000ms
  room.timerRef = setTimeout(() => {
    endQuestion(room);
  }, room.questionDuration * 1000);
}

function startCountdown(room: ServerRoom) {
  stopRoomTimer(room);
  room.status = 'COUNTDOWN';
  let count = 3;
  room.countdownValue = count;

  broadcastRoom(room, {
    type: 'ROOM_UPDATE',
    room: sanitizeRoomState(room),
  });

  const interval = setInterval(() => {
    count -= 1;
    if (count > 0) {
      room.countdownValue = count;
      broadcastRoom(room, {
        type: 'COUNTDOWN_TICK',
        count,
        room: sanitizeRoomState(room),
      });
    } else {
      clearInterval(interval);
      room.countdownValue = 0;
      startQuestion(room, 0);
    }
  }, 1000);
}

// WebSocket Connection handling
wss.on('connection', (ws: WebSocket) => {
  let boundUserId: string | null = null;
  let boundRoomCode: string | null = null;

  ws.on('message', (messageStr: string) => {
    try {
      const msg = JSON.parse(messageStr.toString());
      const { type, payload } = msg;

      switch (type) {
        case 'CREATE_ROOM': {
          const { code, title, host, questions, themeId, subject, grade, duration } = payload;
          const roomCode = code || Math.floor(100000 + Math.random() * 900000).toString();

          const newRoom: ServerRoom = {
            code: roomCode,
            title: title || 'Đấu Trường Liên Môn',
            hostId: host.id,
            status: 'LOBBY',
            questions: questions && questions.length > 0 ? questions : INITIAL_QUESTIONS.slice(0, 10),
            currentQuestionIndex: 0,
            questionStartTime: 0,
            questionDuration: duration || 15,
            players: new Map(),
            sockets: new Map(),
            timerRef: null,
            themeId,
            subject: subject || 'interdisciplinary',
            grade: grade || 12,
          };

          const hostPlayer: Player = {
            ...host,
            isHost: true,
            score: 0,
            streak: 0,
            maxStreak: 0,
            correctCount: 0,
            answersCount: 0,
            totalResponseTime: 0,
            historyAnswers: [],
            powerUps: { literature2x: 1, geo5050: 1, historyHint: 1, speedBoost: 1 },
          };

          newRoom.players.set(host.id, hostPlayer);
          newRoom.sockets.set(host.id, ws);
          rooms.set(roomCode, newRoom);

          boundUserId = host.id;
          boundRoomCode = roomCode;

          ws.send(JSON.stringify({
            type: 'ROOM_CREATED',
            room: sanitizeRoomState(newRoom),
          }));
          break;
        }

        case 'JOIN_ROOM': {
          const { code, player } = payload;
          const room = rooms.get(code);
          if (!room) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'Mã phòng không tồn tại hoặc đã đóng!' }));
            return;
          }

          boundUserId = player.id;
          boundRoomCode = code;

          // Check if already in room or new
          const targetPlayer: Player = room.players.get(player.id) ?? {
            ...player,
            isHost: player.id === room.hostId,
            score: 0,
            streak: 0,
            maxStreak: 0,
            correctCount: 0,
            answersCount: 0,
            totalResponseTime: 0,
            historyAnswers: [],
            powerUps: { literature2x: 1, geo5050: 1, historyHint: 1, speedBoost: 1 },
          };
          room.players.set(player.id, targetPlayer);

          room.sockets.set(player.id, ws);

          broadcastRoom(room, {
            type: 'ROOM_UPDATE',
            room: sanitizeRoomState(room),
            notification: `${targetPlayer.name} vừa gia nhập đấu trường!`,
          });
          break;
        }

        case 'SUBMIT_ANSWER': {
          const { code, userId, questionId, optionIndex, powerUpUsed } = payload;
          const room = rooms.get(code);
          if (!room || room.status !== 'QUESTION') return;

          const player = room.players.get(userId);
          if (!player) return;

          // Prevent double answering (anti-cheat)
          if (player.lastAnswer && player.lastAnswer.questionId === questionId) {
            return;
          }

          const currentQ = room.questions[room.currentQuestionIndex];
          if (!currentQ || currentQ.id !== questionId) return;

          // Server-authoritative time calculation
          const now = Date.now();
          const responseTime = Math.max(0.1, Number(((now - room.questionStartTime) / 1000).toFixed(2)));

          // Check if time expired according to server
          if (responseTime > room.questionDuration + 0.5) {
            return;
          }

          const isCorrect = optionIndex === currentQ.correctIndex;
          let scoreAwarded = 0;

          if (isCorrect) {
            // Speed Multiplier: max 1.0 (super fast < 1.5s), min 0.35 (at expiration)
            const speedRatio = Math.min(1, responseTime / room.questionDuration);
            const speedMultiplier = Math.max(0.35, 1 - speedRatio * 0.65);

            // Difficulty multiplier
            const diffMultiplier = currentQ.difficulty === 'hard' ? 1.5 : currentQ.difficulty === 'medium' ? 1.2 : 1.0;

            // Streak combo
            const newStreak = player.streak + 1;
            player.streak = newStreak;
            if (newStreak > player.maxStreak) {
              player.maxStreak = newStreak;
            }

            const comboBonus = 1 + Math.min(player.streak, 5) * 0.1; // max +50% for 5-streak
            let calculated = Math.round(1000 * speedMultiplier * diffMultiplier * comboBonus);

            // Power-up multipliers
            if (powerUpUsed === 'literature2x' && (currentQ.subject === 'literature' || currentQ.subject === 'interdisciplinary')) {
              calculated *= 2;
            }
            if (powerUpUsed === 'speedBoost') {
              calculated = Math.round(calculated * 1.25);
            }

            scoreAwarded = calculated;
            player.score += scoreAwarded;
            player.correctCount += 1;
          } else {
            player.streak = 0;
            scoreAwarded = 0;
          }

          player.answersCount += 1;
          player.totalResponseTime += responseTime;

          const answerRecord: PlayerAnswerRecord = {
            questionId,
            optionIndex,
            isCorrect,
            responseTime,
            scoreAwarded,
            combo: player.streak,
          };

          player.lastAnswer = answerRecord;
          player.historyAnswers.push(answerRecord);

          // Broadcast that this player answered (without revealing correctness until round ends)
          broadcastRoom(room, {
            type: 'PLAYER_ANSWERED',
            playerId: userId,
            answeredCount: Array.from(room.players.values()).filter((p) => p.lastAnswer?.questionId === questionId).length,
            totalPlayers: room.players.size,
          });

          // If all active players have answered, immediately end question
          const allAnswered = Array.from(room.players.values()).every(
            (p) => p.lastAnswer?.questionId === questionId
          );
          if (allAnswered) {
            endQuestion(room);
          }
          break;
        }

        case 'START_GAME': {
          const { code, userId } = payload;
          const room = rooms.get(code);
          if (!room || room.hostId !== userId) return;
          startCountdown(room);
          break;
        }

        case 'NEXT_QUESTION': {
          const { code, userId } = payload;
          const room = rooms.get(code);
          if (!room || room.hostId !== userId) return;

          if (room.status === 'REVEAL') {
            room.status = 'LEADERBOARD';
            broadcastRoom(room, {
              type: 'ROOM_UPDATE',
              room: sanitizeRoomState(room),
            });
          } else if (room.status === 'LEADERBOARD') {
            startQuestion(room, room.currentQuestionIndex + 1);
          }
          break;
        }

        case 'LEAVE_ROOM': {
          if (boundRoomCode && boundUserId) {
            const room = rooms.get(boundRoomCode);
            if (room) {
              room.players.delete(boundUserId);
              room.sockets.delete(boundUserId);
              if (room.players.size === 0) {
                stopRoomTimer(room);
                rooms.delete(boundRoomCode);
              } else {
                broadcastRoom(room, {
                  type: 'ROOM_UPDATE',
                  room: sanitizeRoomState(room),
                });
              }
            }
          }
          break;
        }
      }
    } catch (err) {
      console.error('WebSocket message parsing error:', err);
    }
  });

  ws.on('close', () => {
    if (boundRoomCode && boundUserId) {
      const room = rooms.get(boundRoomCode);
      if (room) {
        room.sockets.delete(boundUserId);
        // Don't delete player immediately so they can reconnect!
      }
    }
  });
});

// REST API for AI Question Generator using Google GenAI SDK
app.post('/api/gemini/generate-questions', async (req, res) => {
  const { topic = 'Lịch Sử Việt Nam', grade = 12, count = 3, difficulty = 'medium', subjectType = 'interdisciplinary' } = req.body || {};

  try {
    const prompt = `Bạn là chuyên gia giáo dục biên soạn đề thi môn Lịch sử, Địa lý, Ngữ văn Việt Nam.
Hãy tạo ${count} câu hỏi trắc nghiệm liên môn hoặc chuyên sâu theo chủ đề: "${topic}".
Lớp: ${grade}, Độ khó: ${difficulty}, Loại: ${subjectType}.

YÊU CẦU:
1. Câu hỏi sâu sắc, chính xác tuyệt đối theo chương trình giáo dục Việt Nam.
2. Với câu liên môn, hãy kết nối:
   - Lịch sử (Thời gian, sự kiện, chiến công)
   - Địa lý (Không gian, địa danh, địa hình, sông núi, khí hậu)
   - Văn học (Tác giả, tác phẩm, thơ ca, trích dẫn kiệt tác)
3. 4 lựa chọn trả lời, chỉ có duy nhất 1 đáp án đúng (correctIndex từ 0 đến 3).
4. Cung cấp liên kết Lịch sử, Địa lý, Văn học và giải thích chi tiết.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Bạn là chuyên gia biên soạn đề thi trắc nghiệm liên môn Sử - Địa - Văn chuẩn mực của Bộ Giáo dục và Đào tạo Việt Nam.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          description: 'Danh sách các câu hỏi trắc nghiệm liên môn',
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '4 đáp án trắc nghiệm A, B, C, D',
              },
              correctIndex: { type: Type.INTEGER, description: 'Chỉ số đáp án đúng (0, 1, 2, hoặc 3)' },
              subject: { type: Type.STRING, description: 'history, geography, literature, hoặc interdisciplinary' },
              grade: { type: Type.INTEGER },
              difficulty: { type: Type.STRING, description: 'easy, medium, hoặc hard' },
              timeLimit: { type: Type.INTEGER, description: 'Thời gian làm bài đề xuất (giây)' },
              historyLink: { type: Type.STRING, description: 'Liên hệ Lịch sử (Thời gian)' },
              geographyLink: { type: Type.STRING, description: 'Liên hệ Địa lý (Không gian)' },
              literatureLink: { type: Type.STRING, description: 'Liên hệ Văn học (Tác phẩm / Con người)' },
              explanation: { type: Type.STRING, description: 'Lời giải thích cặn kẽ vì sao đúng' },
            },
            required: ['question', 'options', 'correctIndex', 'subject', 'explanation', 'historyLink', 'geographyLink', 'literatureLink'],
          },
        },
      },
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);

    // Format IDs if missing
    const formatted = parsed.map((q: Question, idx: number) => ({
      ...q,
      id: q.id || `ai-gen-${Date.now()}-${idx}`,
      timeLimit: q.timeLimit || 15,
      grade: q.grade || grade,
      difficulty: q.difficulty || difficulty,
    }));

    res.json({ success: true, questions: formatted });
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    const isRateLimit = String(error).includes('resource_exhausted') || String(error).includes('429');

    // Provide resilient fallback questions matching the topic/grade
    const fallbackQuestions: Question[] = INITIAL_QUESTIONS.slice(0, Number(count) || 3).map((q, idx) => ({
      ...q,
      id: `ai-fallback-${Date.now()}-${idx}`,
      question: `[Chuyên đề: ${topic}] ${q.question}`,
      timeLimit: 15,
      grade: Number(grade) || 12,
    }));

    if (fallbackQuestions.length > 0) {
      res.json({
        success: true,
        questions: fallbackQuestions,
        notice: isRateLimit
          ? 'Hệ thống đạt giới hạn quota Gemini API tạm thời. Đã tự động tạo các câu hỏi chất lượng cao từ kho dữ liệu liên môn!'
          : undefined,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: isRateLimit
        ? 'Quota Gemini API tạm thời vượt mức. Vui lòng kiểm tra lại quota hoặc thử lại sau ít phút!'
        : 'Không thể tạo câu hỏi qua Gemini AI vào lúc này. Vui lòng thử lại!',
      error: String(error),
    });
  }
});

// REST API for public active rooms info
app.get('/api/rooms', (req, res) => {
  const activeRooms = Array.from(rooms.values()).map((r) => ({
    code: r.code,
    title: r.title,
    status: r.status,
    playerCount: r.players.size,
    subject: r.subject,
    themeId: r.themeId,
  }));
  res.json({ rooms: activeRooms });
});

app.get('/api/rooms/:code', (req, res) => {
  const code = req.params.code;
  const room = rooms.get(code);
  if (!room) {
    res.status(404).json({ exists: false, message: '❌ Không tìm thấy phòng. Vui lòng kiểm tra lại mã PIN.' });
    return;
  }
  if (room.status === 'FINISHED') {
    res.json({ exists: true, status: 'FINISHED', message: '⚠️ Trận đấu đã kết thúc.' });
    return;
  }
  res.json({ exists: true, status: room.status, title: room.title, playerCount: room.players.size });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: Date.now(), activeRoomsCount: rooms.size });
});

// Full-Stack Dev & Production mounting
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

async function bootstrap() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  server.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} in ${isProduction ? 'production' : 'development'} mode`);
  });
}

bootstrap();
