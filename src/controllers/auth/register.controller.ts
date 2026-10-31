import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, Otp } from '../../models';
import { sendOtpEmail } from '../../services/emailService';

export async function registerController(req: Request, res: Response) {
  const { email, password } = req.body; //

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' }); 
  }

  const existingUser = await User.findOne({ where: { email } }); 
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' }); 
  }

  const hashedPassword = await bcrypt.hash(password, 10); 
  const newUser = await User.create({ email, password: hashedPassword }); 

  // Generate 6-digit OTP code[cite: 1]
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); 
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes[cite: 1]

  await Otp.create({ userId: newUser.id, code: otpCode, expiresAt }); 
  await sendOtpEmail(email, otpCode); 

  return res.status(201).json({
    message: 'User registered. Please verify your account using the OTP code sent to your email.', 
    userId: newUser.id, 
  });
}