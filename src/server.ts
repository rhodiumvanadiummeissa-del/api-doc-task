import dotenv from 'dotenv';
import app from './app';
import { sequelize } from './config/database';
import { logger } from './config/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info('PostgreSQL database connected successfully.');

    // Sync database models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });

    app.listen(PORT, () => {
      logger.info(`Production-grade Auth API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();