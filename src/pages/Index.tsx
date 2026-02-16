
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Code, TrendingUp, Award, Users, Sparkles } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen cute-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 animate-fade-in">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-extrabold text-foreground">CodeClimb</h1>
          </div>
          <div className="space-x-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="cute-btn rounded-full border-primary/30 text-primary hover:bg-primary/10"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute"
            >
              Sign Up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-cute-pink/30 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            Learn to code the fun way
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold text-foreground mb-6 leading-tight">
            Master Programming
            <span className="text-primary"> Step by Step</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Learn 7 programming languages through 100 progressive levels each. 
            Theory, practice, and mastery — all in one adorable platform ✨
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-5 text-lg shadow-cute-lg"
          >
            Start Your Journey 🚀
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: TrendingUp, color: 'bg-cute-lavender/20 text-primary', title: 'Progressive Learning', desc: '100 levels per language, each building on the previous' },
            { icon: Award, color: 'bg-cute-pink/20 text-secondary-foreground', title: 'Interactive Quizzes', desc: 'Test your knowledge with guided coding challenges' },
            { icon: Users, color: 'bg-cute-mint/20 text-accent-foreground', title: 'Track Progress', desc: 'Monitor your advancement across all languages' },
          ].map((f) => (
            <div key={f.title} className="cute-card p-8 text-center hover:shadow-cute-hover transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mx-auto mb-4`}>
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Languages Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-extrabold text-foreground mb-8">Supported Languages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[
              { name: 'C', bg: 'bg-cute-sky/30' },
              { name: 'C++', bg: 'bg-cute-lavender/30' },
              { name: 'Java', bg: 'bg-cute-peach/30' },
              { name: 'Python', bg: 'bg-cute-mint/30' },
              { name: 'HTML', bg: 'bg-cute-yellow/30' },
              { name: 'CSS', bg: 'bg-cute-pink/30' },
              { name: 'JavaScript', bg: 'bg-cute-lavender/20' },
            ].map((lang) => (
              <div key={lang.name} className={`${lang.bg} rounded-2xl p-5 text-center hover:shadow-cute transition-all duration-200 hover:-translate-y-1 cursor-default`}>
                <div className="text-xl font-extrabold text-foreground">{lang.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
