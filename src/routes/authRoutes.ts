import { Router } from 'express';
import { registerController } from '../controllers/auth/register.controller';
import { verifyOtpController } from '../controllers/auth/verifyOtp.controller';
import { loginController } from '../controllers/auth/login.controller';
import { logoutController } from '../controllers/auth/logout.controller';
import { authenticateToken } from '../middleware/auth'; 

const router = Router(); 

router.post('/register', registerController); 
router.post('/verify-otp', verifyOtpController); 
router.post('/login', loginController); 
router.post('/logout', authenticateToken, logoutController); 

export default router;