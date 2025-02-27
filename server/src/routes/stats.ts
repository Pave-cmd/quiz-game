import express, { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

import { auth } from '../middleware/auth';
import User from '../models/User';

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

interface CategoryStats {
  categoryId: string;
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
}

interface UserStats {
  highScore: number;
  gamesPlayed: number;
  totalScore: number;
  longestStreak: number;
  questionsAnswered: number;
  correctAnswers: number;
  achievements: string[];
  lastAchievementCheck: number;
  levelInfo: {
    currentLevel: number;
    currentXP: number;
    xpToNextLevel: number;
    totalXP: number;
  };
}

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  stats: UserStats;
  categoryStats: CategoryStats[];
}

// Získání uživatelských statistik
router.get('/user', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser | null;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(user.stats);
  } catch (error) {
    next(error);
  }
});

// Aktualizace uživatelských statistik
router.patch('/user', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updates = req.body as Partial<UserStats>;
    const user = await User.findById(req.userId) as IUser | null;
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    Object.assign(user.stats, updates);
    await user.save();

    res.json(user.stats);
  } catch (error) {
    next(error);
  }
});

// Získání statistik kategorie
router.get('/category/:categoryId', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const user = await User.findById(req.userId) as IUser | null;
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const categoryStats = user.categoryStats.find(
      (stats: CategoryStats) => stats.categoryId === categoryId
    ) || {
      categoryId,
      gamesPlayed: 0,
      bestScore: 0,
      averageScore: 0
    };

    res.json(categoryStats);
  } catch (error) {
    next(error);
  }
});

// Aktualizace statistik kategorie
router.patch('/category/:categoryId', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categoryId } = req.params;
    const { score } = req.body;
    const user = await User.findById(req.userId) as IUser | null;
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    let categoryStats = user.categoryStats.find(
      (stats: CategoryStats) => stats.categoryId === categoryId
    );

    if (!categoryStats) {
      categoryStats = {
        categoryId,
        gamesPlayed: 0,
        bestScore: 0,
        averageScore: 0
      };
      user.categoryStats.push(categoryStats);
    }

    categoryStats.gamesPlayed += 1;
    categoryStats.bestScore = Math.max(categoryStats.bestScore, score);
    categoryStats.averageScore = Math.round(
      (categoryStats.averageScore * (categoryStats.gamesPlayed - 1) + score) / 
      categoryStats.gamesPlayed
    );

    await user.save();
    res.json(categoryStats);
  } catch (error) {
    next(error);
  }
});

export default router;