import type { VercelRequest, VercelResponse } from '@vercel/node';

// Simple in-memory rate limiter (resets on cold start — fine for a portfolio)
const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  return (typeof fwd === 'string' ? fwd.split(',')[0] : req.socket?.remoteAddress) ?? 'unknown';
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

function sanitize(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2000);
}

function validate(name: string, email: string, message: string): string | null {
  if (!name || name.length < 2) return 'Name must be at least 2 characters.';
  if (name.length > 60) return 'Name is too long (max 60 characters).';
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
  if (!message || message.length < 10) return 'Message must be at least 10 characters.';
  if (message.length > 1200) return 'Message is too long (max 1200 characters).';
  return null;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN ?? '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = getIp(req);
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait before sending another message.' });
  }

  const body = req.body;
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body.' });
  }

  const name = sanitize(body.name);
  const email = sanitize(body.email);
  const message = sanitize(body.message);

  const validationError = validate(name, email, message);
  if (validationError) return res.status(400).json({ error: validationError });

  // Log to Vercel function logs (visible in Vercel Dashboard > Functions tab)
  console.log(JSON.stringify({
    event: 'contact_form_submission',
    from: name,
    email,
    preview: message.slice(0, 80),
    receivedAt: new Date().toISOString(),
  }));

  return res.status(200).json({ success: true });
}
