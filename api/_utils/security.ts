const SCRIPT_RE = /<script[\s\S]*?>[\s\S]*?<\/script>/gi;
const HTML_TAGS_RE = /<[^>]*>/g;
const JS_EVENT_RE = /on\w+\s*=/gi;
const DANGEROUS_CHARS = ['javascript:', 'data:', 'vbscript:'];

export function sanitize(raw: string): string {
  if (typeof raw !== 'string') return '';

  let s = raw;

  // Strip script tags and all HTML tags
  s = s.replace(SCRIPT_RE, '');
  s = s.replace(HTML_TAGS_RE, '');

  // Strip JS event handlers
  s = s.replace(JS_EVENT_RE, '');

  // Strip dangerous protocol prefixes
  DANGEROUS_CHARS.forEach((d) => {
    s = s.split(d).join('');
  });

  // Normalize whitespace
  s = s.replace(/\s+/g, ' ').trim();

  return s;
}
