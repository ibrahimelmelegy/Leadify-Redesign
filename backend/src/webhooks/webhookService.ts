import crypto from 'crypto';
import Webhook, { WebhookEvent } from './webhookModel';

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: any;
}

export async function triggerWebhook(event: WebhookEvent, data: any): Promise<void> {
  try {
    const webhooks = await Webhook.findAll({
      where: { active: true }
    });

    const relevantWebhooks = webhooks.filter(webhook => 
      webhook.events.includes(event)
    );

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    };

    await Promise.allSettled(
      relevantWebhooks.map(webhook => sendWebhook(webhook, payload))
    );
  } catch (error) {
    console.error('Error triggering webhooks:', error);
  }
}

async function sendWebhook(webhook: Webhook, payload: WebhookPayload): Promise<void> {
  const signature = generateSignature(JSON.stringify(payload), webhook.secret);

  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': payload.event,
        'X-Webhook-Timestamp': payload.timestamp,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(`Webhook ${webhook.id} failed with status ${response.status}`);
    }
  } catch (error) {
    console.error(`Webhook ${webhook.id} failed:`, error);
  }
}

function generateSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function createWebhook(data: {
  name: string;
  url: string;
  events: WebhookEvent[];
  userId: number;
}): Promise<Webhook> {
  const secret = crypto.randomBytes(32).toString('hex');
  
  return await Webhook.create({
    ...data,
    secret,
    active: true,
  });
}

export async function getWebhooks(userId: number): Promise<Webhook[]> {
  return await Webhook.findAll({
    where: { userId },
    order: [['createdAt', 'DESC']],
  });
}

export async function updateWebhook(
  id: number,
  userId: number,
  data: Partial<{ name: string; url: string; events: WebhookEvent[]; active: boolean }>
): Promise<Webhook | null> {
  const webhook = await Webhook.findOne({ where: { id, userId } });
  if (!webhook) return null;
  
  await webhook.update(data);
  return webhook;
}

export async function deleteWebhook(id: number, userId: number): Promise<boolean> {
  const result = await Webhook.destroy({ where: { id, userId } });
  return result > 0;
}

export async function regenerateWebhookSecret(id: number, userId: number): Promise<string | null> {
  const webhook = await Webhook.findOne({ where: { id, userId } });
  if (!webhook) return null;
  
  const newSecret = crypto.randomBytes(32).toString('hex');
  await webhook.update({ secret: newSecret });
  return newSecret;
}
