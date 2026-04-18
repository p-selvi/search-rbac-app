import { Request, Response, NextFunction } from 'express';
import { Role, User } from '../types/express';


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Unauthorized.' });
  }

  const mockUser: User = {
    id: 'user_12345',
    role: Role.CONTRIBUTOR,
  };

  req.user = mockUser;
  next();
};


export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Forbidden: You do not have permission to access this resource.' 
      });
    }

    next();
  };
};
