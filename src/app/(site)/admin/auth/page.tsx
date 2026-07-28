'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LayoutDashboard, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    toast({ title: "Authenticating...", description: "Please wait." });
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        toast({ title: "Login Successful", description: "Redirecting to dashboard..." });
        router.push('/admin/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Authentication Failed",
          description: data.message || "Invalid username or password.",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "An error occurred connecting to the server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-20 px-4 flex flex-col items-center justify-center bg-[#0A0A0F]">
      <div className="glass-panel p-6 md:p-10 max-w-md w-full border-[#FF6B00]/20 relative overflow-hidden bg-black/40">
        <div className="absolute top-0 left-0 w-16 h-1 bg-[#FF6B00]" />
        <div className="text-center mb-8">
          <LayoutDashboard className="w-12 h-12 text-[#FF6B00] mx-auto mb-4" />
          <h1 className="font-headline text-2xl tracking-tighter text-white uppercase">KURUKSHETRA CONTROL</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] mt-2">Admin Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Username</Label>
            <Input name="username" type="text" required defaultValue="admin" placeholder="admin" className="bg-white/5 border-white/10 rounded-none h-12 pl-4 focus:border-[#FF6B00] transition-all text-sm tracking-widest text-white" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Security Password</Label>
            <div className="relative">
              <Input name="password" type={showPassword ? "text" : "password"} required placeholder="••••••••" className="bg-white/5 border-white/10 rounded-none h-12 pl-4 pr-12 focus:border-[#FF6B00] transition-all text-white" />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-white"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/80 py-6 font-headline tracking-[0.2em] rounded-none accent-glow text-black font-bold">
            {isSubmitting ? <Loader2 className="animate-spin text-black" /> : 'INITIATE SESSION'}
          </Button>
        </form>
      </div>
    </div>
  );
}
