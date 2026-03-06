
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, LogIn } from 'lucide-react';

const EmailConfirmed = () => {
  return (
    <div className="min-h-screen cute-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md cute-card border-0 animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-cute-mint/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">Email Verified! ✅</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your email has been verified. You can now log in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
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

export default EmailConfirmed;
