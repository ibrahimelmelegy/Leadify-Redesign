import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db';
import Role from '../role/roleModel';
import User from '../user/userModel';

async function createSuperAdmin() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Connection established.');

        // Find or create Admin role
        let adminRole = await Role.findOne({ where: { name: 'admin' } });
        if (!adminRole) {
            console.log('Creating Admin role...');
            adminRole = await Role.create({
                name: 'admin',
                description: 'Administrator with full access',
                permissions: ['all']
            });
        }

        const email = 'superadmin@leadify.com';
        const password = 'admin123';

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        const hashedPassword = await bcrypt.hash(password, 10);

        if (user) {
            console.log('Updating existing superadmin user...');
            user.password = hashedPassword;
            user.roleId = adminRole!.id;
            user.status = 'ACTIVE';
            await user.save();
        } else {
            console.log('Creating new superadmin user...');
            await User.create({
                name: 'Super Admin',
                email: email,
                password: hashedPassword,
                roleId: adminRole!.id,
                status: 'ACTIVE'
            });
        }

        console.log('Super Admin user ready.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('Error creating super admin:', error);
        process.exit(1);
    }
}

createSuperAdmin();
