import { LevelSystem, LevelRequirement, UserStats } from '../shared/types';

export const LEVEL_REQUIREMENTS: LevelRequirement[] = [
  { level: 1, xpNeeded: 0 },
  { level: 2, xpNeeded: 100, rewards: { title: "Nováček", bonus: 10 } },
  { level: 3, xpNeeded: 250, rewards: { title: "Učeň", bonus: 15 } },
  { level: 4, xpNeeded: 500, rewards: { title: "Student", bonus: 20 } },
  { level: 5, xpNeeded: 1000, rewards: { title: "Znalec", bonus: 25 } }
];

export const calculateXPForAnswer = (
  isCorrect: boolean,
  timeLeft: number,
  difficulty: string,
  streak: number
): number => {
  if (!isCorrect) return 0;

  let baseXP = 10;
  
  // Bonus za rychlost odpovědi
  const timeBonus = Math.floor(timeLeft * 0.5);
  
  // Bonus za obtížnost
  const difficultyMultiplier = {
    easy: 1,
    medium: 1.5,
    hard: 2
  }[difficulty] || 1;
  
  // Bonus za streak
  const streakBonus = Math.floor(streak * 0.5);

  return Math.floor((baseXP + timeBonus + streakBonus) * difficultyMultiplier);
};

export const getLevelInfo = (totalXP: number): LevelSystem => {
  let currentLevel = 1;
  let xpToNextLevel = 100;

  for (let i = 0; i < LEVEL_REQUIREMENTS.length; i++) {
    if (totalXP >= LEVEL_REQUIREMENTS[i].xpNeeded) {
      currentLevel = LEVEL_REQUIREMENTS[i].level;
      xpToNextLevel = 
        (LEVEL_REQUIREMENTS[i + 1]?.xpNeeded || Infinity) - totalXP;
    } else {
      break;
    }
  }

  return {
    currentLevel,
    currentXP: totalXP,
    xpToNextLevel,
    totalXP
  };
};

export const updateLevelProgress = (
  currentStats: UserStats,
  xpGained: number
): UserStats => {
  const newTotalXP = (currentStats.levelInfo?.totalXP || 0) + xpGained;
  const newLevelInfo = getLevelInfo(newTotalXP);

  // Kontrola, zda došlo k postupu na nový level
  const oldLevel = currentStats.levelInfo?.currentLevel || 1;
  if (newLevelInfo.currentLevel > oldLevel) {
    console.log(`Level Up! ${oldLevel} -> ${newLevelInfo.currentLevel}`);
  }

  return {
    ...currentStats,
    levelInfo: newLevelInfo
  };
};