const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
const URL_RE = /https?:\/\//i;
const SPAM_REPEATS = /(.)\1{7,}/; // 8+ repeated chars

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

export function validateContact(payload: ContactPayload): string | null {
  const { name, email, message } = payload;

  if (!name || name.length < 2) return 'Name must be at least 2 characters.';
  if (name.length > 60) return 'Name is too long (max 60 characters).';
  if (URL_RE.test(name)) return 'Name cannot contain URLs.';
  if (SPAM_REPEATS.test(name)) return 'Name contains repeated characters.';

  if (!email || email.length < 6) return 'A valid email address is required.';
  if (email.length > 254) return 'Email address is too long.';
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.';

  if (!message || message.length < 10) return 'Message must be at least 10 characters.';
  if (message.length > 1200) return 'Message is too long (max 1200 characters).';
  if (SPAM_REPEATS.test(message)) return 'Message contains too much repeated content.';

  return null; // valid
}
