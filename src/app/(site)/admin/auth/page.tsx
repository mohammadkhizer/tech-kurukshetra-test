'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LayoutDashboard, Eye, EyeOff, Loader2, UserPlus, LogIn,
  ShieldCheck, Lock, User, Mail,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sanitizeString } from '@/lib/sanitizer';

export default function AuthPage() {
  const { toast } = useToast();
  const router = useRouter();

  // ── Login state ──────────────────────────────────────────────────────────────
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // ── Handlers ──────────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginSubmitting(true);

    const username = sanitizeString(loginForm.username);
    const password = loginForm.password.trim();

    toast({ title: 'Authenticating...', description: 'Verifying credentials.' });

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({ title: 'Login Successful', description: 'Redirecting to dashboard...' });
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: data.message || 'Invalid username or password.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Unable to reach the server. Try again.',
      });
    } finally {
      setLoginSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex flex-col items-center justify-center bg-[#0A0A0F]">
      <div className="glass-panel max-w-md w-full border-[#FF6B00]/20 relative overflow-hidden bg-black/40">
        {/* Accent strip */}
        <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-[#FF6B00] to-[#FF6B00]/0" />
        <div className="absolute top-0 right-0 w-20 h-1 bg-gradient-to-l from-[#FF6B00]/40 to-transparent" />

        {/* Header */}
        <div className="text-center pt-10 pb-6 px-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-none border border-[#FF6B00]/30 bg-[#FF6B00]/10 mb-4">
            <LayoutDashboard className="w-7 h-7 text-[#FF6B00]" />
          </div>
          <h1 className="font-headline text-2xl tracking-tighter text-white uppercase">
            KURUKSHETRA <span className="text-[#FF6B00]">CONTROL</span>
          </h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mt-2">
            Secure Admin Access Portal
          </p>
        </div>

        {/* ── LOGIN FORM ────────────────────────────────────────────────── */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <User className="w-3 h-3" /> Username or Email
            </Label>
            <Input
              name="username"
              type="text"
              required
              placeholder="Username or Email"
              value={loginForm.username}
              onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
              className="bg-white/5 border-white/10 rounded-none h-12 pl-4 focus:border-[#FF6B00] transition-all text-sm text-white placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Password
            </Label>
            <div className="relative">
              <Input
                name="password"
                type={showLoginPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                className="bg-white/5 border-white/10 rounded-none h-12 pl-4 pr-12 focus:border-[#FF6B00] transition-all text-white placeholder:text-muted-foreground/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-white"
                onClick={() => setShowLoginPassword((p) => !p)}
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loginSubmitting}
            className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/80 py-6 font-headline tracking-[0.2em] rounded-none text-black font-bold text-sm mt-2 transition-all"
          >
            {loginSubmitting ? (
              <Loader2 className="animate-spin w-5 h-5 text-black" />
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 mr-2" />
                INITIATE SESSION
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
