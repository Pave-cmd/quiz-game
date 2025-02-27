import express, { Request, Response } from 'express';
import { Document } from 'mongoose';

import User from '../models/User';

const router = express.Router();

// Interface pro User dokument
interface IUser extends Document {
  username: string;
  stats: {
    highScore: number;
    totalScore: number;
  };
  categoryStats: Array<{
    categoryId: string;
    bestScore: number;
  }>;
}

// Získání celkového žebříčku
router.get('/', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    
    const leaderboard = await User.find({})
      .select('username stats.highScore stats.totalScore')
      .sort({ 'stats.highScore': -1 })
      .limit(limit) as IUser[];

    res.json(leaderboard.map(user => ({
      username: user.username,
      highScore: user.stats?.highScore || 0,
      totalScore: user.stats?.totalScore || 0
    })));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Získání žebříčku pro kategorii
router.get('/category/:categoryId', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const users = await User.find({
      'categoryStats.categoryId': categoryId
    })
    .select('username categoryStats')
    .limit(limit) as IUser[];

    const leaderboard = users
      .map(user => {
        const categoryStats = user.categoryStats?.find(
          stats => stats.categoryId === categoryId
        );
        return {
          username: user.username,
          bestScore: categoryStats?.bestScore || 0
        };
      })
      .sort((a, b) => b.bestScore - a.bestScore);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;