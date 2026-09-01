'use client';

import { useState, useEffect } from 'react';

function getTargetTimestamp(): number | null {
  let dateStr: string | undefined = undefined;

  if (typeof window !== 'undefined' && (window as any).__EVENT_TARGET_DATE) {
    dateStr = (window as any).__EVENT_TARGET_DATE;
  } else if (process.env.NEXT_PUBLIC_EVENT_DATE) {
    dateStr = process.env.NEXT_PUBLIC_EVENT_DATE;
  }

  if (!dateStr) {
    return null;
  }

  dateStr = dateStr.trim().replace(/^["']|["']$/g, '');

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    dateStr += 'T09:00:00';
  }

  if (!/(?:Z|[+-]\d{2}:?\d{2})$/i.test(dateStr)) {
    dateStr += '+05:30';
  }

  const parsed = new Date(dateStr).getTime();
  if (isNaN(parsed) || parsed <= Date.now()) {
    return null;
  }

  return parsed;
}

function calculateTimeLeft(targetTimestamp: number | null) {
  if (!targetTimestamp) {
    return { days: 0, hrs: 0, mins: 0, secs: 0, valid: false };
  }

  const now = Date.now();
  const diff = Math.max(0, targetTimestamp - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hrs: Math.floor((diff / (1000 * 60 * 60)) % 24),
    mins: Math.floor((diff / (1000 * 60)) % 60),
    secs: Math.floor((diff / 1000) % 60),
    valid: diff > 0,
  };
}

export function Countdown() {
  const [mounted, setMounted] = useState(false);
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hrs: 0, mins: 0, secs: 0, valid: false });

  useEffect(() => {
    setMounted(true);
    const target = getTargetTimestamp();
    setTargetTime(target);
    setTimeLeft(calculateTimeLeft(target));

    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft(target));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!mounted || !timeLeft.valid) {
    // Marked TODO: Event date set via NEXT_PUBLIC_EVENT_DATE env var or CMS
    return (
      <div className="border border-[#FF6B00]/30 bg-[#FF6B00]/5 px-4 py-2 text-xs text-[#FF6B00] tracking-[0.2em] uppercase font-headline">
        EVENT DATE ANNOUNCEMENT COMING SOON
      </div>
    );
  }

  const units = [
    { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
    { label: 'HRS',  value: String(timeLeft.hrs).padStart(2, '0') },
    { label: 'MINS', value: String(timeLeft.mins).padStart(2, '0') },
    { label: 'SECS', value: String(timeLeft.secs).padStart(2, '0') },
  ];

  return (
    <div className="flex items-center justify-center gap-1 min-[390px]:gap-2 sm:gap-4 max-w-full">
      {units.map(({ label, value }, i) => (
        <div key={label} className="flex items-center gap-1 min-[390px]:gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-[#0A0A0F]/90 border border-[#FF6B00]/40 px-2 min-[390px]:px-3 sm:px-6 py-1.5 sm:py-3 min-w-[48px] min-[390px]:min-w-[60px] sm:min-w-[84px] text-center shadow-[0_0_15px_rgba(255,107,0,0.15)]">
              <span className="text-lg min-[390px]:text-2xl sm:text-4xl font-black text-[#FF6B00] font-headline tabular-nums tracking-wider">
                {value}
              </span>
              <div className="text-[8px] sm:text-[10px] text-[#8A8A8A] tracking-[0.1em] sm:tracking-[0.2em] mt-0.5 sm:mt-1 font-bold">{label}</div>
            </div>
          </div>
          {i < units.length - 1 && (
            <span className="text-sm min-[390px]:text-2xl sm:text-3xl font-black text-[#FF6B00]/60 mb-3 sm:mb-4 select-none animate-pulse">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
