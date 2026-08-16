'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Users, User, Lock, Home, AlertCircle, CheckCircle, Trophy, Zap } from 'lucide-react';

// ── CONFIGURATION ───────────────────────────────────────────────
const REGISTRATIONS_OPEN = true; // flip to true to open form
const DEADLINE_TIMESTAMP = new Date('2027-01-15T23:59:59+05:30').getTime();
const PRIZE_POOL = '₹1,00,000+';
const PAST_PARTICIPANTS = 2000;
// ────────────────────────────────────────────────────────────────

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: EASE_OUT } };

type Mode = 'individual' | 'team';

/* ─── Countdown ─── */
function DeadlineCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, mins: 0, secs: 0 });

  useEffect(() => {
    setMounted(true);
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, DEADLINE_TIMESTAMP - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hrs, mins, secs });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const units = [
    { label: 'DAYS', value: mounted ? String(timeLeft.days).padStart(2, '0') : '00' },
    { label: 'HRS',  value: mounted ? String(timeLeft.hrs).padStart(2, '0') : '00' },
    { label: 'MINS', value: mounted ? String(timeLeft.mins).padStart(2, '0') : '00' },
    { label: 'SECS', value: mounted ? String(timeLeft.secs).padStart(2, '0') : '00' },
  ];
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-1 sm:gap-2">
          <div className="flex flex-col items-center">
            <div className="bg-[#C81E1E]/10 border border-[#C81E1E]/30 px-2 sm:px-3 py-1.5 sm:py-2 min-w-[44px] sm:min-w-[52px] text-center">
              <span className="text-xl sm:text-2xl font-black text-[#C81E1E] font-headline tabular-nums">
                {value}
              </span>
              <div className="text-[8px] text-[#8A8A8A] tracking-[0.15em]">{label}</div>
            </div>
          </div>
          {i < units.length - 1 && <span className="text-xl text-[#C81E1E]/50 mb-3 font-black">:</span>}
        </div>
      ))}
    </div>
  );
}

/* ─── Closed State ─── */
function ClosedState() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F1F1F1] flex flex-col items-center justify-center px-6 text-center py-24">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={EASE_OUT} className="flex flex-col items-center gap-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-[#C81E1E]/20 blur-2xl animate-pulse rounded-full" />
          <div className="relative w-20 h-20 border-2 border-[#C81E1E] bg-[#C81E1E]/10 flex items-center justify-center rotate-45">
            <Lock size={32} className="text-[#C81E1E] -rotate-45" />
          </div>
        </div>

        <div className="flex items-center gap-2 border border-[#C81E1E]/30 bg-[#C81E1E]/5 px-3 py-1.5">
          <AlertCircle size={12} className="text-[#C81E1E]" />
          <span className="text-[10px] font-black tracking-[0.25em] text-[#C81E1E] uppercase">System Offline</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter font-headline leading-[0.9]">
          REGISTRATIONS<br />
          <span className="text-[#C81E1E]">CLOSED</span>
        </h1>

        <p className="text-[#8A8A8A] text-sm leading-relaxed">
          The entry portal is sealed. All slots have been filled or the deadline has passed.
          Follow our socials for updates on brackets and results.
        </p>

        <Link href="/"
          className="inline-flex items-center gap-2 border border-white/10 hover:border-white/30 text-[#F1F1F1] text-xs font-black uppercase tracking-[0.2em] px-8 py-4 transition-all duration-200 hover:bg-white/5">
          <Home size={14} /> RETURN TO HUB
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── Register Form ─── */
function RegisterForm() {
  const [mode, setMode] = useState<Mode>('individual');
  const [form, setForm] = useState({ name: '', email: '', phone: '', college: '', teamName: '', teamSize: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: string) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Invalid email';
    if (!form.college.trim()) e.college = 'Required';
    if (mode === 'team' && !form.teamName.trim()) e.teamName = 'Required';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setErrors({});

    try {
      const orderId = `TK2027_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const res = await fetch('/api/registration/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          college: form.college.trim(),
          mode,
          teamName: form.teamName.trim(),
          teamSize: form.teamSize.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
      } else {
        setErrors({ server: data.message || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ server: 'Connection error. Please check your network.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col gap-4 py-8">
        <CheckCircle size={36} className="text-green-400" />
        <h3 className="text-2xl font-black font-headline text-[#F1F1F1]">YOU'RE REGISTERED.</h3>
        <p className="text-[#8A8A8A] text-sm">Check your inbox for the confirmation email. Prepare for battle.</p>
      </div>
    );
  }

  const Field = ({ label, name, type = 'text', placeholder }: { label: string; name: string; type?: string; placeholder?: string }) => (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">{label}</label>
      <input
        id={name} type={type} value={(form as any)[name]} placeholder={placeholder}
        onChange={e => set(name)(e.target.value)}
        className={`bg-white/[0.03] border text-[#F1F1F1] text-sm px-4 py-3 outline-none transition-all duration-200 placeholder:text-[#8A8A8A]/40
          focus:border-[#FF6B00] focus:shadow-[0_0_0_1px_rgba(255,107,0,0.3)]
          ${errors[name] ? 'border-[#C81E1E]' : 'border-white/10 hover:border-white/20'}`}
      />
      {errors[name] && <span className="text-[10px] text-[#C81E1E]">{errors[name]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errors.server && (
        <div className="bg-[#C81E1E]/10 border border-[#C81E1E]/40 p-3 text-xs text-[#C81E1E]">
          {errors.server}
        </div>
      )}
      {/* Mode Toggle */}
      <div className="flex border border-white/10 overflow-hidden">
        {(['individual', 'team'] as Mode[]).map(m => (
          <button key={m} type="button" onClick={() => setMode(m)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-200 ${
              mode === m ? 'bg-[#FF6B00] text-[#0A0A0F]' : 'text-[#8A8A8A] hover:text-[#F1F1F1]'}`}>
            {m === 'individual' ? <User size={12} /> : <Users size={12} />}
            {m}
          </button>
        ))}
      </div>

      <Field label="Full Name" name="name" placeholder="John Doe" />
      <Field label="Email Address" name="email" type="email" placeholder="you@example.com" />
      <Field label="Phone Number" name="phone" type="tel" placeholder="+91 9876543210" />
      <Field label="College / Institution" name="college" placeholder="XYZ University, Gujarat" />

      {mode === 'team' && (
        <>
          <Field label="Team Name" name="teamName" placeholder="e.g. Project Infinity" />
          <Field label="Team Size" name="teamSize" placeholder="e.g. 3" />
        </>
      )}

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(200,30,30,0.4)' }}
        whileTap={{ scale: 0.97 }}
        className="w-full inline-flex items-center justify-center gap-3 bg-[#C81E1E] hover:bg-[#C81E1E]/90 disabled:opacity-50 text-white font-black uppercase tracking-[0.2em] text-sm py-5 transition-colors duration-200"
      >
        {submitting ? 'SUBMITTING...' : 'ENTER THE ARENA'}
        {!submitting && <ArrowRight size={16} />}
      </motion.button>

      <p className="text-[10px] text-[#8A8A8A] text-center">
        By registering you agree to our{' '}
        <Link href="/terms-of-entry" className="text-[#FF6B00] hover:underline">Terms of Entry</Link>.
      </p>
    </form>
  );
}

