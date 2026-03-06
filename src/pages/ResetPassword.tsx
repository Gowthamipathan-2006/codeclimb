
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User arrived via recovery link — form is ready
      }
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
      // Sign out so user logs in with new password
      await supabase.auth.signOut();
      toast({ title: "Password Updated ✅", description: "You can now log in with your new password." });
    }
    setLoading(false);
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
            {success
              ? 'Password updated successfully. Please log in.'
              : 'Enter your new password below.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!success ? (
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
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          ) : (
            <Button
              onClick={() => navigate('/login')}
              className="w-full cute-btn rounded-full bg-cute-success text-foreground font-bold hover:opacity-90 shadow-cute"
            >
              Go to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
