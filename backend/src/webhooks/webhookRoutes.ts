import express from 'express';
import { authenticateUser, HasPermission } from '../middleware/authMiddleware';
import * as webhookService from './webhookService';

const router = express.Router();

router.get('/', authenticateUser, async (req: any, res) => {
  try {
    const webhooks = await webhookService.getWebhooks(req.user.id);
    const sanitizedWebhooks = webhooks.map(webhook => ({
      id: webhook.id,
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      active: webhook.active,
      createdAt: webhook.createdAt,
    }));
    
    res.json({ webhooks: sanitizedWebhooks });
  } catch (error) {
    console.error('Get webhooks error:', error);
    res.status(500).json({ message: 'Failed to get webhooks' });
  }
});

router.post('/', authenticateUser, async (req: any, res) => {
  try {
    const { name, url, events } = req.body;
    
    if (!name || !url || !events?.length) {
      return res.status(400).json({ message: 'Name, URL, and events are required' });
    }
    
    const webhook = await webhookService.createWebhook({
      name,
      url,
      events,
      userId: req.user.id,
    });
    
    res.status(201).json({
      message: 'Webhook created',
      webhook: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        secret: webhook.secret,
        active: webhook.active,
      },
    });
  } catch (error) {
    console.error('Create webhook error:', error);
    res.status(500).json({ message: 'Failed to create webhook' });
  }
});

router.put('/:id', authenticateUser, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { name, url, events, active } = req.body;
    
    const webhook = await webhookService.updateWebhook(
      parseInt(id),
      req.user.id,
      { name, url, events, active }
    );
    
    if (!webhook) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    
    res.json({ message: 'Webhook updated', webhook });
  } catch (error) {
    console.error('Update webhook error:', error);
    res.status(500).json({ message: 'Failed to update webhook' });
  }
});

router.delete('/:id', authenticateUser, async (req: any, res) => {
  try {
    const { id } = req.params;
    const deleted = await webhookService.deleteWebhook(parseInt(id), req.user.id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    
    res.json({ message: 'Webhook deleted' });
  } catch (error) {
    console.error('Delete webhook error:', error);
    res.status(500).json({ message: 'Failed to delete webhook' });
  }
});

router.post('/:id/regenerate-secret', authenticateUser, async (req: any, res) => {
  try {
    const { id } = req.params;
    const newSecret = await webhookService.regenerateWebhookSecret(parseInt(id), req.user.id);
    
    if (!newSecret) {
      return res.status(404).json({ message: 'Webhook not found' });
    }
    
    res.json({ message: 'Secret regenerated', secret: newSecret });
  } catch (error) {
    console.error('Regenerate secret error:', error);
    res.status(500).json({ message: 'Failed to regenerate secret' });
  }
});

export default router;
