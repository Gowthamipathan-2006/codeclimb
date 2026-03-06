
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, ArrowLeft, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      toast({ title: "Email Sent 📧", description: "Check your inbox for the password reset link." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen cute-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md cute-card border-0 animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-cute-peach/20 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">
            {sent ? 'Check Your Email 📧' : 'Forgot Password?'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {sent
              ? 'A password reset link has been sent to your email.'
              : 'Enter your email and we\'ll send you a reset link.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                  placeholder="Enter your email"
                />
              </div>
              <Button
                type="submit"
                className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => { setSent(false); setEmail(''); }}
                variant="outline"
                className="w-full cute-btn rounded-full border-primary/30 text-primary hover:bg-primary/10"
              >
                Resend to a different email
              </Button>
            </div>
          )}
          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
