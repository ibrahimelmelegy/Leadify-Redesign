import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { sequelize, startHealthCheck, stopHealthCheck } from './config/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Global error handlers to prevent crashes
process.on('uncaughtException', (error: Error) => {
  console.error('❌ UNCAUGHT EXCEPTION - Server crashed:', error);
  console.error('Stack:', error.stack);
  // Log to monitoring service in production
  process.exit(1); // Exit gracefully - PM2/Docker will restart
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('❌ UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
  // Log to monitoring service in production
  process.exit(1);
});

// Graceful shutdown on SIGTERM/SIGINT
const gracefulShutdown = async (signal: string) => {
  console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

  try {
    // Stop health check
    stopHealthCheck();

    // Close database connections
    await sequelize.close();
    console.log('✅ Database connections closed');

    // Give time for pending requests to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✅ Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Test database connection and sync models
sequelize
  .authenticate()
  .then(async () => {
    console.log('✅ Database connection established successfully.');

    /**
     * IMPORTANT (Production Safety):
     * Avoid using `sync({ alter: true })` in production. It may mutate schema at runtime.
     *
     * Use migrations for production deployments.
     * For local/dev convenience you may enable sync via:
     *  - DB_SYNC=true
     *  - DB_SYNC_ALTER=true (optional)
     */
    const shouldSync = (process.env.DB_SYNC || '').toLowerCase() === 'true';
    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    const shouldAlter = !isProd && (process.env.DB_SYNC_ALTER || '').toLowerCase() === 'true';
    if (shouldSync) {
      await sequelize.sync(shouldAlter ? { alter: true } : undefined);
      console.log('✅ Database tables synchronized successfully.');
    } else {
      console.log('ℹ️  DB sync is disabled (recommended for production).');
    }

    // Start the Express server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📊 API Documentation: http://localhost:${PORT}/api-docs`);

      // Start database health monitoring
      startHealthCheck();
      console.log('💓 Database health check started');
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });
  })
  .catch((err: Error) => {
    console.error('❌ Unable to connect to the database:', err.message);
    console.error('Stack:', err.stack);
    // Retry connection after 5 seconds
    console.log('⏳ Retrying database connection in 5 seconds...');
    setTimeout(() => {
      process.exit(1); // Exit and let PM2/Docker restart
    }, 5000);
  });
