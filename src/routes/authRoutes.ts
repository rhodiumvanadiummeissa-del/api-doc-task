import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Otp } from '../models';
import { sendOtpEmail } from '../services/emailService';
import { authenticateToken } from '../middleware/auth';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_production_jwt_key_2026';

// 1. POST /api/v1/auth/register
router.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });

  // Generate 6-digit OTP code
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiration

  await Otp.create({ userId: newUser.id, code: otpCode, expiresAt });

  // Dummy dispatch: Logs to console
  await sendOtpEmail(email, otpCode);

  return res.status(201).json({
    message: 'User registered. Please verify your account using the OTP code sent to your email (logged to server console).',
    userId: newUser.id,
  });
});

// 2. POST /api/v1/auth/verify-otp
router.post('/verify-otp', async (req: Request, res: Response) => {
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

  // Mark user as verified & delete used OTPs
  user.isVerified = true;
  await user.save();
  await Otp.destroy({ where: { userId } });

  return res.status(200).json({ message: 'Email account successfully verified' });
});

// 3. POST /api/v1/auth/login
router.post('/login', async (req: Request, res: Response) => {
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
});

// 4. GET /api/v1/user/profile (Protected Route)
router.get('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const user = await User.findByPk(req.user?.id, {
    attributes: ['id', 'email', 'isVerified', 'createdAt'],
  });

  if (!user) {
    return res.status(404).json({ error: 'User profile not found' });
  }

  return res.status(200).json({ user });
});

// 5. POST /api/v1/auth/logout
router.post('/logout', authenticateToken, (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'Logout successful' });
});

export default router;