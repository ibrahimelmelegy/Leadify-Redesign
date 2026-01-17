import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db';
import Role from '../role/roleModel';
import User from '../user/userModel';

async function seed() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connection established.');

        // Sync database
        console.log('Syncing database...');
        await sequelize.sync({ alter: true });

        // Check if Admin role exists
        let adminRole = await Role.findOne({ where: { name: 'admin' } });
        if (!adminRole) {
            console.log('Creating Admin role...');
            adminRole = await Role.create({
                name: 'admin',
                description: 'Administrator with full access',
                permissions: ['all']
            });
        } else {
            console.log('Admin role already exists.');
        }

        // Check if Admin user exists
        const adminEmail = 'admin@leadify.com';
        let adminUser = await User.findOne({ where: { email: adminEmail } });
        if (!adminUser) {
            console.log('Creating Admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: hashedPassword,
                roleId: adminRole.id,
                status: 'ACTIVE'
            });
            console.log('Admin user created successfully.');
        } else {
            console.log('Admin user already exists.');
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect or seed:', error);
        process.exit(1);
    }
}

seed();
