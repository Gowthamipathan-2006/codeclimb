
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, LogIn } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({ title: "Welcome back! 🎉", description: "Successfully logged in to CodeClimb." });
        navigate('/dashboard');
      } else {
        toast({ title: "Login Failed", description: "Invalid email or password. Please try again.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An error occurred. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen cute-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md cute-card border-0 animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-primary/15 flex items-center justify-center">
              <Code className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-extrabold text-foreground">Welcome Back 👋</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to continue your coding journey
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl bg-muted/50 border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter your password"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
              disabled={loading}
            >
              <LogIn className="h-4 w-4 mr-2" />
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
