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
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : authHeader;

    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ 
      message: error instanceof jwt.JsonWebTokenError 
        ? 'Token is not valid' 
        : 'Authentication failed' 
    });
  }
};