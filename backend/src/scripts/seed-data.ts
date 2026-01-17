import { sequelize } from '../config/db';
import Lead from '../lead/leadModel';
import Client from '../client/clientModel';
import User from '../user/userModel';

async function seedData() {
    try {
        const isConn = await sequelize.authenticate();
        console.log('Connection established.');

        const admin = await User.findOne({ where: { email: 'admin@leadify.com' } });
        if (!admin) {
            console.error('Admin user not found. Please run seed.ts first.');
            process.exit(1);
        }

        console.log('Creating dummy leads...');
        await Lead.bulkCreate([
            { name: 'John Doe', companyName: 'Tech Corp', email: 'john@tech.com', phone: '1234567890', status: 'NEW' },
            { name: 'Jane Smith', companyName: 'Inno Soft', email: 'jane@inno.com', phone: '0987654321', status: 'CONTACTED' }
        ]);

        console.log('Creating dummy clients...');
        await Client.bulkCreate([
            { clientName: 'Alice Brown', email: 'alice@client.com', phoneNumber: '1122334455', clientStatus: 'ACTIVE' },
            { clientName: 'Bob White', email: 'bob@client.com', phoneNumber: '5544332211', clientStatus: 'ACTIVE' }
        ]);

        console.log('Dummy data seeded successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Unable to seed dummy data:', error);
        process.exit(1);
    }
}

seedData();
