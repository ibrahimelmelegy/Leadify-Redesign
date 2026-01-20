import request from 'supertest';
import express, { Express } from 'express';

// Mock the database
jest.mock('../config/db', () => ({
    sequelize: {
        authenticate: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(true)
    }
}));

// Mock User model
const mockUsers = [
    { id: '1', name: 'Admin User', email: 'admin@leadify.com', roleId: 'admin', isActive: true },
    { id: '2', name: 'Test User', email: 'test@leadify.com', roleId: 'user', isActive: true }
];

jest.mock('../user/userModel', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
    }
}));

import User from '../user/userModel';

describe('User API', () => {
    let app: Express;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());

        // Simple mock routes for testing
        app.get('/api/users', async (req, res) => {
            const users = await User.findAll();
            res.json({ data: users });
        });

        app.get('/api/users/:id', async (req, res) => {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json({ data: user });
        });

        app.post('/api/users', async (req, res) => {
            const user = await User.create(req.body);
            res.status(201).json({ data: user });
        });

        app.put('/api/users/:id', async (req, res) => {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            await User.update(req.body, { where: { id: req.params.id } });
            res.json({ data: { ...user, ...req.body } });
        });

        app.delete('/api/users/:id', async (req, res) => {
            const user = await User.findByPk(req.params.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            await User.destroy({ where: { id: req.params.id } });
            res.status(204).send();
        });
    });

    describe('GET /api/users', () => {
        it('should return list of users', async () => {
            (User.findAll as jest.Mock).mockResolvedValue(mockUsers);

            const response = await request(app).get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].email).toBe('admin@leadify.com');
        });

        it('should return empty array when no users', async () => {
            (User.findAll as jest.Mock).mockResolvedValue([]);

            const response = await request(app).get('/api/users');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(0);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return user by ID', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(mockUsers[0]);

            const response = await request(app).get('/api/users/1');

            expect(response.status).toBe(200);
            expect(response.body.data.email).toBe('admin@leadify.com');
        });

        it('should return 404 for non-existent user', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/api/users/999');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = { name: 'New User', email: 'new@leadify.com', password: 'password123' };
            (User.create as jest.Mock).mockResolvedValue({ id: '3', ...newUser });

            const response = await request(app)
                .post('/api/users')
                .send(newUser);

            expect(response.status).toBe(201);
            expect(response.body.data.email).toBe('new@leadify.com');
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update existing user', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(mockUsers[0]);
            (User.update as jest.Mock).mockResolvedValue([1]);

            const response = await request(app)
                .put('/api/users/1')
                .send({ name: 'Updated Name' });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Name');
        });

        it('should return 404 for non-existent user', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/api/users/999')
                .send({ name: 'Updated Name' });

            expect(response.status).toBe(404);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete existing user', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(mockUsers[0]);
            (User.destroy as jest.Mock).mockResolvedValue(1);

            const response = await request(app).delete('/api/users/1');

            expect(response.status).toBe(204);
        });

        it('should return 404 for non-existent user', async () => {
            (User.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete('/api/users/999');

            expect(response.status).toBe(404);
        });
    });
});
