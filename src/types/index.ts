import { SvgIconComponent } from '@mui/icons-material';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
}

export interface GameState {
  score: number;
  currentQuestion: number;
  isGameOver: boolean;
  streak: number;
  totalQuestions?: number;
}

export interface UserStats {
  highScore: number;
  gamesPlayed: number;
  totalScore: number;
  longestStreak: number;
  questionsAnswered?: number;
  correctAnswers?: number;
  achievements?: string[]; // Přidáno pro sledování získaných achievementů
  lastAchievementCheck?: number; // Timestamp poslední kontroly achievementů
}

export interface Category {
  id: string;
  name: string;
  icon: SvgIconComponent;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionsCount: number;
  color: string;
}

export interface AllCategoriesStats {
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
  questionsAnswered: number;
  correctAnswers: number;
}

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: SvgIconComponent;
  condition: (stats: UserStats, categoryStats?: Record<string, CategoryStats>) => boolean;
  rarity: AchievementRarity;
}

export interface AchievementCategory {
  id: string;
  name: string;
  icon: SvgIconComponent;
  color: string;
}

export interface CategoryStats {
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}