import { Request, Response } from 'express';
import { User } from '../../models';

export async function getProfileController(req: Request, res: Response) {
  const userId = req.user?.id; 

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized context missing' }); 
  }

  const user = await User.findByPk(userId, {
    attributes: ['id', 'email', 'isVerified', 'createdAt'], 
  });

  if (!user) {
    return res.status(404).json({ error: 'User profile not found' }); 
  }

  return res.status(200).json({ user }); 
}