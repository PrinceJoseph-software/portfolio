import type { VercelRequest, VercelResponse } from '@vercel/node';
import { validateContact } from './_utils/validation';
import { sanitize } from './_utils/security';
import * as fs from 'fs';
import * as path from 'path';

// Simple in-memory rate limit tracker (resets per cold start)
// For production, use Vercel KV or Upstash Redis
const requests = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requests.get(ip);
  if (!entry || now > entry.reset) {
    requests.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const ip = getClientIp(req);
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before sending another message.' });
  }

  // Body size guard
  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // Sanitize
  const sanitized = {
    name: sanitize(String(body.name ?? '')),
    email: sanitize(String(body.email ?? '')),
    message: sanitize(String(body.message ?? '')),
  };

  // Validate
  const errors = validateContact(sanitized);
  if (errors) {
    return res.status(400).json({ error: errors });
  }

  // Store message (append to JSON file — works on Vercel via /tmp)
  try {
    const store = path.join('/tmp', 'messages.json');
    let messages: unknown[] = [];
    if (fs.existsSync(store)) {
      try { messages = JSON.parse(fs.readFileSync(store, 'utf-8')); } catch { messages = []; }
    }
    messages.push({
      id: Date.now().toString(36),
      name: sanitized.name,
      email: sanitized.email,
      message: sanitized.message,
      receivedAt: new Date().toISOString(),
      ip: ip.slice(0, 10) + '...',  // Partial IP only for privacy
    });
    fs.writeFileSync(store, JSON.stringify(messages, null, 2));
  } catch {
    // Storage failure is non-fatal — still respond success so user isn't blocked
    console.error('[contact] Failed to write message store');
  }

  return res.status(200).json({ success: true });
}
