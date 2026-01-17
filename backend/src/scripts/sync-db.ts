import { sequelize } from '../config/db';

async function sync() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connection established.');

        // Force alter to ensure schema matches models
        console.log('Syncing database...');
        await sequelize.sync({ alter: true });
        console.log('Database synchronized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect or sync:', error);
        process.exit(1);
    }
}

sync();
