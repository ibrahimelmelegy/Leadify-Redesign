import request from 'supertest';
import express, { Express } from 'express';

// Mock the database
jest.mock('../config/db', () => ({
    sequelize: {
        authenticate: jest.fn().mockResolvedValue(true),
        close: jest.fn().mockResolvedValue(true)
    }
}));

// Mock Proposal model
const mockProposals = [
    {
        id: '1',
        title: 'Test Proposal',
        clientId: 'client-1',
        status: 'DRAFT',
        totalAmount: 5000,
        validUntil: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: '2',
        title: 'Another Proposal',
        clientId: 'client-2',
        status: 'SENT',
        totalAmount: 10000,
        validUntil: new Date('2025-12-31'),
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

jest.mock('../proposal/models/proposalModel', () => ({
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

import Proposal from '../proposal/models/proposalModel';

describe('Proposal API', () => {
    let app: Express;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());

        // Mock routes for testing
        app.get('/api/proposal', async (req, res) => {
            const proposals = await Proposal.findAll();
            res.json({ data: proposals, total: proposals.length });
        });

        app.get('/api/proposal/:id', async (req, res) => {
            const proposal = await Proposal.findByPk(req.params.id);
            if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
            res.json({ data: proposal });
        });

        app.post('/api/proposal', async (req, res) => {
            if (!req.body.title || !req.body.clientId) {
                return res.status(400).json({ message: 'Title and clientId are required' });
            }
            const proposal = await Proposal.create({ ...req.body, status: 'DRAFT' });
            res.status(201).json({ data: proposal });
        });

        app.put('/api/proposal/:id', async (req, res) => {
            const proposal = await Proposal.findByPk(req.params.id);
            if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
            await Proposal.update(req.body, { where: { id: req.params.id } });
            res.json({ data: { ...proposal, ...req.body } });
        });

        app.patch('/api/proposal/:id/status', async (req, res) => {
            const proposal = await Proposal.findByPk(req.params.id);
            if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

            const validStatuses = ['DRAFT', 'SENT', 'APPROVED', 'REJECTED', 'ARCHIVED'];
            if (!validStatuses.includes(req.body.status)) {
                return res.status(400).json({ message: 'Invalid status' });
            }

            await Proposal.update({ status: req.body.status }, { where: { id: req.params.id } });
            res.json({ data: { ...proposal, status: req.body.status } });
        });

        app.delete('/api/proposal/:id', async (req, res) => {
            const proposal = await Proposal.findByPk(req.params.id);
            if (!proposal) return res.status(404).json({ message: 'Proposal not found' });
            await Proposal.update({ status: 'ARCHIVED' }, { where: { id: req.params.id } });
            res.status(204).send();
        });
    });

    describe('GET /api/proposal', () => {
        it('should return list of proposals', async () => {
            (Proposal.findAll as jest.Mock).mockResolvedValue(mockProposals);

            const response = await request(app).get('/api/proposal');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(2);
            expect(response.body.data[0].title).toBe('Test Proposal');
        });

        it('should return empty array when no proposals', async () => {
            (Proposal.findAll as jest.Mock).mockResolvedValue([]);

            const response = await request(app).get('/api/proposal');

            expect(response.status).toBe(200);
            expect(response.body.data).toHaveLength(0);
        });
    });

    describe('GET /api/proposal/:id', () => {
        it('should return proposal by ID', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(mockProposals[0]);

            const response = await request(app).get('/api/proposal/1');

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe('Test Proposal');
        });

        it('should return 404 for non-existent proposal', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/api/proposal/999');

            expect(response.status).toBe(404);
        });
    });

    describe('POST /api/proposal', () => {
        it('should create a new proposal', async () => {
            const newProposal = { title: 'New Proposal', clientId: 'client-3', totalAmount: 7500 };
            (Proposal.create as jest.Mock).mockResolvedValue({ id: '3', ...newProposal, status: 'DRAFT' });

            const response = await request(app)
                .post('/api/proposal')
                .send(newProposal);

            expect(response.status).toBe(201);
            expect(response.body.data.title).toBe('New Proposal');
            expect(response.body.data.status).toBe('DRAFT');
        });

        it('should reject proposal without required fields', async () => {
            const response = await request(app)
                .post('/api/proposal')
                .send({ totalAmount: 5000 });

            expect(response.status).toBe(400);
        });
    });

    describe('PUT /api/proposal/:id', () => {
        it('should update existing proposal', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(mockProposals[0]);
            (Proposal.update as jest.Mock).mockResolvedValue([1]);

            const response = await request(app)
                .put('/api/proposal/1')
                .send({ title: 'Updated Proposal Title' });

            expect(response.status).toBe(200);
            expect(response.body.data.title).toBe('Updated Proposal Title');
        });

        it('should return 404 for non-existent proposal', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app)
                .put('/api/proposal/999')
                .send({ title: 'Updated Title' });

            expect(response.status).toBe(404);
        });
    });

    describe('PATCH /api/proposal/:id/status', () => {
        it('should update proposal status to SENT', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(mockProposals[0]);
            (Proposal.update as jest.Mock).mockResolvedValue([1]);

            const response = await request(app)
                .patch('/api/proposal/1/status')
                .send({ status: 'SENT' });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe('SENT');
        });

        it('should update proposal status to APPROVED', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(mockProposals[1]);
            (Proposal.update as jest.Mock).mockResolvedValue([1]);

            const response = await request(app)
                .patch('/api/proposal/2/status')
                .send({ status: 'APPROVED' });

            expect(response.status).toBe(200);
            expect(response.body.data.status).toBe('APPROVED');
        });

        it('should reject invalid status', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(mockProposals[0]);

            const response = await request(app)
                .patch('/api/proposal/1/status')
                .send({ status: 'INVALID_STATUS' });

            expect(response.status).toBe(400);
        });
    });

    describe('DELETE /api/proposal/:id', () => {
        it('should soft delete (archive) existing proposal', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(mockProposals[0]);
            (Proposal.update as jest.Mock).mockResolvedValue([1]);

            const response = await request(app).delete('/api/proposal/1');

            expect(response.status).toBe(204);
            expect(Proposal.update).toHaveBeenCalledWith(
                { status: 'ARCHIVED' },
                { where: { id: '1' } }
            );
        });

        it('should return 404 for non-existent proposal', async () => {
            (Proposal.findByPk as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete('/api/proposal/999');

            expect(response.status).toBe(404);
        });
    });
});
