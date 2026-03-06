
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Mail, RefreshCw, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const { toast } = useToast();

  const handleResend = async () => {
    if (!email) {
      toast({ title: "Error", description: "No email address found. Please sign up again.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: window.location.origin }
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email Sent! 📧", description: "A new verification link has been sent to your email." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen cute-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md cute-card border-0 animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/15 flex items-center justify-center">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">Check Your Email 📧</CardTitle>
          <CardDescription className="text-muted-foreground">
            A verification link has been sent to{' '}
            {email ? <span className="font-semibold text-foreground">{email}</span> : 'your email'}.
            <br />
            Please verify your email before logging in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleResend}
            className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-border"
          >
            <Link to="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Go to Login
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
