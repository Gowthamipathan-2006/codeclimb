
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code, LogOut, Trophy, BookOpen, CheckCircle2, Wrench } from 'lucide-react';

const MAX_LEVELS = 30;

const languages = [
  { name: 'C', key: 'c', bg: 'bg-cute-sky/20', accent: 'text-accent-foreground', description: 'Master the fundamentals of programming' },
  { name: 'C++', key: 'c++', bg: 'bg-cute-lavender/20', accent: 'text-primary', description: 'Object-oriented programming excellence' },
  { name: 'Java', key: 'java', bg: 'bg-cute-peach/20', accent: 'text-destructive', description: 'Enterprise-grade application development' },
  { name: 'Python', key: 'python', bg: 'bg-cute-mint/20', accent: 'text-accent-foreground', description: 'Versatile and beginner-friendly' },
  { name: 'HTML', key: 'html', bg: 'bg-cute-yellow/20', accent: 'text-secondary-foreground', description: 'Structure the web with markup' },
  { name: 'CSS', key: 'css', bg: 'bg-cute-pink/20', accent: 'text-secondary-foreground', description: 'Style and design beautiful interfaces' },
  { name: 'JavaScript', key: 'javascript', bg: 'bg-cute-yellow/30', accent: 'text-foreground', description: 'Dynamic web development' },
];

const tools = [
  { name: 'SQL', key: 'sql', bg: 'bg-cute-sky/20', accent: 'text-primary', description: 'Query and manage databases' },
  { name: 'Git & GitHub', key: 'git', bg: 'bg-cute-peach/20', accent: 'text-destructive', description: 'Version control mastery' },
  { name: 'Linux / CLI', key: 'linux', bg: 'bg-cute-mint/20', accent: 'text-accent-foreground', description: 'Command line confidence' },
  { name: 'DSA', key: 'dsa', bg: 'bg-cute-lavender/20', accent: 'text-primary', description: 'Data Structures & Algorithms' },
  { name: 'REST APIs', key: 'rest-apis', bg: 'bg-cute-yellow/20', accent: 'text-secondary-foreground', description: 'Build and consume APIs' },
  { name: 'JSON', key: 'json', bg: 'bg-cute-pink/20', accent: 'text-secondary-foreground', description: 'Data interchange format' },
  { name: 'Debugging', key: 'debugging', bg: 'bg-cute-yellow/30', accent: 'text-foreground', description: 'Find and fix bugs like a pro' },
  { name: 'Regex', key: 'regex', bg: 'bg-cute-sky/30', accent: 'text-primary', description: 'Pattern matching mastery' },
];

const allTracks = [...languages, ...tools];

const Dashboard = () => {
  const { user, displayName, logout, isAuthenticated, loading: authLoading } = useAuth();
  const { getCompletedLevels, getHighestCompletedLevel } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleTrackClick = (key: string) => {
    const nextLevel = Math.min(getHighestCompletedLevel(key) + 1, MAX_LEVELS);
    navigate(`/language/${key}/${nextLevel}`);
  };

  if (authLoading || !user) return null;

  const totalCompleted = allTracks.reduce((sum, t) => sum + getCompletedLevels(t.key), 0);
  const totalLevels = allTracks.length * MAX_LEVELS;
  const overallProgress = (totalCompleted / totalLevels) * 100;

  const renderCard = (track: typeof languages[0]) => {
    const completed = getCompletedLevels(track.key);
    const progress = (completed / MAX_LEVELS) * 100;

    return (
      <Card
        key={track.key}
        className="cute-card border-0 hover:shadow-cute-hover transition-all duration-300 cursor-pointer hover:-translate-y-1 animate-fade-in"
        onClick={() => handleTrackClick(track.key)}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center font-bold">
              <div className={`w-8 h-8 rounded-xl ${track.bg} flex items-center justify-center mr-3`}>
                <span className={`text-xs font-extrabold ${track.accent}`}>
                  {track.name.charAt(0)}
                </span>
              </div>
              {track.name}
            </CardTitle>
            <Badge className={`border-0 rounded-full font-semibold ${completed > 0 ? 'bg-cute-success/20 text-cute-success' : 'bg-muted text-muted-foreground'}`}>
              {completed > 0 && <CheckCircle2 className="h-3 w-3 mr-1" />}
              {completed}/{MAX_LEVELS}
            </Badge>
          </div>
          <CardDescription className="text-muted-foreground">
            {track.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2 mb-3 bg-muted" />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{progress.toFixed(0)}% Complete</span>
            <Button
              size="sm"
              className="cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs shadow-cute"
            >
              <BookOpen className="h-3 w-3 mr-1" />
              {completed === 0 ? 'Start' : completed >= MAX_LEVELS ? 'Review' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen cute-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-foreground">CodeClimb</h1>
              <p className="text-muted-foreground text-sm">Welcome back, {displayName} 👋</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="cute-btn rounded-full border-destructive/30 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </header>

        {/* Overall Progress */}
        <Card className="mb-8 cute-card border-0 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center font-extrabold">
              <div className="w-8 h-8 rounded-xl bg-cute-yellow/30 flex items-center justify-center mr-3">
                <Trophy className="h-4 w-4 text-secondary-foreground" />
              </div>
              Overall Progress
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {totalCompleted} out of {totalLevels} levels completed ✨
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3 bg-muted" />
            <p className="text-sm text-muted-foreground mt-2">{overallProgress.toFixed(1)}% Complete</p>
          </CardContent>
        </Card>

        {/* Programming Languages */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
            <Code className="h-4 w-4 text-primary" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Programming Languages</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {languages.map(renderCard)}
        </div>

        {/* Tools & Technologies */}
        <div className="flex items-center gap-3 mb-4 animate-fade-in">
          <div className="w-8 h-8 rounded-xl bg-cute-peach/20 flex items-center justify-center">
            <Wrench className="h-4 w-4 text-destructive" />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">Tools & Technologies</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(renderCard)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
