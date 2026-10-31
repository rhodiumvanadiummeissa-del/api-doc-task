import { Router } from 'express';
import { getProfileController } from '../controllers/user/profile.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticateToken, getProfileController);

export default router;