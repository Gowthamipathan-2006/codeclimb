
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Lock, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [linkStatus, setLinkStatus] = useState<'expired' | 'invalid' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const initRecoverySession = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

      const errorCode = hashParams.get('error_code') || queryParams.get('error_code');
      if (errorCode === 'otp_expired') {
        if (!mounted) return;
        setLinkStatus('expired');
        setChecking(false);
        return;
      }

      const code = queryParams.get('code');
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          if (!mounted) return;
          const isExpired = /expired|otp_expired/i.test(error.message);
          setLinkStatus(isExpired ? 'expired' : 'invalid');
          setChecking(false);
          return;
        }
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (session) {
        setSessionReady(true);
        setLinkStatus(null);
        setChecking(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (!mounted) return;

      const { data: { session: retriedSession } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (retriedSession) {
        setSessionReady(true);
        setLinkStatus(null);
      } else {
        setLinkStatus('invalid');
      }
      setChecking(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if ((event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') && session) {
        setSessionReady(true);
        setLinkStatus(null);
        setChecking(false);
      }
    });

    initRecoverySession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({ title: "Password Too Short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Passwords Don't Match", description: "Please make sure both passwords match.", variant: "destructive" });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSuccess(true);
      await supabase.auth.signOut();
      toast({ title: "Password Updated ✅", description: "Password updated successfully. Please login." });
    }
    setLoading(false);
  };

  const renderContent = () => {
    if (checking) {
      return (
        <div className="text-center py-6">
          <p className="text-muted-foreground">Verifying reset link…</p>
        </div>
      );
    }

    if (!sessionReady && !success) {
      return (
        <div className="text-center space-y-4">
          <AlertTriangle className="h-10 w-10 text-destructive mx-auto" />
          <p className="text-muted-foreground">
            {linkStatus === 'expired'
              ? 'This password reset link has expired. Please request a new reset link.'
              : 'Invalid or expired reset link. Please request a new password reset.'}
          </p>
          <Button
            onClick={() => navigate('/forgot-password')}
            className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
          >
            Request New Reset Link
          </Button>
        </div>
      );
    }

    if (success) {
      return (
        <div className="space-y-4">
          <p className="text-center text-muted-foreground">
            Password updated successfully. Please login.
          </p>
          <Button
            onClick={() => navigate('/login')}
            className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
          >
            Go to Login
          </Button>
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-semibold">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            placeholder="At least 6 characters"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground font-semibold">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
            placeholder="Confirm your new password"
          />
        </div>
        <Button
          type="submit"
          className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
          disabled={loading}
        >
          <Lock className="h-4 w-4 mr-2" />
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    );
  };

  return (
    <div className="min-h-screen cute-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md cute-card border-0 animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/15 flex items-center justify-center">
              {success ? <CheckCircle2 className="h-8 w-8 text-primary" /> : <Code className="h-8 w-8 text-primary" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            {success ? 'Password Updated! ✅' : 'Reset Your Password 🔐'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {success
              ? 'You can now login with your new password.'
              : checking
              ? 'Please wait…'
              : sessionReady
              ? 'Enter your new password below.'
              : linkStatus === 'expired'
              ? 'This reset link has expired.'
              : 'Reset link is not valid.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderContent()}
          {!success && !checking && (
            <div className="mt-4 text-center">
              <Link to="/login" className="text-muted-foreground hover:text-primary text-sm font-semibold inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Login
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
