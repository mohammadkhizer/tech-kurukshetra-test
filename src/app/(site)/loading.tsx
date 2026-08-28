import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center p-6 text-[#F1F1F1]">
      <div className="relative flex flex-col items-center gap-4">
        {/* Pulsing outer glow ring */}
        <div className="absolute -inset-4 rounded-full bg-[#FF6B00]/10 blur-xl animate-pulse" />
        
        {/* Central loader icon */}
        <div className="relative p-4 border border-[#FF6B00]/30 bg-[#FF6B00]/5 rounded-none">
          <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
        </div>

        {/* Text */}
        <div className="text-xs font-headline font-bold uppercase tracking-[0.3em] text-[#FF6B00] animate-pulse">
          INITIALIZING ARENA...
        </div>
      </div>
    </div>
  );
}
