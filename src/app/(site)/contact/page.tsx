'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Instagram, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { FaqSection } from '@/components/home/faq-section';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: EASE_OUT } };

const SUBJECTS = ['General Inquiry', 'Sponsorship', 'Technical Support', 'Media / Press', 'Other'];

function InputField({
  label, name, type = 'text', value, onChange, error, placeholder,
}: {
  label: string; name: string; type?: string; value: string;
  onChange: (v: string) => void; error?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
        {label}
      </label>
      <input
        id={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-tk-bg-raised border text-tk-text text-sm px-4 py-3 min-h-[44px] outline-none transition-all duration-200 placeholder:text-tk-text-dim
          ${
            error
              ? 'border-red-600 bg-red-600/[0.05]'
              : 'border-tk-border hover:border-tk-border-accent focus:border-tk-accent'
          }`}
        style={{
          '--tw-shadow': error ? 'none' : undefined,
        } as any}
      />
      {error && (
        <span className="flex items-center gap-1 text-[10px] text-[#C81E1E]">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: SUBJECTS[0], message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email';
    if (!form.message.trim()) e.message = 'Message cannot be empty';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSent(true);
      } else {
        setErrors({ server: data.message || 'Submission failed. Please try again.' });
      }
    } catch {
      setErrors({ server: 'Connection error. Please check your network.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-tk-bg text-tk-text">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 relative overflow-hidden" style={{ borderBottom: '1px solid var(--tk-border)' }}>
        {/* Subtle orange radial — top corner only, low opacity */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top left, rgba(255,122,47,0.12) 0%, transparent 65%)' }}
        />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }} className="flex flex-col gap-4">
            <motion.div variants={FADE_UP} className="text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--tk-accent)' }}>◈ REACH OUT</motion.div>
            <motion.h1 variants={FADE_UP} className="text-5xl sm:text-7xl font-black tracking-tighter font-headline leading-[0.9] text-tk-text">
              CONTACT<br /><span style={{ color: 'var(--tk-accent)' }}>US</span>
            </motion.h1>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <section className="px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.2 }}
            className="lg:col-span-7"
          >
            {sent ? (
              <div className="flex flex-col items-start gap-4 py-12">
                <CheckCircle size={40} className="text-green-400" />
                <h2 className="text-3xl font-black font-headline text-[#F1F1F1]">MESSAGE RECEIVED.</h2>
                <p className="text-[#8A8A8A] text-sm max-w-sm">We'll get back to you within 24–48 hours. Stand by, soldier.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' }); }}
                  className="text-[10px] text-[#FF6B00] tracking-[0.2em] uppercase border-b border-[#FF6B00]/40 hover:border-[#FF6B00] transition-colors mt-2">
                  SEND ANOTHER →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                {/* Server error */}
                {errors.server && (
                  <div className="bg-[#C81E1E]/10 border border-[#C81E1E]/40 p-3 text-xs text-[#C81E1E]">
                    {errors.server}
                  </div>
                )}
                {/* Honeypot — hidden from real users; bots fill it in */}
                <input
                  aria-hidden="true"
                  tabIndex={-1}
                  name="hp"
                  type="text"
                  defaultValue=""
                  style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, width: 0, overflow: 'hidden', pointerEvents: 'none' }}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField label="Full Name" name="name" value={form.name} onChange={set('name')} error={errors.name} placeholder="John Doe" />
                  <InputField label="Email Address" name="email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">Subject</label>
                  <select
                    id="subject"
                    value={form.subject}
                    onChange={e => set('subject')(e.target.value)}
                    className="bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#FF6B00] focus:shadow-[0_0_0_1px_rgba(255,107,0,0.3)] text-[#F1F1F1] text-sm px-4 py-3 outline-none transition-all duration-200"
                  >
                    {SUBJECTS.map(s => <option key={s} value={s} className="bg-[#0A0A0F]">{s}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    value={form.message}
                    onChange={e => set('message')(e.target.value)}
                    placeholder="What's on your mind?"
                    className={`bg-white/[0.03] border text-[#F1F1F1] text-sm px-4 py-3 outline-none transition-all duration-200 resize-none placeholder:text-[#8A8A8A]/50
                      focus:border-[#FF6B00] focus:bg-[#FF6B00]/[0.04] focus:shadow-[0_0_0_1px_rgba(255,107,0,0.3)]
                      ${errors.message ? 'border-[#C81E1E] bg-[#C81E1E]/[0.04]' : 'border-white/10 hover:border-white/20'}`}
                  />
                  {errors.message && (
                    <span className="flex items-center gap-1 text-[10px] text-[#C81E1E]">
                      <AlertCircle size={10} /> {errors.message}
                    </span>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02, boxShadow: '0 0 24px rgba(255,107,0,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  className="self-start inline-flex items-center gap-3 font-black uppercase tracking-[0.2em] text-sm px-8 py-4 transition-colors duration-200 disabled:opacity-50"
                  style={{ background: 'var(--tk-accent)', color: 'var(--tk-bg)' }}
                  onMouseEnter={e => { if (!sending) (e.currentTarget as HTMLButtonElement).style.background = 'var(--tk-accent-dim)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--tk-accent)'; }}
                >
                  {sending ? 'SENDING...' : 'SEND MESSAGE'}
                  {!sending && <ArrowRight size={16} />}
                </motion.button>
              </form>
            )}
          </motion.div>

          {/* RIGHT — Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.35 }}
            className="lg:col-span-5 flex flex-col gap-8"
          >
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex-shrink-0">
                  <MapPin size={18} className="text-[#FF6B00]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A] mb-1">Venue</div>
                  <p className="text-sm text-[#F1F1F1]">Chimanbhai Patel Institute of Computer Applications (UCPIT)</p>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">S.G. Highway, Ahmedabad, Gujarat 380060</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex-shrink-0">
                  <Mail size={18} className="text-[#FF6B00]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A] mb-1">Email</div>
                  <a href="mailto:btech_events@svgu.ac.in" className="text-sm text-[#F1F1F1] hover:text-[#FF6B00] transition-colors">
                    btech_events@svgu.ac.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-[#FF6B00]/10 border border-[#FF6B00]/20 flex-shrink-0">
                  <Instagram size={18} className="text-[#FF6B00]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A] mb-1">Instagram</div>
                  <a href="https://instagram.com/techkurukshetra" target="_blank" rel="noopener noreferrer"
                    className="text-sm text-[#F1F1F1] hover:text-[#FF6B00] transition-colors">
                    @techkurukshetra
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Map */}
            <div className="border border-white/5 overflow-hidden">
              <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A] px-3 py-2 bg-white/[0.02] border-b border-white/5">
                LOCATION
              </div>
              <div className="relative h-52 w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.8965073977373!2d72.5077!3d23.027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e849e7e17cbaf%3A0x7b1e47b8f2e73d84!2sChimanbhai%20Patel%20Institute%20of%20Computer%20Applications!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="UCPIT Location Map"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <FaqSection />
    </div>
  );
}
