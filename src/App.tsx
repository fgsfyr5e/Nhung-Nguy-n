/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { RoleSelectScreen } from './components/RoleSelectScreen';
import { StudentJoinScreen } from './components/StudentJoinScreen';
import { HomeHero } from './components/HomeHero';
import { QuizArena } from './components/QuizArena';
import { ThemeExplorer } from './components/ThemeExplorer';
import { CryptogramGame } from './components/CryptogramGame';
import { PictionaryGame } from './components/PictionaryGame';
import { CharacterCardsView } from './components/CharacterCardsView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminAiStudio } from './components/AdminAiStudio';
import { PinJoinModal } from './components/PinJoinModal';
import { useDeviceDetect } from './hooks/useDeviceDetect';
import { useRealtimeSocket } from './hooks/useRealtimeSocket';
import { INITIAL_QUESTIONS } from './data/questions';
import { INTERDISCIPLINARY_THEMES } from './data/themes';
import { Player, Question } from './types';
import { sounds } from './utils/sound';

export default function App() {
  const deviceInfo = useDeviceDetect();
  const [currentRole, setCurrentRole] = useState<'student' | 'teacher' | 'admin' | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('arena');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  // Persistent user identity
  const [userId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('arena_user_id');
      if (stored) return stored;
      const newId = 'user_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('arena_user_id', newId);
      return newId;
    }
    return 'user_' + Math.random().toString(36).substring(2, 9);
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('arena_user_name') || 'Nguyễn Văn An';
    }
    return 'Nguyễn Văn An';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('arena_user_name', playerName);
    }
  }, [playerName]);

  // Realtime Socket Hook
  const {
    roomState,
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
  } = useRealtimeSocket();

  // Create active player instance
  const getCurrentPlayer = (): Player => ({
    id: userId,
    name: playerName || 'Học Viên Thi Đấu',
    avatar: '⚔️',
    score: 0,
    streak: 0,
    maxStreak: 0,
    correctCount: 0,
    answersCount: 0,
    totalResponseTime: 0,
    isHost: false,
    historyAnswers: [],
    powerUps: {
      literature2x: 1,
      geo5050: 1,
      historyHint: 1,
      speedBoost: 1,
    },
  });

  // Handlers
  const handleJoinPin = (pin: string, name: string) => {
    if (name) setPlayerName(name);
    joinRoom(pin, {
      ...getCurrentPlayer(),
      name: name || playerName,
    });
  };

  const handleStartSolo = (themeId?: string) => {
    let filteredQuestions = INITIAL_QUESTIONS;
    if (themeId) {
      const matched = INITIAL_QUESTIONS.filter((q) => q.themeId === themeId);
      if (matched.length > 0) {
        filteredQuestions = matched;
      }
    }
    startSoloPractice(getCurrentPlayer(), filteredQuestions, themeId);
  };

  const handleCreateRoomFromTeacher = (config: {
    title: string;
    themeId?: string;
    subject: string;
    grade: number;
    duration: number;
    questionCount: number;
  }) => {
    let questionsForRoom = INITIAL_QUESTIONS;
    if (config.themeId) {
      const matched = INITIAL_QUESTIONS.filter((q) => q.themeId === config.themeId);
      if (matched.length > 0) {
        questionsForRoom = matched;
      }
    }
    // Limit to configured count
    questionsForRoom = questionsForRoom.slice(0, config.questionCount);

    createRoom({
      title: config.title,
      host: getCurrentPlayer(),
      questions: questionsForRoom,
      themeId: config.themeId,
      subject: config.subject,
      grade: config.grade,
      duration: config.duration,
    });
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        openPinModal={() => setIsPinModalOpen(true)}
        onHomeClick={() => {
          leaveRoom();
          setCurrentRole(null);
          setActiveTab('arena');
        }}
        currentRole={currentRole}
        activeRoomCode={roomState?.code}
      />

      {/* Global Error Banner */}
      {error && (
        <div className="w-full bg-red-900/90 text-white text-xs py-2 px-4 text-center flex items-center justify-center gap-2 font-medium">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="underline ml-2">
            Đóng
          </button>
        </div>
      )}

      {/* Global Live Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 p-3 rounded-xl bg-amber-900/90 border border-amber-500/50 text-amber-100 text-xs font-semibold shadow-2xl animate-bounce">
          🔔 {notification}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {roomState ? (
          /* Active Realtime Arena View */
          <QuizArena
            roomState={roomState}
            userId={userId}
            deviceInfo={deviceInfo}
            onSubmitAnswer={(optIndex, powerUp) => {
              if (roomState.questions[roomState.currentQuestionIndex]) {
                submitAnswer(
                  roomState.code,
                  userId,
                  roomState.questions[roomState.currentQuestionIndex].id,
                  optIndex,
                  powerUp
                );
              }
            }}
            onTimeExpired={() => {
              if (roomState.questions[roomState.currentQuestionIndex]) {
                handleTimeExpired(
                  roomState.code,
                  userId,
                  roomState.questions[roomState.currentQuestionIndex].id
                );
              }
            }}
            onStartGame={() => startGame(roomState.code, userId)}
            onNextQuestion={() => nextQuestion(roomState.code, userId)}
            onLeaveRoom={leaveRoom}
          />
        ) : !currentRole ? (
          /* Priority 1: Mandatory Landing Role Selection Screen */
          <RoleSelectScreen
            onSelectRole={(role) => {
              setCurrentRole(role);
              setActiveTab('arena');
            }}
          />
        ) : currentRole === 'student' ? (
          /* Student View */
          <>
            {activeTab === 'arena' && (
              <StudentJoinScreen
                onJoinPin={handleJoinPin}
                onStartSolo={handleStartSolo}
                onBackToRoles={() => setCurrentRole(null)}
                onOpenThemes={() => setActiveTab('themes')}
                onOpenCryptogram={() => setActiveTab('cryptogram')}
                onOpenPictionary={() => setActiveTab('pictionary')}
                onOpenCards={() => setActiveTab('cards')}
                defaultName={playerName}
                setPlayerName={setPlayerName}
              />
            )}

            {activeTab === 'themes' && (
              <ThemeExplorer
                onStartThemeQuiz={(themeId) => handleStartSolo(themeId)}
              />
            )}

            {activeTab === 'cryptogram' && <CryptogramGame />}

            {activeTab === 'pictionary' && <PictionaryGame />}

            {activeTab === 'cards' && <CharacterCardsView />}
          </>
        ) : currentRole === 'teacher' ? (
          /* Teacher View */
          <TeacherDashboard onCreateRealtimeRoom={handleCreateRoomFromTeacher} />
        ) : (
          /* Admin View */
          <AdminAiStudio />
        )}
      </main>

      {/* PIN Join Modal */}
      <PinJoinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onJoin={handleJoinPin}
        defaultName={playerName}
      />

      {/* Footer */}
      <footer className="w-full border-t border-stone-800/80 bg-stone-950 py-6 px-4 sm:px-6 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-amber-400">
              ĐẤU TRƯỜNG LIÊN MÔN
            </span>
            <span>·</span>
            <span>Lịch Sử (Thời gian) – Địa Lý (Không gian) – Văn Học (Con người)</span>
          </div>
          <div className="text-[11px] text-stone-600">
            Ứng dụng quiz realtime đa nền tảng © {new Date().getFullYear()}
          </div>
        </div>
      </footer>
    </div>
  );
}
