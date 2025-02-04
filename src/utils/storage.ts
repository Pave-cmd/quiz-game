import { UserStats } from '../types';

const STATS_KEY = 'quiz_user_stats';
const CATEGORY_STATS_KEY = 'quiz_category_stats';

export const getUserStats = (): UserStats => {
  const stats = localStorage.getItem(STATS_KEY);
  if (!stats) {
    return {
      highScore: 0,
      gamesPlayed: 0,
      totalScore: 0,
      longestStreak: 0,
      achievements: [],
      lastAchievementCheck: 0
    };
  }
  return JSON.parse(stats);
};

export const updateUserStats = (newStats: Partial<UserStats>) => {
  const currentStats = getUserStats();
  const updatedStats = {
    ...currentStats,
    ...newStats,
    highScore: Math.max(currentStats.highScore, newStats.highScore || 0)
  };
  localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
};

export const getCategoryStats = (categoryId: string) => {
  const stats = localStorage.getItem(`${CATEGORY_STATS_KEY}_${categoryId}`);
  if (!stats) {
    return {
      gamesPlayed: 0,
      bestScore: 0,
      averageScore: 0
    };
  }
  return JSON.parse(stats);
};

export const updateCategoryStats = (categoryId: string, score: number) => {
  const stats = getCategoryStats(categoryId);
  const newStats = {
    gamesPlayed: stats.gamesPlayed + 1,
    bestScore: Math.max(stats.bestScore, score),
    averageScore: Math.round((stats.averageScore * stats.gamesPlayed + score) / (stats.gamesPlayed + 1))
  };
  localStorage.setItem(`${CATEGORY_STATS_KEY}_${categoryId}`, JSON.stringify(newStats));
};

export const getUnlockedAchievements = (): string[] => {
  const stats = getUserStats();
  return stats.achievements || [];
};

export const unlockAchievement = (achievementId: string) => {
  const stats = getUserStats();
  const achievements = stats.achievements || [];
  
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId);
    updateUserStats({
      ...stats,
      achievements,
      lastAchievementCheck: Date.now()
    });
    return true;
  }
  return false;
};

interface AnswerData {
  timeLeft: number;
  isCorrect: boolean;
}

export const trackAnswerForAchievements = (data: AnswerData) => {
  const { timeLeft, isCorrect } = data;
  
  if (!isCorrect) return;
  
  // Sledování rychlých odpovědí
  if (timeLeft >= 27) { // Odpověď pod 3 sekundy
    unlockAchievement('speed_demon');
  }
  
  // Sledování odpovědí v poslední sekundě
  if (timeLeft === 1) {
    unlockAchievement('perfect_timing');
  }
};