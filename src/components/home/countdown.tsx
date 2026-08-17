'use client';

import { useState, useEffect } from 'react';

const DEFAULT_TARGET_DATE = '2027-01-16T00:00:00+05:30';

function getTargetTimestamp(): number {
  let dateStr = DEFAULT_TARGET_DATE;

  if (typeof window !== 'undefined' && (window as any).__EVENT_TARGET_DATE) {
    dateStr = (window as any).__EVENT_TARGET_DATE;
  } else if (process.env.NEXT_PUBLIC_EVENT_DATE) {
    dateStr = process.env.NEXT_PUBLIC_EVENT_DATE;
  }

  dateStr = dateStr.trim();

  // If input is purely YYYY-MM-DD, expand to full ISO time string T00:00:00
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    dateStr += 'T00:00:00';
  }

  // Ensure string has explicit timezone offset if missing (force IST +05:30)
  // Check if string does NOT end with Z or a timezone offset like +05:30 or -05:00
  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(dateStr)) {
    dateStr += '+05:30';
  }

  const parsed = new Date(dateStr).getTime();
  return isNaN(parsed) ? new Date(DEFAULT_TARGET_DATE).getTime() : parsed;
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

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    setMounted(true);
    let intervalId: NodeJS.Timeout | null = null;

    const updateTimer = () => {
      const nextTime = calculateTimeLeft();

      setTimeLeft((prev) => {
        if (
          prev.days === nextTime.days &&
          prev.hrs === nextTime.hrs &&
          prev.mins === nextTime.mins &&
          prev.secs === nextTime.secs
        ) {
          return prev;
        }
        return nextTime;
      });

      const target = getTargetTimestamp();
      if (target - Date.now() <= 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    updateTimer();
    intervalId = setInterval(updateTimer, 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HRS',  value: String(timeLeft.hrs).padStart(2, '0') },
    { label: 'MINS', value: String(timeLeft.mins).padStart(2, '0') },
    { label: 'SECS', value: String(timeLeft.secs).padStart(2, '0') },
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
