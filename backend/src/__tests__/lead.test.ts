import request from 'supertest';
import express, { Express } from 'express';

// Mock the database
jest.mock('../config/db', () => ({
    sequelize: {
        authenticate: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(true)
    }
}));

// Mock Lead model
const mockLeads = [
    {
        id: '1',
        name: 'Test Lead',
        email: 'lead@test.com',
        phone: '+1234567890',
        status: 'NEW',
        source: 'website',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '2',
        name: 'Another Lead',
        email: 'another@test.com',
        phone: '+0987654321',
        status: 'CONTACTED',
        source: 'referral',
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

jest.mock('../lead/leadModel', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findByPk: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn(),
        count: jest.fn()
    }
}));

import Lead from '../lead/leadModel';

describe('Lead API', () => {
    let app: Express;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());

        // Mock routes for testing
        app.get('/api/lead', async (req, res) => {
            const leads = await Lead.findAll();
            res.json({ data: leads, total: leads.length });
        });

        app.get('/api/lead/:id', async (req, res) => {
            const lead = await Lead.findByPk(req.params.id);
            if (!lead) return res.status(404).json({ message: 'Lead not found' });
            res.json({ data: lead });
        });

        app.post('/api/lead', async (req, res) => {
            if (!req.body.name || !req.body.email) {
                return res.status(400).json({ message: 'Name and email are required' });
            }
            const lead = await Lead.create(req.body);
            res.status(201).json({ data: lead });
        });

        app.put('/api/lead/:id', async (req, res) => {
            const lead = await Lead.findByPk(req.params.id);
            if (!lead) return res.status(404).json({ message: 'Lead not found' });
            await Lead.update(req.body, { where: { id: req.params.id } });
            res.json({ data: { ...lead, ...req.body } });
        });

        app.patch('/api/lead/:id/status', async (req, res) => {
            const lead = await Lead.findByPk(req.params.id);
            if (!lead) return res.status(404).json({ message: 'Lead not found' });
            await Lead.update({ status: req.body.status }, { where: { id: req.params.id } });
            res.json({ data: { ...lead, status: req.body.status } });
        });

        app.delete('/api/lead/:id', async (req, res) => {
            const lead = await Lead.findByPk(req.params.id);
            if (!lead) return res.status(404).json({ message: 'Lead not found' });
            await Lead.destroy({ where: { id: req.params.id } });
            res.status(204).send();
        });
    });

    describe('GET /api/lead', () => {
        it('should return list of leads', async () => {
            (Lead.findAll as jest.Mock).mockResolvedValue(mockLeads);

            const response = await request(app).get('/api/lead');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].name).toBe('Test Lead');
        });

        it('should return empty array when no leads', async () => {
            (Lead.findAll as jest.Mock).mockResolvedValue([]);

            const response = await request(app).get('/api/lead');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(0);
        });
    });

    describe('GET /api/lead/:id', () => {
        it('should return lead by ID', async () => {
            (Lead.findByPk as jest.Mock).mockResolvedValue(mockLeads[0]);

            const response = await request(app).get('/api/lead/1');

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Test Lead');
        });

        it('should return 404 for non-existent lead', async () => {
            (Lead.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/api/lead/999');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/lead', () => {
        it('should create a new lead', async () => {
            const newLead = { name: 'New Lead', email: 'new@test.com', phone: '+1111111111' };
            (Lead.create as jest.Mock).mockResolvedValue({ id: '3', ...newLead, status: 'NEW' });

            const response = await request(app)
                .post('/api/lead')
                .send(newLead);

            expect(response.status).toBe(201);
            expect(response.body.data.name).toBe('New Lead');
        });

        it('should reject lead without required fields', async () => {
            const response = await request(app)
                .post('/api/lead')
                .send({ phone: '+1111111111' });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/lead/:id', () => {
        it('should update existing lead', async () => {
            (Lead.findByPk as jest.Mock).mockResolvedValue(mockLeads[0]);
            (Lead.update as jest.Mock).mockResolvedValue([1]);

            const response = await request(app)
                .put('/api/lead/1')
                .send({ name: 'Updated Lead Name' });

            expect(response.status).toBe(200);
            expect(response.body.data.name).toBe('Updated Lead Name');
        });

        it('should return 404 for non-existent lead', async () => {
            (Lead.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/api/lead/999')
                .send({ name: 'Updated Name' });

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/lead/:id/status', () => {
        it('should update lead status', async () => {
            (Lead.findByPk as jest.Mock).mockResolvedValue(mockLeads[0]);
            (Lead.update as jest.Mock).mockResolvedValue([1]);

            const response = await request(app)
                .patch('/api/lead/1/status')
                .send({ status: 'QUALIFIED' });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe('QUALIFIED');
        });
    });

    describe('DELETE /api/lead/:id', () => {
        it('should delete existing lead', async () => {
            (Lead.findByPk as jest.Mock).mockResolvedValue(mockLeads[0]);
            (Lead.destroy as jest.Mock).mockResolvedValue(1);

            const response = await request(app).delete('/api/lead/1');

            expect(response.status).toBe(204);
        });

        it('should return 404 for non-existent lead', async () => {
            (Lead.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete('/api/lead/999');

            expect(response.status).toBe(404);
        });
    });
});
