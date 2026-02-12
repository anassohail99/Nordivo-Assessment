import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDatabase } from './utils/database';
import redis from './utils/redis';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Try Redis connection if available
    if (process.env.REDIS_URL) {
      try {
        await redis.connect?.();
        await redis.ping();
        console.log('Redis connection verified');
      } catch (error) {
        console.warn('Running without Redis cache - some features may be limited');
      }
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      if (!process.env.REDIS_URL) {
        console.log('Note: Running without Redis (development mode)');
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle shutdown gracefully
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  try {
    await redis.quit?.();
  } catch (e) {}
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  try {
    await redis.quit?.();
  } catch (e) {}
  process.exit(0);
});

startServer();
