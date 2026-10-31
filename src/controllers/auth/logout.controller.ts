import { Request, Response } from 'express';

export async function logoutController(_req: Request, res: Response) {
  return res.status(200).json({ message: 'Logout successful' }); 
}