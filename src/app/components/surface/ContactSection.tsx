import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

// Input sanitization: strip script-like content
function sanitizeText(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

function validateForm(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const name = form.name.trim();
  const email = form.email.trim();
  const message = form.message.trim();

  if (!name) errors.name = 'Name is required.';
  else if (name.length > 60) errors.name = 'Name must be under 60 characters.';

  if (!email) errors.email = 'Email is required.';
  else if (!validateEmail(email)) errors.email = 'Please enter a valid email address.';

  if (!message) errors.message = 'Message is required.';
  else if (message.length < 10) errors.message = 'Message must be at least 10 characters.';
  else if (message.length > 1200) errors.message = 'Message must be under 1200 characters.';

  return errors;
}

export function ContactSection() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    const sanitized = sanitizeText(value);
    setForm(prev => ({ ...prev, [field]: sanitized }));

    // Real-time validation if field was touched
    if (touched[field]) {
      const newErrors = validateForm({ ...form, [field]: sanitized });
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validateForm(form);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { name: true, email: true, message: true };
    setTouched(allTouched);

    const validationErrors = validateForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus('loading');

    // Real API call with retry logic
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    const attemptFetch = async (attempt: number): Promise<boolean> => {
      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000),
        });

        if (res.ok) return true;
        if (res.status === 429) {
          setErrors({ message: 'Too many requests. Please wait a few minutes before trying again.' });
          return false;
        }
        if (res.status === 400) {
          const body = await res.json().catch(() => ({}));
          if (body?.error) setErrors({ message: body.error });
          return false;
        }
        // 5xx or other: retry
        throw new Error('server error');
      } catch (err) {
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 800 * Math.pow(2, attempt)));
          return attemptFetch(attempt + 1);
        }
        return false;
      }
    };

    const success = await attemptFetch(0);

    if (success) {
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
    } else {
      setStatus('error');
    }
  };

  return (
    <section
      id="contact"
      className="px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto py-24 md:py-32 border-t border-[#EAEAEA]"
    >
      <div ref={sectionRef} className="max-w-[640px]">
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm text-[#6B6B6B] tracking-[0.15em] uppercase mb-6 block"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          Contact
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(24px,3.5vw,40px)] text-[#0A0A0A] leading-[1.2] mb-4"
          style={{ fontWeight: 600 }}
        >
          Let’s build something real.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base text-[#6B6B6B] leading-relaxed mb-12"
        >
          Got a project in mind, a question, or just want to connect? I read every message personally and respond within 48 hours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 rounded-[20px] border border-[#EAEAEA] bg-[#FAFAFA] text-center"
              >
                <div className="text-3xl mb-4">✓</div>
                <h3 className="text-lg text-[#0A0A0A] mb-2" style={{ fontWeight: 600 }}>
                  Message received.
                </h3>
                <p className="text-sm text-[#6B6B6B]">
                  I read every message personally. I'll be in touch within 48 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm text-[#6B6B6B] underline hover:text-[#0A0A0A] transition-colors"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                {/* Name */}
                <FormField
                  label="Name"
                  error={touched.name ? errors.name : undefined}
                >
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Your name"
                    maxLength={60}
                    className="w-full px-4 py-3 rounded-[12px] border text-[#0A0A0A] placeholder-[#BBBBBB] bg-white text-sm outline-none transition-colors"
                    style={{
                      borderColor: touched.name && errors.name ? '#EF4444' : '#EAEAEA',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#0A0A0A'; }}
                    onBlurCapture={e => {
                      e.target.style.borderColor = touched.name && errors.name ? '#EF4444' : '#EAEAEA';
                    }}
                  />
                </FormField>

                {/* Email */}
                <FormField
                  label="Email"
                  error={touched.email ? errors.email : undefined}
                >
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-[12px] border text-[#0A0A0A] placeholder-[#BBBBBB] bg-white text-sm outline-none transition-colors"
                    style={{
                      borderColor: touched.email && errors.email ? '#EF4444' : '#EAEAEA',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#0A0A0A'; }}
                    onBlurCapture={e => {
                      e.target.style.borderColor = touched.email && errors.email ? '#EF4444' : '#EAEAEA';
                    }}
                  />
                </FormField>

                {/* Message */}
                <FormField
                  label="Message"
                  error={touched.message ? errors.message : undefined}
                  hint={`${form.message.length}/1200`}
                >
                  <textarea
                    value={form.message}
                    onChange={e => handleChange('message', e.target.value)}
                    onBlur={() => handleBlur('message')}
                    placeholder="Tell me about the project, the problem, and the team..."
                    rows={5}
                    maxLength={1200}
                    className="w-full px-4 py-3 rounded-[12px] border text-[#0A0A0A] placeholder-[#BBBBBB] bg-white text-sm outline-none resize-none transition-colors"
                    style={{
                      borderColor: touched.message && errors.message ? '#EF4444' : '#EAEAEA',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#0A0A0A'; }}
                    onBlurCapture={e => {
                      e.target.style.borderColor = touched.message && errors.message ? '#EF4444' : '#EAEAEA';
                    }}
                  />
                </FormField>

                {/* Error banner */}
                <AnimatePresence>
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="px-4 py-3 rounded-[10px] bg-red-50 border border-red-100 text-sm text-red-600"
                    >
                      Something went wrong. Please try again later.
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full py-3.5 rounded-[12px] text-sm text-white transition-opacity disabled:opacity-70"
                  style={{
                    background: '#0A0A0A',
                    fontWeight: 500,
                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                      />
                      Sending…
                    </span>
                  ) : (
                    'Send Message →'
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function FormField({ label, error, hint, children }: FormFieldProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm text-[#0A0A0A]" style={{ fontWeight: 500 }}>
          {label}
        </label>
        {hint && (
          <span className="text-xs text-[#BBBBBB]" style={{ fontFamily: 'var(--font-mono)' }}>
            {hint}
          </span>
        )}
      </div>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-red-500 mt-1.5"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
