import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { authRateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Mounted Routers
app.use('/api/v1/auth', authRateLimiter, authRoutes);
app.use('/api/v1/user', userRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;