'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, AlertCircle, Star, MessageSquareHeart } from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';

const EASE_OUT = { duration: 0.3, ease: 'easeOut' };
const FADE_UP = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: EASE_OUT } };

function InputField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  placeholder?: string;
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
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-tk-bg-raised border text-tk-text text-sm px-4 py-3 min-h-[44px] outline-none transition-all duration-200 placeholder:text-tk-text-dim ${
          error
            ? 'border-red-600 bg-red-600/[0.05]'
            : 'border-tk-border hover:border-tk-border-accent focus:border-tk-accent'
        }`}
      />
      {error && (
        <span className="flex items-center gap-1 text-[10px] text-[#C81E1E]">
          <AlertCircle size={10} /> {error}
        </span>
      )}
    </div>
  );
}

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventsAttended: ['General/Overall'] as string[],
    rating: 5,
    likedMost: '',
    improvements: '',
    wouldRecommend: 'Yes' as 'Yes' | 'No' | 'Maybe',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const setField = (k: string) => (v: any) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  const toggleEvent = (eventName: string) => {
    setForm((prev) => {
      const current = prev.eventsAttended;
      let updated: string[];
      if (current.includes(eventName)) {
        updated = current.filter((e) => e !== eventName);
        if (updated.length === 0) {
          updated = ['General/Overall'];
        }
      } else {
        updated = [...current, eventName];
      }
      return { ...prev, eventsAttended: updated };
    });
    if (errors.eventsAttended) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.eventsAttended;
        return next;
      });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email format required';
    if (!form.eventsAttended || form.eventsAttended.length === 0) {
      e.eventsAttended = 'Please select at least one event or General/Overall';
    }
    if (!form.rating || form.rating < 1 || form.rating > 5) {
      e.rating = 'Please provide a rating between 1 and 5 stars';
    }
    if (!form.improvements.trim()) {
      e.improvements = 'What could be improved is required to provide actionable feedback';
    } else if (form.improvements.trim().length < 5) {
      e.improvements = 'Please elaborate slightly more on improvements (at least 5 characters)';
    }
    if (!['Yes', 'No', 'Maybe'].includes(form.wouldRecommend)) {
      e.wouldRecommend = 'Please select whether you would recommend Tech Kurukshetra';
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSending(true);
    setErrors({});

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSent(true);
      } else {
        if (data.errors && typeof data.errors === 'object') {
          setErrors(data.errors);
        } else {
          setErrors({ server: data.message || 'Feedback submission failed. Please try again.' });
        }
      }
    } catch {
      setErrors({ server: 'Connection error. Please check your network and try again.' });
    } finally {
      setSending(false);
    }
  };

  const { data: rawEvents } = useFetch<any>('/api/events');
  const eventsList = Array.isArray(rawEvents)
    ? rawEvents
    : rawEvents?.data && Array.isArray(rawEvents.data)
    ? rawEvents.data
    : [];

  // Source list of events dynamically from event metadata + General option
  const eventOptions = ['General/Overall', ...eventsList.map((ev: any) => ev.name)];

  return (
    <div className="min-h-screen bg-tk-bg text-tk-text pb-20">
      {/* Header */}
      <section
        className="pt-20 pb-16 px-4 sm:px-6 relative overflow-hidden"
        style={{ borderBottom: '1px solid var(--tk-border)' }}
      >
        <div
          className="absolute top-0 left-0 w-[600px] h-[300px] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at top left, rgba(255,122,47,0.14) 0%, transparent 65%)',
          }}
        />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex flex-col gap-4"
          >
            <motion.div
              variants={FADE_UP}
              className="text-xs tracking-[0.3em] uppercase flex items-center gap-2"
              style={{ color: 'var(--tk-accent)' }}
            >
              <MessageSquareHeart size={16} /> ◈ PARTICIPANT FEEDBACK
            </motion.div>
            <motion.h1
              variants={FADE_UP}
              className="text-4xl sm:text-6xl font-black tracking-tighter font-headline leading-[0.95] text-tk-text"
            >
              SHARE YOUR <br />
              <span style={{ color: 'var(--tk-accent)' }}>EXPERIENCE</span>
            </motion.h1>
            <motion.p variants={FADE_UP} className="text-sm text-[#8A8A8A] max-w-xl leading-relaxed">
              Help us sharpen the battlefield. Whether you competed in coding arenas, attended tech talks,
              or cheered from the sidelines, your feedback shapes future editions of Tech Kurukshetra.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main Form Body */}
      <section className="px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={EASE_OUT}
              className="flex flex-col items-center text-center gap-5 py-16 px-6 bg-tk-bg-raised border border-tk-border rounded-none"
            >
              <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-headline text-[#F1F1F1] tracking-tight">
                THANK YOU FOR YOUR FEEDBACK!
              </h2>
              <p className="text-[#8A8A8A] text-sm max-w-md leading-relaxed">
                Your response has been securely saved to our database and notified to the Tech Kurukshetra organizing team.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({
                    name: '',
                    email: '',
                    phone: '',
                    eventsAttended: ['General/Overall'],
                    rating: 5,
                    likedMost: '',
                    improvements: '',
                    wouldRecommend: 'Yes',
                  });
                }}
                className="mt-4 inline-flex items-center gap-2 text-xs font-black tracking-[0.2em] uppercase px-6 py-3 border border-tk-accent text-tk-accent hover:bg-tk-accent hover:text-tk-bg transition-all duration-200"
              >
                SUBMIT ANOTHER RESPONSE →
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={EASE_OUT}
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-8 bg-tk-bg-raised/40 border border-tk-border p-6 sm:p-10"
            >
              {/* Server error */}
              {errors.server && (
                <div className="bg-[#C81E1E]/10 border border-[#C81E1E]/40 p-4 text-xs text-[#C81E1E] flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errors.server}</span>
                </div>
              )}

              {/* Bot Honeypot */}
              <input
                aria-hidden="true"
                tabIndex={-1}
                name="hp"
                type="text"
                defaultValue=""
                style={{
                  position: 'absolute',
                  left: '-9999px',
                  opacity: 0,
                  height: 0,
                  width: 0,
                  overflow: 'hidden',
                  pointerEvents: 'none',
                }}
              />

              {/* Personal Details */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-tk-accent border-b border-tk-border pb-2">
                  1. PARTICIPANT INFORMATION
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Full Name *"
                    name="name"
                    value={form.name}
                    onChange={setField('name')}
                    error={errors.name}
                    placeholder="e.g. Alex Mercer"
                  />
                  <InputField
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={setField('email')}
                    error={errors.email}
                    placeholder="you@example.com"
                  />
                </div>
                <InputField
                  label="Phone Number (Optional)"
                  name="phone"
                  value={form.phone}
                  onChange={setField('phone')}
                  error={errors.phone}
                  placeholder="+91 9876543210"
                />
              </div>

              {/* Events Attended */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-tk-accent border-b border-tk-border pb-2">
                  2. WHICH EVENT(S) DID YOU ATTEND? *
                </h3>
                <p className="text-xs text-[#8A8A8A]">Select all arenas you participated in or attended:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {eventOptions.map((opt) => {
                    const selected = form.eventsAttended.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleEvent(opt)}
                        className={`flex items-center gap-3 px-4 py-3 border text-xs font-semibold text-left transition-all duration-150 ${
                          selected
                            ? 'border-tk-accent bg-tk-accent/10 text-tk-accent'
                            : 'border-tk-border bg-white/[0.02] text-[#8A8A8A] hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 border flex items-center justify-center text-[10px] shrink-0 ${
                            selected
                              ? 'border-tk-accent bg-tk-accent text-tk-bg'
                              : 'border-tk-border bg-transparent'
                          }`}
                        >
                          {selected && '✓'}
                        </div>
                        <span className="truncate">{opt}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.eventsAttended && (
                  <span className="flex items-center gap-1 text-[10px] text-[#C81E1E]">
                    <AlertCircle size={10} /> {errors.eventsAttended}
                  </span>
                )}
              </div>

              {/* Overall Rating */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-tk-accent border-b border-tk-border pb-2">
                  3. OVERALL RATING *
                </h3>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setField('rating')(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-110"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        size={32}
                        className={
                          star <= form.rating
                            ? 'fill-tk-accent text-tk-accent'
                            : 'text-tk-border fill-transparent'
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-sm font-bold text-tk-accent">
                    {form.rating}/5 {form.rating === 5 ? '🔥 Excellent' : form.rating === 4 ? '👍 Good' : form.rating === 3 ? '😐 Average' : '🔻 Needs Work'}
                  </span>
                </div>
                {errors.rating && (
                  <span className="flex items-center gap-1 text-[10px] text-[#C81E1E]">
                    <AlertCircle size={10} /> {errors.rating}
                  </span>
                )}
              </div>

              {/* Text Responses */}
              <div className="flex flex-col gap-5">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-tk-accent border-b border-tk-border pb-2">
                  4. DETAILED FEEDBACK
                </h3>

                {/* Liked Most */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="likedMost" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
                    What did you like most? (Optional)
                  </label>
                  <textarea
                    id="likedMost"
                    rows={3}
                    value={form.likedMost}
                    onChange={(e) => setField('likedMost')(e.target.value)}
                    placeholder="Tell us what stood out positively (e.g. venue setup, problem set, mentors, schedule)..."
                    className="bg-tk-bg-raised border border-tk-border text-tk-text text-sm px-4 py-3 outline-none transition-all duration-200 resize-none placeholder:text-tk-text-dim focus:border-tk-accent"
                  />
                </div>

                {/* Improvements (Required) */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="improvements" className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A8A8A]">
                    What could be improved? *
                  </label>
                  <textarea
                    id="improvements"
                    rows={4}
                    value={form.improvements}
                    onChange={(e) => setField('improvements')(e.target.value)}
                    placeholder="Be actionable and honest — e.g. timing delays, registration flow, audio quality, food/water arrangements..."
                    className={`bg-tk-bg-raised border text-tk-text text-sm px-4 py-3 outline-none transition-all duration-200 resize-none placeholder:text-tk-text-dim ${
                      errors.improvements
                        ? 'border-red-600 bg-red-600/[0.05]'
                        : 'border-tk-border hover:border-tk-border-accent focus:border-tk-accent'
                    }`}
                  />
                  {errors.improvements && (
                    <span className="flex items-center gap-1 text-[10px] text-[#C81E1E]">
                      <AlertCircle size={10} /> {errors.improvements}
                    </span>
                  )}
                </div>
              </div>

              {/* Recommend Choice */}
              <div className="flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-tk-accent border-b border-tk-border pb-2">
                  5. WOULD YOU ATTEND / RECOMMEND TECH KURUKSHETRA AGAIN? *
                </h3>
                <div className="flex flex-wrap gap-4 pt-1">
                  {(['Yes', 'No', 'Maybe'] as const).map((opt) => {
                    const selected = form.wouldRecommend === opt;
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setField('wouldRecommend')(opt)}
                        className={`flex items-center gap-2 px-6 py-3 border text-xs font-bold tracking-wider uppercase transition-all duration-150 ${
                          selected
                            ? 'border-tk-accent bg-tk-accent text-tk-bg'
                            : 'border-tk-border bg-white/[0.02] text-[#8A8A8A] hover:border-white/20 hover:text-white'
                        }`}
                      >
                        <span>{opt === 'Yes' ? '👍 YES' : opt === 'No' ? '👎 NO' : '🤔 MAYBE'}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.wouldRecommend && (
                  <span className="flex items-center gap-1 text-[10px] text-[#C81E1E]">
                    <AlertCircle size={10} /> {errors.wouldRecommend}
                  </span>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.01, boxShadow: '0 0 24px rgba(255,107,0,0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm px-10 py-4 transition-colors duration-200 disabled:opacity-50"
                  style={{ background: 'var(--tk-accent)', color: 'var(--tk-bg)' }}
                >
                  {sending ? 'SUBMITTING FEEDBACK...' : 'SUBMIT FEEDBACK'}
                  {!sending && <ArrowRight size={16} />}
                </motion.button>
              </div>
            </motion.form>
          )}
        </div>
      </section>
    </div>
  );
}
