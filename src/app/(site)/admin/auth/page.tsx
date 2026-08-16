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

type Tab = 'login' | 'signup';

export default function AuthPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('login');

  // ── Login state ──────────────────────────────────────────────────────────────
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // ── Signup state ─────────────────────────────────────────────────────────────
  const [signupSubmitting, setSignupSubmitting] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

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

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const username = sanitizeString(signupForm.username)?.toLowerCase();
    const email = sanitizeString(signupForm.email)?.toLowerCase();
    const password = signupForm.password.trim();
    const confirmPassword = signupForm.confirmPassword.trim();

    if (!username || username.length < 3) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Username must be at least 3 characters.' });
      return;
    }
    if (!email || !email.includes('@')) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Please enter a valid email address.' });
      return;
    }
    if (password.length < 6) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Password must be at least 6 characters.' });
      return;
    }
    if (password !== confirmPassword) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Passwords do not match.' });
      return;
    }

    setSignupSubmitting(true);
    toast({ title: 'Creating Account...', description: 'Setting up your admin profile.' });

    try {
      const res = await fetch('/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({ title: 'Account Created!', description: 'Redirecting to dashboard...' });
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Signup Failed',
          description: data.message || 'Could not create account. Try again.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Connection Error',
        description: 'Unable to reach the server. Try again.',
      });
    } finally {
      setSignupSubmitting(false);
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

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 px-8">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex items-center gap-2 pb-3 pt-1 text-[10px] font-headline tracking-[0.2em] uppercase border-b-2 transition-all mr-8 ${
              activeTab === 'login'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-muted-foreground hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Login
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex items-center gap-2 pb-3 pt-1 text-[10px] font-headline tracking-[0.2em] uppercase border-b-2 transition-all ${
              activeTab === 'signup'
                ? 'border-[#FF6B00] text-[#FF6B00]'
                : 'border-transparent text-muted-foreground hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Sign Up
          </button>
        </div>

        {/* ── LOGIN FORM ────────────────────────────────────────────────── */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            <div className="p-3 border border-[#FF6B00]/20 bg-[#FF6B00]/5 text-[10px] text-[#FF6B00]/80 uppercase tracking-widest font-mono text-center">
              Default: <span className="text-white font-bold">admin</span> /{' '}
              <span className="text-white font-bold">admin</span>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <User className="w-3 h-3" /> Username or Email
              </Label>
              <Input
                name="username"
                type="text"
                required
                placeholder="admin"
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

            <p className="text-center text-[10px] text-muted-foreground">
              New to the panel?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className="text-[#FF6B00] hover:underline"
              >
                Create an admin account
              </button>
            </p>
          </form>
        )}

        {/* ── SIGNUP FORM ───────────────────────────────────────────────── */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignup} className="p-8 space-y-4">
            <div className="p-3 border border-blue-500/20 bg-blue-500/5 text-[10px] text-blue-400/80 uppercase tracking-widest font-mono text-center">
              First account registered becomes <span className="text-white font-bold">Super Admin</span>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <User className="w-3 h-3" /> Username
              </Label>
              <Input
                type="text"
                required
                minLength={3}
                placeholder="e.g. kunal_admin"
                value={signupForm.username}
                onChange={(e) => setSignupForm((p) => ({ ...p, username: e.target.value }))}
                className="bg-white/5 border-white/10 rounded-none h-12 pl-4 focus:border-[#FF6B00] transition-all text-sm text-white placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Email Address
              </Label>
              <Input
                type="email"
                required
                placeholder="admin@college.edu"
                value={signupForm.email}
                onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                className="bg-white/5 border-white/10 rounded-none h-12 pl-4 focus:border-[#FF6B00] transition-all text-sm text-white placeholder:text-muted-foreground/50"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Password
                </Label>
                <div className="relative">
                  <Input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Min 6 chars"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                    className="bg-white/5 border-white/10 rounded-none h-12 pl-4 pr-10 focus:border-[#FF6B00] transition-all text-sm text-white placeholder:text-muted-foreground/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-white"
                    onClick={() => setShowSignupPassword((p) => !p)}
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Confirm
                </Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={signupForm.confirmPassword}
                    onChange={(e) => setSignupForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    className={`bg-white/5 border-white/10 rounded-none h-12 pl-4 pr-10 focus:border-[#FF6B00] transition-all text-sm text-white placeholder:text-muted-foreground/50 ${
                      signupForm.confirmPassword && signupForm.confirmPassword !== signupForm.password
                        ? 'border-red-500/50'
                        : signupForm.confirmPassword && signupForm.confirmPassword === signupForm.password
                        ? 'border-green-500/50'
                        : ''
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0.5 top-1/2 h-8 w-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-white"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </div>
            </div>

            {signupForm.confirmPassword && signupForm.confirmPassword !== signupForm.password && (
              <p className="text-[10px] text-red-400 font-mono">⚠ Passwords do not match</p>
            )}

            <Button
              type="submit"
              disabled={signupSubmitting}
              className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/80 py-6 font-headline tracking-[0.2em] rounded-none text-black font-bold text-sm mt-2 transition-all"
            >
              {signupSubmitting ? (
                <Loader2 className="animate-spin w-5 h-5 text-black" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  CREATE ADMIN ACCOUNT
                </>
              )}
            </Button>

            <p className="text-center text-[10px] text-muted-foreground">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="text-[#FF6B00] hover:underline"
              >
                Login here
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
