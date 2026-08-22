'use client';

import { useState, useEffect } from 'react';

const DEFAULT_TARGET_DATE = '2027-01-23T09:00:00+05:30';

function getTargetTimestamp(): number {
  let dateStr = DEFAULT_TARGET_DATE;

  if (typeof window !== 'undefined' && (window as any).__EVENT_TARGET_DATE) {
    dateStr = (window as any).__EVENT_TARGET_DATE;
  } else if (process.env.NEXT_PUBLIC_EVENT_DATE) {
    dateStr = process.env.NEXT_PUBLIC_EVENT_DATE;
  }

  dateStr = dateStr.trim().replace(/^["']|["']$/g, '');

  // If input is purely YYYY-MM-DD, expand to full ISO time string T09:00:00
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    dateStr += 'T09:00:00';
  }

  // Ensure string has explicit timezone offset if missing (force IST +05:30)
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(dateStr)) {
    dateStr += '+05:30';
  }

  let parsed = new Date(dateStr).getTime();
  if (isNaN(parsed) || parsed <= Date.now()) {
    parsed = new Date(DEFAULT_TARGET_DATE).getTime();
  }

  // Fallback to future date (Jan 23, 2027) if past or invalid
  if (isNaN(parsed) || parsed <= Date.now()) {
    parsed = new Date('2027-01-23T09:00:00+05:30').getTime();
  }

  return parsed;
}

function calculateTimeLeft() {
  const target = getTargetTimestamp();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

const ZERO_TIME = { days: 0, hrs: 0, mins: 0, secs: 0 };

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ZERO_TIME);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft());
    };

    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const activeTime = mounted ? timeLeft : calculateTimeLeft();

  const units = [
    { label: 'DAYS', value: String(activeTime.days).padStart(2, '0') },
    { label: 'HRS',  value: String(activeTime.hrs).padStart(2, '0') },
    { label: 'MINS', value: String(activeTime.mins).padStart(2, '0') },
    { label: 'SECS', value: String(activeTime.secs).padStart(2, '0') },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-[#0A0A0F]/90 border border-[#FF6B00]/40 px-3 sm:px-6 py-2 sm:py-3 min-w-[64px] sm:min-w-[84px] text-center shadow-[0_0_15px_rgba(255,107,0,0.15)]">
              <span className="text-2xl sm:text-4xl font-black text-[#FF6B00] font-headline tabular-nums tracking-wider">
                {value}
              </span>
              <div className="text-[9px] sm:text-[10px] text-[#8A8A8A] tracking-[0.2em] mt-1 font-bold">{label}</div>
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-2xl sm:text-3xl font-black text-[#FF6B00]/60 mb-4 select-none animate-pulse">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