/* ─── Main ─── */
export default function RegisterPage() {
  if (!REGISTRATIONS_OPEN) return <ClosedState />;

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#F1F1F1]">
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* LEFT — Stakes + Trust */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.1 }}
            className="lg:col-span-6 flex flex-col gap-10"
          >
            <div className="flex flex-col gap-4">
              <div className="text-xs text-[#FF6B00] tracking-[0.3em] uppercase">◈ REGISTRATION OPEN</div>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tighter font-headline leading-[0.9]">
                CLAIM YOUR<br />
                <span className="text-[#FF6B00]">SEAT</span> IN<br />
                THE ARENA.
              </h1>
              <p className="text-[#8A8A8A] text-base max-w-sm">
                {PRIZE_POOL} in prizes. Two days of all-out competition. One chance to prove you're the best.
              </p>
            </div>

            {/* Deadline Counter */}
            <div className="flex flex-col gap-3">
              <div className="text-[10px] text-[#C81E1E] tracking-[0.2em] uppercase font-bold flex items-center gap-1.5">
                <Zap size={10} className="fill-[#C81E1E]" /> REGISTRATION CLOSES IN
              </div>
              <DeadlineCountdown />
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/5 bg-white/[0.02] p-4">
                <div className="text-3xl font-black text-[#FF6B00] font-headline">{PAST_PARTICIPANTS.toLocaleString()}+</div>
                <div className="text-[10px] text-[#8A8A8A] uppercase tracking-[0.15em] mt-1">Past Participants</div>
              </div>
              <div className="border border-white/5 bg-white/[0.02] p-4">
                <div className="text-3xl font-black text-[#FF6B00] font-headline">{PRIZE_POOL}</div>
                <div className="text-[10px] text-[#8A8A8A] uppercase tracking-[0.15em] mt-1">Prize Pool</div>
              </div>
              <div className="col-span-2 border border-white/5 bg-white/[0.02] p-4 flex items-center gap-3">
                <Trophy size={20} className="text-[#FF6B00] flex-shrink-0" />
                <div className="text-xs text-[#8A8A8A]">
                  Winners get industry recognition, cash prizes, and direct referrals to top tech firms.
                </div>
              </div>
            </div>

            {/* Sponsor logos placeholder */}
            <div>
              <div className="text-[9px] text-[#8A8A8A] tracking-[0.2em] uppercase mb-3">SUPPORTED BY</div>
              <div className="flex gap-4 flex-wrap">
                {['SPONSOR A', 'SPONSOR B', 'SPONSOR C'].map(s => (
                  <div key={s} className="border border-white/5 px-4 py-2 text-[10px] text-[#8A8A8A] tracking-[0.1em]">
                    {/* PLACEHOLDER — replace with <Image /> */}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.25 }}
            className="lg:col-span-6 border border-white/5 bg-white/[0.02] p-6 sm:p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black font-headline tracking-tight text-[#F1F1F1]">JOIN THE BATTLE</h2>
              <p className="text-[#8A8A8A] text-xs mt-1">Fill in your details below. No fluff, just the essentials.</p>
            </div>
            <RegisterForm />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
