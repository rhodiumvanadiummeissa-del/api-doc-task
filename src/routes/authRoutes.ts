import { Router } from 'express';
import { registerController } from '../controllers/auth/register.controller';
import { loginController } from '../controllers/auth/login.controller';

const router = Router(); 

router.post('/register', registerController); 
router.post('/login', loginController); 

export default router;