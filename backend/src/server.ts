import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { sequelize } from './config/db';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;

// Test database connection and sync models
sequelize
  .authenticate()
  .then(async () => {
    console.log('Database connection established successfully.');

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
      console.log('Database tables synchronized successfully.');
    } else {
      console.log('DB sync is disabled (recommended for production).');
    }

    // Start the Express server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Unable to connect to the database:', err.message);
  });
