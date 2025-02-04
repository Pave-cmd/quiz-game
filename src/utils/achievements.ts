import { achievements } from '../data/achievements';
import { categories } from '../data/categories';
import { Achievement, CategoryStats } from '../types';
import { getUserStats, updateUserStats, getCategoryStats } from './storage';

const ACHIEVEMENT_CHECK_COOLDOWN = 1000; // 1 sekunda mezi kontrolami

export const checkAchievements = (): Achievement[] => {
  const userStats = getUserStats();
  const now = Date.now();

  // Předcházíme příliš častým kontrolám
  if (userStats.lastAchievementCheck && 
      now - userStats.lastAchievementCheck < ACHIEVEMENT_CHECK_COOLDOWN) {
    return [];
  }

  const categoryStats: Record<string, CategoryStats> = {};
  // Získáme statistiky všech kategorií
  categories.forEach(category => {
    const stats = getCategoryStats(category.id);
    categoryStats[category.id] = {
      ...stats,
      difficulty: category.difficulty
    };
  });

  const unlockedAchievements = userStats.achievements || [];
  const newAchievements: Achievement[] = [];

  // Kontrola všech achievementů
  achievements.forEach(achievement => {
    // Přeskočíme již získané achievementy
    if (unlockedAchievements.includes(achievement.id)) {
      return;
    }

    // Kontrola podmínky achievementu
    if (achievement.condition(userStats, categoryStats)) {
      newAchievements.push(achievement);
      unlockedAchievements.push(achievement.id);
    }
  });

  // Aktualizace statistik uživatele pokud byly získány nové achievementy
  if (newAchievements.length > 0) {
    updateUserStats({
      ...userStats,
      achievements: unlockedAchievements,
      lastAchievementCheck: now
    });
  }

  return newAchievements;
};

export const getAchievementProgress = (achievement: Achievement): number => {
  const userStats = getUserStats();
  const categoryStats: Record<string, CategoryStats> = {};
  
  categories.forEach(category => {
    const stats = getCategoryStats(category.id);
    categoryStats[category.id] = {
      ...stats,
      difficulty: category.difficulty
    };
  });

  // Mapování pro progress jednotlivých achievementů
  const progressMap: Record<string, () => number> = {
    'first_game': () => Math.min(userStats.gamesPlayed / 1 * 100, 100),
    'score_100': () => Math.min(userStats.totalScore / 100 * 100, 100),
    'score_1000': () => Math.min(userStats.totalScore / 1000 * 100, 100),
    'streak_5': () => Math.min(userStats.longestStreak / 5 * 100, 100),
    'streak_10': () => Math.min(userStats.longestStreak / 10 * 100, 100),
    'streak_20': () => Math.min(userStats.longestStreak / 20 * 100, 100),
    'category_master': () => {
      const values = Object.values(categoryStats);
      if (values.length === 0) return 0;
      const highestScore = Math.max(...values.map(cat => cat.bestScore));
      return Math.min(highestScore, 100);
    },
    'explorer': () => {
      const categoriesPlayed = Object.keys(categoryStats).length;
      return Math.min(categoriesPlayed / 5 * 100, 100);
    },
    'genius': () => {
      const hardCategories = Object.entries(categoryStats)
        .filter(([_, cat]) => cat.difficulty === 'hard');
      if (hardCategories.length === 0) return 0;
      const hardCategoryScore = Math.max(...hardCategories.map(([_, cat]) => cat.bestScore));
      return Math.min(hardCategoryScore, 100);
    }
  };

  return progressMap[achievement.id]?.() ?? 0;
};

export const getUnlockedAchievements = (): Achievement[] => {
  const userStats = getUserStats();
  const unlockedIds = userStats.achievements || [];
  return achievements.filter(achievement => unlockedIds.includes(achievement.id));
};

export const getLockedAchievements = (): Achievement[] => {
  const userStats = getUserStats();
  const unlockedIds = userStats.achievements || [];
  return achievements.filter(achievement => !unlockedIds.includes(achievement.id));
};