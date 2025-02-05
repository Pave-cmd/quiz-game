import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Interface pro rozšířený request
interface AuthRequest extends Request {
  userId?: string;
}

// Middleware funkce pro ověření JWT tokenu
export const auth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};