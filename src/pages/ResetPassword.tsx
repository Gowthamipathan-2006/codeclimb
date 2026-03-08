
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for PASSWORD_RECOVERY event which fires when Supabase
    // exchanges the hash-fragment tokens for a real session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
        setChecking(false);
      }
    });

    // Also check if a session already exists (e.g. fast token exchange)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      // Give the onAuthStateChange listener a moment to fire
      setTimeout(() => setChecking(false), 1500);
    });

    return () => subscription.unsubscribe();
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
      toast({ title: "Password Updated ✅", description: "You can now log in with your new password." });
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
          <p className="text-muted-foreground">Invalid or expired reset link. Please request a new password reset.</p>
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
        <Button
          onClick={() => navigate('/login')}
          className="w-full cute-btn rounded-full bg-cute-success text-foreground font-bold hover:opacity-90 shadow-cute"
        >
          Go to Login
        </Button>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground font-semibold">New Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground" placeholder="At least 6 characters" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-foreground font-semibold">Confirm Password</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground" placeholder="Confirm your new password" />
        </div>
        <Button type="submit" className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute" disabled={loading}>
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
            <div className="w-16 h-16 rounded-3xl bg-cute-lavender/20 flex items-center justify-center">
              {success ? <CheckCircle2 className="h-8 w-8 text-cute-success" /> : <Lock className="h-8 w-8 text-primary" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            {success ? 'Password Updated! ✅' : 'Reset Password 🔐'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {success ? 'Password updated successfully. Please log in.' : checking ? 'Please wait…' : sessionReady ? 'Enter your new password below.' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
