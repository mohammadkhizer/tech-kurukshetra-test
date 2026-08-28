'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Users,
  User,
  Lock,
  Home,
  AlertCircle,
  CheckCircle,
  Trophy,
  Zap,
  Plus,
  Trash2,
  Crown,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';

const REGISTRATIONS_OPEN = true;
const EASE_OUT = { duration: 0.3, ease: 'easeOut' };

const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other'];

interface TeamSizeObj {
  min: number;
  max: number;
}

interface EventMetaData {
  id: string;
  slug: string;
  name: string;
  category: 'TECH' | 'NON-TECH';
  type: 'solo' | 'team';
  teamSize?: TeamSizeObj | string;
  isTechnical?: boolean;
}

interface PlayerField {
  fullName: string;
  email: string;
  phone: string;
  college: string;
  yearOfStudy: string;
  sameAsCaptainCollege?: boolean;
}

/* ─── Countdown Component ─── */
function DeadlineCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, mins: 0, secs: 0, valid: false });

  useEffect(() => {
    setMounted(true);
    const dateEnv = process.env.NEXT_PUBLIC_REGISTRATION_DEADLINE;
    if (!dateEnv) return;

    const targetTime = new Date(dateEnv).getTime();
    if (isNaN(targetTime) || targetTime <= Date.now()) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hrs, mins, secs, valid: diff > 0 });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted || !timeLeft.valid) {
    return (
      <div className="text-xs text-red-500 font-headline tracking-widest uppercase bg-red-500/10 border border-red-500/30 px-3 py-1.5 inline-block">
        REGISTRATION OPEN · CLOSES SOON
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HRS', value: String(timeLeft.hrs).padStart(2, '0') },
    { label: 'MINS', value: String(timeLeft.mins).padStart(2, '0') },
    { label: 'SECS', value: String(timeLeft.secs).padStart(2, '0') },
  ];

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-1 sm:gap-2">
          <div className="flex flex-col items-center">
            <div className="bg-red-500/10 border border-red-500/30 px-2 sm:px-3 py-1.5 sm:py-2 min-w-[44px] sm:min-w-[52px] text-center">
              <span className="text-xl sm:text-2xl font-black text-red-500 font-headline tabular-nums">
                {value}
              </span>
              <div className="text-[8px] text-tk-text-muted tracking-[0.15em]">{label}</div>
            </div>
          </div>
          {i < units.length - 1 && <span className="text-xl text-red-500/50 mb-3 font-black">:</span>}
        </div>
      ))}
    </div>
  );
}

function ClosedState() {
  return (
    <div className="min-h-screen bg-tk-bg text-tk-text flex flex-col items-center justify-center px-6 text-center py-24">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={EASE_OUT} className="flex flex-col items-center gap-6 max-w-md">
        <div className="relative">
          <div className="absolute inset-0 bg-red-500/20 blur-2xl animate-pulse rounded-full" />
          <div className="relative w-20 h-20 border-2 border-red-500 bg-red-500/10 flex items-center justify-center rotate-45">
            <Lock size={32} className="text-red-500 -rotate-45" />
          </div>
        </div>

        <div className="flex items-center gap-2 border border-red-500/30 bg-red-500/5 px-3 py-1.5">
          <AlertCircle size={12} className="text-red-500" />
          <span className="text-[10px] font-black tracking-[0.25em] text-red-500 uppercase">System Offline</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter font-headline leading-[0.9]">
          REGISTRATIONS<br />
          <span className="text-red-500">CLOSED</span>
        </h1>

        <p className="text-tk-text-muted text-sm leading-relaxed">
          The entry portal is sealed. All slots have been filled or the deadline has passed.
          Follow our socials for updates on brackets and results.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 border border-tk-border hover:border-tk-border-accent text-tk-text text-xs font-black uppercase tracking-[0.2em] px-8 py-4 transition-all duration-200 hover:bg-white/5"
        >
          <Home size={14} /> RETURN TO HUB
        </Link>
      </motion.div>
    </div>
  );
}

