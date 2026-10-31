import { Request, Response } from 'express';
import { User, Otp } from '../../models';

export async function verifyOtpController(req: Request, res: Response) {
  const { userId, code } = req.body; 

  if (!userId || !code) {
    return res.status(400).json({ error: 'userId and OTP code are required' }); 
  }

  const user = await User.findByPk(userId); 
  if (!user) {
    return res.status(404).json({ error: 'User not found' }); 
  }

  const otpRecord = await Otp.findOne({
    where: { userId, code }, 
    order: [['createdAt', 'DESC']], 
  });

  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid OTP code' }); 
  }

  if (new Date() > otpRecord.expiresAt) {
    return res.status(400).json({ error: 'OTP code has expired' }); 
  }

  user.isVerified = true; 
  await user.save(); 
  await Otp.destroy({ where: { userId } }); 

  return res.status(200).json({ message: 'Email account successfully verified' }); 
}