export type SubjectType = 'history' | 'geography' | 'literature' | 'interdisciplinary';

export interface InterdisciplinaryTheme {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  historyTime: string;
  geographySpace: string;
  literatureWorks: string;
  bannerImage?: string;
  keyFigures: string[];
  keyLocations: string[];
  keyLiteraryTexts: string[];
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  subject: SubjectType;
  themeId?: string;
  grade: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  historyLink: string;
  geographyLink: string;
  literatureLink: string;
  explanation: string;
  imageUrl?: string;
  hint?: string;
}

export interface PlayerPowerUps {
  literature2x: number;
  geo5050: number;
  historyHint: number;
  speedBoost: number;
}

export interface PlayerAnswerRecord {
  questionId: string;
  optionIndex: number;
  isCorrect: boolean;
  responseTime: number;
  scoreAwarded: number;
  combo: number;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  streak: number;
  maxStreak: number;
  correctCount: number;
  answersCount: number;
  totalResponseTime: number;
  isHost: boolean;
  isBot?: boolean;
  lastAnswer?: PlayerAnswerRecord;
  historyAnswers: PlayerAnswerRecord[];
  powerUps: PlayerPowerUps;
}

export type RoomStatus = 'LOBBY' | 'COUNTDOWN' | 'QUESTION' | 'REVEAL' | 'LEADERBOARD' | 'FINISHED';

export interface RoomState {
  code: string;
  title: string;
  hostId: string;
  status: RoomStatus;
  questions: Question[];
  currentQuestionIndex: number;
  questionStartTime: number; // epoch ms
  questionDuration: number; // seconds
  players: Record<string, Player>;
  themeId?: string;
  subject: string;
  grade: number;
  countdownValue?: number;
}

export interface CharacterCard {
  id: string;
  name: string;
  title: string;
  type: 'history' | 'literature' | 'geography';
  era: string;
  location: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quote: string;
  bio: string;
  imageUrl: string;
  stats: {
    historySkill: number;
    geoSkill: number;
    litSkill: number;
  };
}

export interface CryptogramItem {
  id: string;
  verseOrExcerpt: string;
  authorOrSource: string;
  clues: {
    geoClue: string;
    personClue: string;
    workClue: string;
    historyClue: string;
  };
  answers: {
    location: string;
    person: string;
    work: string;
    historyEvent: string;
  };
  options: {
    location: string[];
    person: string[];
    work: string[];
    historyEvent: string[];
  };
  interdisciplinaryLesson: string;
}

export interface PictionaryItem {
  id: string;
  keyword: string;
  subject: SubjectType;
  promptHint: string;
  theme: string;
  historyLink: string;
  geoLink: string;
  litLink: string;
  choices: string[];
}
