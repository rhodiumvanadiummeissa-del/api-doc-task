import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../models';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_production_jwt_key_2026'; 

export async function loginController(req: Request, res: Response) {
  const { email, password } = req.body; 

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' }); 
  }

  const user = await User.findOne({ where: { email } }); 
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' }); 
  }

  const isPasswordValid = await bcrypt.compare(password, user.password); 
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials' }); 
  }

  if (!user.isVerified) {
    return res.status(403).json({ error: 'Email account not verified. Please verify via OTP.' }); 
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' }); 

  return res.status(200).json({ message: 'Login successful', token }); 
}