/* ─── Dynamic Registration Form Core ─── */
function DynamicRegisterForm() {
  const searchParams = useSearchParams();
  const initialEventParam = searchParams.get('event') || '';

  const { data: rawEvents, isLoading: eventsLoading } = useFetch<any>('/api/events');

  const events: EventMetaData[] = useMemo(() => {
    if (Array.isArray(rawEvents)) return rawEvents;
    if (rawEvents && Array.isArray((rawEvents as any).data)) return (rawEvents as any).data;
    return [];
  }, [rawEvents]);

  const techEvents = useMemo(() => events.filter((e) => e.category === 'TECH' || e.isTechnical === true), [events]);
  const nonTechEvents = useMemo(() => events.filter((e) => e.category === 'NON-TECH' || e.isTechnical === false), [events]);

  const [selectedSlug, setSelectedSlug] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('');
  const [captainIndex, setCaptainIndex] = useState<number>(0);
  const [step, setStep] = useState<number>(1); // For large teams (>6 players), step 1 = setup, step 2 = players

  const [players, setPlayers] = useState<PlayerField[]>([
    { fullName: '', email: '', phone: '', college: '', yearOfStudy: '1st Year' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-select event from URL param once events load
  useEffect(() => {
    if (initialEventParam && events.length > 0 && !selectedSlug) {
      const match = events.find((e) => e.slug === initialEventParam || e.id === initialEventParam);
      if (match) {
        setSelectedSlug(match.slug || match.id);
      }
    }
  }, [events, initialEventParam, selectedSlug]);

  const selectedEvent = useMemo(() => {
    if (!selectedSlug) return null;
    return events.find((e) => e.slug === selectedSlug || e.id === selectedSlug) || null;
  }, [events, selectedSlug]);

  // Parse team size min/max
  const teamBounds = useMemo<{ min: number; max: number }>(() => {
    if (!selectedEvent || !selectedEvent.teamSize) return { min: 1, max: 1 };
    if (typeof selectedEvent.teamSize === 'object') {
      return {
        min: Number(selectedEvent.teamSize.min) || 1,
        max: Number(selectedEvent.teamSize.max) || 1,
      };
    }
    const str = String(selectedEvent.teamSize);
    if (str.includes('-')) {
      const parts = str.split('-').map((p) => parseInt(p.trim(), 10));
      return { min: parts[0] || 1, max: parts[1] || parts[0] || 1 };
    }
    const num = parseInt(str, 10) || 1;
    return { min: num, max: num };
  }, [selectedEvent]);

  // When selected event changes, adjust initial player count to min
  useEffect(() => {
    if (!selectedEvent) return;
    const { min } = teamBounds;
    setCaptainIndex(0);
    setPlayers((prev) => {
      if (prev.length === min) return prev;
      if (prev.length < min) {
        const extra = Array.from({ length: min - prev.length }, () => ({
          fullName: '',
          email: '',
          phone: '',
          college: prev[0]?.college || '',
          yearOfStudy: '1st Year',
        }));
        return [...prev, ...extra];
      }
      return prev.slice(0, min);
    });
  }, [selectedEvent, teamBounds]);

  const isSolo = teamBounds.max === 1;
  const isFixedTeam = teamBounds.min === teamBounds.max && teamBounds.min > 1;
  const isRangeTeam = teamBounds.min < teamBounds.max;
  const isLargeTeam = teamBounds.max > 6;

  const addPlayer = () => {
    if (players.length >= teamBounds.max) return;
    const captainCollege = players[0]?.college || '';
    setPlayers((prev) => [
      ...prev,
      { fullName: '', email: '', phone: '', college: captainCollege, yearOfStudy: '1st Year', sameAsCaptainCollege: true },
    ]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= teamBounds.min) return;
    setPlayers((prev) => prev.filter((_, i) => i !== index));
    if (captainIndex === index) {
      setCaptainIndex(0);
    } else if (captainIndex > index) {
      setCaptainIndex((c) => c - 1);
    }
  };

  const updatePlayer = (index: number, key: keyof PlayerField, value: any) => {
    setPlayers((prev) =>
      prev.map((p, i) => {
        if (i !== index) return p;
        const updated = { ...p, [key]: value };

        // Handle auto-sync college from captain if sameAsCaptainCollege is checked
        if (key === 'sameAsCaptainCollege' && value === true) {
          updated.college = prev[0]?.college || '';
        }
        return updated;
      })
    );
  };

  // Sync captain college change to players who checked sameAsCaptainCollege
  const handleCaptainCollegeChange = (colValue: string) => {
    setPlayers((prev) =>
      prev.map((p, i) => {
        if (i === 0) return { ...p, college: colValue };
        if (p.sameAsCaptainCollege) return { ...p, college: colValue };
        return p;
      })
    );
  };

  const validate = (): Record<string, string> => {
    const errs: Record<string, string> = {};

    if (!selectedEvent) {
      errs.event = 'Please select an event to register';
      return errs;
    }

    if (!isSolo && !teamName.trim()) {
      errs.teamName = 'Team name is required';
    }

    if (players.length < teamBounds.min) {
      errs.general = `Minimum ${teamBounds.min} players required for this event.`;
    }
    if (players.length > teamBounds.max) {
      errs.general = `Maximum ${teamBounds.max} players allowed for this event.`;
    }

    const emailMap = new Set<string>();

    players.forEach((p, idx) => {
      const pLabel = isSolo ? 'Participant' : `Player ${idx + 1}`;
      if (!p.fullName.trim()) errs[`player_${idx}_fullName`] = `${pLabel} full name is required`;

      if (!p.email.trim()) {
        errs[`player_${idx}_email`] = `${pLabel} email is required`;
      } else if (!p.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errs[`player_${idx}_email`] = `Enter a valid email for ${pLabel}`;
      } else {
        const lowerEmail = p.email.trim().toLowerCase();
        if (emailMap.has(lowerEmail)) {
          errs[`player_${idx}_email`] = `Duplicate email found: ${p.email}. Every player must have a unique email.`;
        } else {
          emailMap.add(lowerEmail);
        }
      }

      if (!p.phone.trim()) {
        errs[`player_${idx}_phone`] = `${pLabel} phone is required`;
      } else if (p.phone.trim().length < 7) {
        errs[`player_${idx}_phone`] = `Valid phone number required for ${pLabel}`;
      }

      if (!p.college.trim()) errs[`player_${idx}_college`] = `${pLabel} college is required`;
    });

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const orderId = `TK_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const primaryPlayer = players[captainIndex] || players[0];

      const formattedPlayers = players.map((p, i) => ({
        fullName: p.fullName.trim(),
        email: p.email.trim(),
        phone: p.phone.trim(),
        college: p.college.trim(),
        yearOfStudy: p.yearOfStudy,
        isCaptain: i === captainIndex,
      }));

      const res = await fetch('/api/registration/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          name: primaryPlayer.fullName.trim(),
          email: primaryPlayer.email.trim(),
          phone: primaryPlayer.phone.trim(),
          college: primaryPlayer.college.trim(),
          mode: isSolo ? 'individual' : 'team',
          teamName: isSolo ? '' : teamName.trim(),
          teamSize: String(players.length),
          eventSlug: selectedEvent?.slug || selectedSlug,
          paymentStatus: 'completed',
          players: formattedPlayers,
          rawPayload: {
            orderId,
            eventName: selectedEvent?.name,
            category: selectedEvent?.category,
            teamName: isSolo ? 'N/A' : teamName.trim(),
            captainName: primaryPlayer.fullName.trim(),
            captainEmail: primaryPlayer.email.trim(),
            captainPhone: primaryPlayer.phone.trim(),
            totalPlayers: players.length,
            playersList: formattedPlayers,
            submittedAt: new Date().toISOString(),
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setDone(true);
      } else {
        setErrors({ server: data.message || 'Registration failed. Please check inputs and retry.' });
      }
    } catch {
      setErrors({ server: 'Connection error. Please check your network.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center gap-5 py-12 px-4">
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-full">
          <CheckCircle size={48} className="text-green-400" />
        </div>
        <h3 className="text-3xl font-black font-headline text-tk-text">REGISTRATION CONFIRMED.</h3>
        <p className="text-tk-text-muted text-sm max-w-md leading-relaxed">
          Your entry for <strong className="text-tk-accent">{selectedEvent?.name}</strong> has been sealed. A confirmation summary has been logged for your team.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setStep(1);
            setTeamName('');
            setPlayers([{ fullName: '', email: '', phone: '', college: '', yearOfStudy: '1st Year' }]);
          }}
          className="text-xs text-tk-accent tracking-[0.2em] uppercase border-b border-tk-border-accent hover:border-tk-accent transition-colors mt-4 font-bold"
        >
          REGISTER ANOTHER TEAM →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {errors.server && (
        <div className="bg-red-500/10 border border-red-500/40 p-4 text-xs text-red-500 flex items-center gap-2">
          <AlertCircle size={16} className="flex-shrink-0" />
          <span>{errors.server}</span>
        </div>
      )}

      {errors.general && (
        <div className="bg-red-500/10 border border-red-500/40 p-3 text-xs text-red-500 flex items-center gap-2">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{errors.general}</span>
        </div>
      )}

      {/* ── STEP 1: EVENT SELECTION ── */}
      <div className="flex flex-col gap-2">
        <label htmlFor="event-select" className="text-[10px] font-bold uppercase tracking-[0.2em] text-tk-text-muted">
          SELECT ARENA / EVENT <span className="text-tk-accent">*</span>
        </label>
        <select
          id="event-select"
          value={selectedSlug}
          onChange={(e) => {
            setSelectedSlug(e.target.value);
            setErrors((prev) => ({ ...prev, event: '' }));
          }}
          className={`bg-tk-bg-raised border text-tk-text text-sm px-4 py-3.5 outline-none transition-all duration-200 font-medium
            focus:border-tk-accent
            ${errors.event ? 'border-red-600' : 'border-tk-border hover:border-tk-border-accent'}`}
        >
          <option value="" className="bg-tk-bg text-tk-text-muted">
            -- Choose an Arena --
          </option>

          {techEvents.length > 0 && (
            <optgroup label="── TECH ARENAS ──" className="bg-tk-bg text-tk-accent font-bold">
              {techEvents.map((ev) => (
                <option key={ev.id || ev.slug} value={ev.slug || ev.id} className="bg-tk-bg text-tk-text font-normal">
                  {ev.name} ({ev.type === 'solo' ? 'Solo' : `Team`})
                </option>
              ))}
            </optgroup>
          )}

          {nonTechEvents.length > 0 && (
            <optgroup label="── NON-TECH ARENAS ──" className="bg-tk-bg text-tk-accent font-bold">
              {nonTechEvents.map((ev) => (
                <option key={ev.id || ev.slug} value={ev.slug || ev.id} className="bg-tk-bg text-tk-text font-normal">
                  {ev.name} ({ev.type === 'solo' ? 'Solo' : `Team`})
                </option>
              ))}
            </optgroup>
          )}
        </select>
        {errors.event && <span className="text-[10px] text-red-500">{errors.event}</span>}
      </div>

      {selectedEvent && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={EASE_OUT} className="flex flex-col gap-6">

          {/* Event Badge / Info Bar */}
          <div className="p-4 border border-tk-border bg-tk-bg flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="text-[9px] font-headline font-black uppercase tracking-widest px-2.5 py-0.5"
                style={{
                  background: 'var(--tk-accent-subtle)',
                  color: 'var(--tk-accent)',
                  border: '1px solid var(--tk-border-accent)',
                }}
              >
                {selectedEvent.category}
              </span>
              <span className="text-xs font-headline font-bold text-tk-text">{selectedEvent.name}</span>
            </div>

            <div className="text-[10px] font-mono tracking-wider uppercase text-tk-text-muted">
              {isSolo ? (
                <span className="text-tk-accent font-bold">SOLO EVENT (1 PLAYER)</span>
              ) : isFixedTeam ? (
                <span className="text-tk-accent font-bold">FIXED SQUAD ({teamBounds.min} PLAYERS)</span>
              ) : (
                <span className="text-tk-accent font-bold">
                  TEAM SIZE: {teamBounds.min}-{teamBounds.max} PLAYERS
                </span>
              )}
            </div>
          </div>

          {/* Multi-step Navigation tab bar for Large teams (>6 players) */}
          {isLargeTeam && (
            <div className="flex border border-tk-border overflow-hidden">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={`flex-1 py-3 text-[10px] font-headline font-bold uppercase tracking-[0.2em] transition-all ${
                  step === 1 ? 'bg-tk-accent text-tk-bg' : 'text-tk-text-muted hover:text-tk-text bg-tk-bg-surface'
                }`}
              >
                1. Team Setup
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className={`flex-1 py-3 text-[10px] font-headline font-bold uppercase tracking-[0.2em] transition-all ${
                  step === 2 ? 'bg-tk-accent text-tk-bg' : 'text-tk-text-muted hover:text-tk-text bg-tk-bg-surface'
                }`}
              >
                2. Player Roster ({players.length})
              </button>
            </div>
          )}

          {/* ── TEAM SETUP (Team Name) ── */}
          {(!isLargeTeam || step === 1) && !isSolo && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="team-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-tk-text-muted">
                TEAM NAME <span className="text-tk-accent">*</span>
              </label>
              <input
                id="team-name"
                type="text"
                value={teamName}
                onChange={(e) => {
                  setTeamName(e.target.value);
                  setErrors((prev) => ({ ...prev, teamName: '' }));
                }}
                placeholder="e.g. Cyber Squad, Project Infinity"
                className={`bg-tk-bg-raised border text-tk-text text-sm px-4 py-3 outline-none transition-all duration-200 placeholder:text-tk-text-dim
                  focus:border-tk-accent
                  ${errors.teamName ? 'border-red-600' : 'border-tk-border hover:border-tk-border-accent'}`}
              />
              {errors.teamName && <span className="text-[10px] text-red-500">{errors.teamName}</span>}
            </div>
          )}

          {/* ── PLAYER ROSTER SECTION ── */}
          {(!isLargeTeam || step === 2) && (
            <div className="flex flex-col gap-5">
              {/* Header + Add/Remove Counter Bar */}
              <div className="flex items-center justify-between gap-4 border-b border-tk-border pb-3">
                <div className="text-xs font-headline font-bold uppercase tracking-wider text-tk-text flex items-center gap-2">
                  <Users size={14} className="text-tk-accent" />
                  <span>{isSolo ? 'PARTICIPANT DETAILS' : 'PLAYER ROSTER DETAILS'}</span>
                </div>

                {isRangeTeam && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-tk-text-muted">
                      {players.length}/{teamBounds.max} Added
                    </span>
                    {players.length < teamBounds.max && (
                      <button
                        type="button"
                        onClick={addPlayer}
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-tk-accent text-tk-bg hover:bg-tk-accent-dim transition-colors"
                      >
                        <Plus size={12} /> Add Player
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Player Cards List */}
              <AnimatePresence initial={false}>
                {players.map((player, idx) => {
                  const isCaptain = idx === captainIndex;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={EASE_OUT}
                      className={`p-5 border transition-all duration-200 bg-tk-bg-surface ${
                        isCaptain ? 'border-tk-border-accent' : 'border-tk-border'
                      }`}
                    >
                      {/* Player Card Header */}
                      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="radio"
                              name="captain-selector"
                              checked={isCaptain}
                              onChange={() => setCaptainIndex(idx)}
                              className="accent-tk-accent w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-headline font-black tracking-wider uppercase text-tk-text">
                              {isSolo ? 'Participant 1' : `Player ${idx + 1}`}
                            </span>
                          </label>

                          {isCaptain && !isSolo && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest uppercase bg-tk-accent/10 border border-tk-border-accent text-tk-accent px-2 py-0.5">
                              <Crown size={10} /> TEAM CAPTAIN / POC
                            </span>
                          )}
                        </div>

                        {/* Remove button for range team */}
                        {isRangeTeam && players.length > teamBounds.min && (
                          <button
                            type="button"
                            onClick={() => removePlayer(idx)}
                            className="text-tk-text-muted hover:text-red-500 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 transition-colors"
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        )}
                      </div>

                      {/* Same College Auto-Fill Checkbox for Player 2+ */}
                      {idx > 0 && !isSolo && (
                        <div className="mb-4">
                          <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-tk-text-muted hover:text-tk-text">
                            <input
                              type="checkbox"
                              checked={player.sameAsCaptainCollege || false}
                              onChange={(e) => updatePlayer(idx, 'sameAsCaptainCollege', e.target.checked)}
                              className="accent-tk-accent w-3.5 h-3.5 rounded-none cursor-pointer"
                            />
                            <span>Same college as Captain ({players[0]?.college || 'Captain'})</span>
                          </label>
                        </div>
                      )}

                      {/* Form Fields Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-tk-text-muted">
                            Full Name <span className="text-tk-accent">*</span>
                          </label>
                          <input
                            type="text"
                            value={player.fullName}
                            onChange={(e) => updatePlayer(idx, 'fullName', e.target.value)}
                            placeholder="John Doe"
                            className={`bg-tk-bg-raised border text-tk-text text-xs px-3.5 py-2.5 outline-none transition-all placeholder:text-tk-text-dim
                              focus:border-tk-accent
                              ${errors[`player_${idx}_fullName`] ? 'border-red-600' : 'border-tk-border hover:border-tk-border-accent'}`}
                          />
                          {errors[`player_${idx}_fullName`] && (
                            <span className="text-[9px] text-red-500">{errors[`player_${idx}_fullName`]}</span>
                          )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-tk-text-muted">
                            Email Address <span className="text-tk-accent">*</span>
                          </label>
                          <input
                            type="email"
                            value={player.email}
                            onChange={(e) => updatePlayer(idx, 'email', e.target.value)}
                            placeholder="player@example.com"
                            className={`bg-tk-bg-raised border text-tk-text text-xs px-3.5 py-2.5 outline-none transition-all placeholder:text-tk-text-dim
                              focus:border-tk-accent
                              ${errors[`player_${idx}_email`] ? 'border-red-600' : 'border-tk-border hover:border-tk-border-accent'}`}
                          />
                          {errors[`player_${idx}_email`] && (
                            <span className="text-[9px] text-red-500">{errors[`player_${idx}_email`]}</span>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-tk-text-muted">
                            Phone Number <span className="text-tk-accent">*</span>
                          </label>
                          <input
                            type="tel"
                            value={player.phone}
                            onChange={(e) => updatePlayer(idx, 'phone', e.target.value)}
                            placeholder="+91 9876543210"
                            className={`bg-tk-bg-raised border text-tk-text text-xs px-3.5 py-2.5 outline-none transition-all placeholder:text-tk-text-dim
                              focus:border-tk-accent
                              ${errors[`player_${idx}_phone`] ? 'border-red-600' : 'border-tk-border hover:border-tk-border-accent'}`}
                          />
                          {errors[`player_${idx}_phone`] && (
                            <span className="text-[9px] text-red-500">{errors[`player_${idx}_phone`]}</span>
                          )}
                        </div>

                        {/* College */}
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-tk-text-muted">
                            College / Institution <span className="text-tk-accent">*</span>
                          </label>
                          <input
                            type="text"
                            value={player.sameAsCaptainCollege ? players[0]?.college || '' : player.college}
                            disabled={player.sameAsCaptainCollege && idx > 0}
                            onChange={(e) => {
                              if (idx === 0) {
                                handleCaptainCollegeChange(e.target.value);
                              } else {
                                updatePlayer(idx, 'college', e.target.value);
                              }
                            }}
                            placeholder="XYZ University, Gujarat"
                            className={`bg-tk-bg-raised border text-tk-text text-xs px-3.5 py-2.5 outline-none transition-all placeholder:text-tk-text-dim disabled:opacity-60
                              focus:border-tk-accent
                              ${errors[`player_${idx}_college`] ? 'border-red-600' : 'border-tk-border hover:border-tk-border-accent'}`}
                          />
                          {errors[`player_${idx}_college`] && (
                            <span className="text-[9px] text-red-500">{errors[`player_${idx}_college`]}</span>
                          )}
                        </div>

                        {/* Year of Study */}
                        <div className="flex flex-col gap-1 sm:col-span-2">
                          <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-tk-text-muted">
                            Year of Study <span className="text-tk-accent">*</span>
                          </label>
                          <select
                            value={player.yearOfStudy}
                            onChange={(e) => updatePlayer(idx, 'yearOfStudy', e.target.value)}
                            className="bg-tk-bg-raised border border-tk-border hover:border-tk-border-accent focus:border-tk-accent text-tk-text text-xs px-3.5 py-2.5 outline-none transition-all"
                          >
                            {YEAR_OPTIONS.map((yr) => (
                              <option key={yr} value={yr} className="bg-tk-bg text-tk-text">
                                {yr}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* Submit / Step Actions */}
          <div className="mt-2 flex flex-col sm:flex-row gap-3 items-center justify-between">
            {isLargeTeam && step === 1 && (
              <button
                type="button"
                onClick={() => {
                  if (!teamName.trim()) {
                    setErrors({ teamName: 'Team name is required' });
                    return;
                  }
                  setErrors({});
                  setStep(2);
                }}
                className="w-full inline-flex items-center justify-center gap-2 font-headline font-black uppercase tracking-[0.2em] text-xs py-4 px-8 bg-tk-accent text-tk-bg hover:bg-tk-accent-dim transition-colors"
              >
                NEXT: FILL PLAYER ROSTER <ChevronRight size={16} />
              </button>
            )}

            {isLargeTeam && step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-3 border border-tk-border text-tk-text-muted hover:text-tk-text"
              >
                <ChevronLeft size={14} /> Back to Setup
              </button>
            )}

            {(!isLargeTeam || step === 2) && (
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-3 font-headline font-black uppercase tracking-[0.2em] text-sm py-4 px-8 transition-colors duration-200 disabled:opacity-50"
                style={{ background: 'var(--tk-accent)', color: 'var(--tk-bg)' }}
                onMouseEnter={(e) => {
                  if (!submitting) (e.currentTarget as HTMLButtonElement).style.background = 'var(--tk-accent-dim)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'var(--tk-accent)';
                }}
              >
                {submitting ? 'SUBMITTING REGISTRATION...' : 'ENTER THE ARENA'}
                {!submitting && <ArrowRight size={16} />}
              </motion.button>
            )}
          </div>

          <p className="text-[10px] text-tk-text-muted text-center leading-relaxed">
            By completing registration you confirm all player information is accurate and agree to our{' '}
            <Link href="/terms-of-entry" className="text-tk-accent hover:underline">
              Terms of Entry
            </Link>.
          </p>
        </motion.div>
      )}
    </form>
  );
}

export default function RegisterPage() {
  const { data: statsRes } = useFetch<any>('/api/stats');
  const statsList = statsRes?.data && Array.isArray(statsRes.data) ? statsRes.data : [];

  const prizeStat = statsList.find((s: any) => s.id === 'prize-pool');
  const warriorsStat = statsList.find((s: any) => s.id === 'warriors');

  const prizePoolDisplay = prizeStat ? prizeStat.displayValue : 'TBA';
  const participantsDisplay = warriorsStat ? warriorsStat.displayValue : 'Open';

  if (!REGISTRATIONS_OPEN) return <ClosedState />;

  return (
    <div className="min-h-screen bg-tk-bg text-tk-text">
      <section className="px-4 sm:px-6 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* LEFT — Stakes & Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col gap-10"
          >
            <div className="flex flex-col gap-4">
              <div className="text-xs tracking-[0.3em] uppercase font-bold" style={{ color: 'var(--tk-accent)' }}>
                ◈ REGISTRATION OPEN
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tighter font-headline leading-[0.9]">
                CLAIM YOUR<br />
                <span style={{ color: 'var(--tk-accent)' }}>SEAT</span> IN<br />
                THE ARENA.
              </h1>
              <p className="text-tk-text-muted text-base max-w-sm">
                Select your arena, assemble your squad, and register your team for TECH KURUKSHETRA 2027.
              </p>
            </div>

            {/* Deadline Counter */}
            <div className="flex flex-col gap-3">
              <div className="text-[10px] text-red-500 tracking-[0.2em] uppercase font-bold flex items-center gap-1.5">
                <Zap size={10} className="fill-red-500" /> REGISTRATION STATUS
              </div>
              <DeadlineCountdown />
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-tk-border bg-tk-bg-surface p-4">
                <div className="text-3xl font-black font-headline" style={{ color: 'var(--tk-accent)' }}>
                  {participantsDisplay}
                </div>
                <div className="text-[10px] text-tk-text-muted uppercase tracking-[0.15em] mt-1">Registrations</div>
              </div>
              <div className="border border-tk-border bg-tk-bg-surface p-4">
                <div className="text-3xl font-black font-headline" style={{ color: 'var(--tk-accent)' }}>
                  {prizePoolDisplay}
                </div>
                <div className="text-[10px] text-tk-text-muted uppercase tracking-[0.15em] mt-1">Prize Pool</div>
              </div>
              <div className="col-span-2 border border-tk-border bg-tk-bg-surface p-4 flex items-center gap-3">
                <Trophy size={20} className="flex-shrink-0" style={{ color: 'var(--tk-accent)' }} />
                <div className="text-xs text-tk-text-muted">
                  Winners get industry recognition, cash prizes, and direct referrals to top tech firms.
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Dynamic Registration Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...EASE_OUT, delay: 0.25 }}
            className="lg:col-span-7 border border-tk-border bg-tk-bg-surface p-6 sm:p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black font-headline tracking-tight text-tk-text">ARENA REGISTRATION</h2>
              <p className="text-tk-text-muted text-xs mt-1">Select an event below to initialize your roster form.</p>
            </div>

            <Suspense fallback={<div className="text-xs text-tk-text-muted py-8">Loading registration form...</div>}>
              <DynamicRegisterForm />
            </Suspense>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
