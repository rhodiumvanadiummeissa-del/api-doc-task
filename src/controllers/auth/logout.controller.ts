import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenBlacklist } from '../../models';

export async function logoutController(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: 'Token is required for logout' });
    }

    // Decode the token payload to obtain expiration date
    const decoded = jwt.decode(token) as { exp?: number } | null;
    const expiresAt = decoded?.exp
      ? new Date(decoded.exp * 1000)
      : new Date(Date.now() + 60 * 60 * 1000); // 1-hour fallback

    // Record token in the database blacklist
    await TokenBlacklist.findOrCreate({
      where: { token },
      defaults: { token, expiresAt },
    });

    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
}