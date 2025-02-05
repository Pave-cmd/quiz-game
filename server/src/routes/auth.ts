import express, { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { auth } from '../middleware/auth';
import { Document } from 'mongoose';

const router: Router = express.Router();

// Definice interface pro User dokument
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  stats: {
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
  };
  categoryStats: Array<{
    categoryId: string;
    gamesPlayed: number;
    bestScore: number;
    averageScore: number;
  }>;
}

// Interface pro AuthRequest
interface AuthRequest extends Request {
  userId?: string;
}

// Registrace
router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// Přihlášení
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }) as IUser | null;
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

// Verifikace tokenu
router.get('/verify', auth, async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.userId) as IUser | null;
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;