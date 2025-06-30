
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Code, LogOut, Trophy, BookOpen } from 'lucide-react';

const languages = [
  { name: 'C', color: 'bg-blue-500', description: 'Master the fundamentals of programming' },
  { name: 'C++', color: 'bg-purple-500', description: 'Object-oriented programming excellence' },
  { name: 'Java', color: 'bg-red-500', description: 'Enterprise-grade application development' },
  { name: 'Python', color: 'bg-green-500', description: 'Versatile and beginner-friendly' },
  { name: 'HTML', color: 'bg-orange-500', description: 'Structure the web with markup' },
  { name: 'CSS', color: 'bg-pink-500', description: 'Style and design beautiful interfaces' },
  { name: 'JavaScript', color: 'bg-yellow-500', description: 'Dynamic web development' },
];

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { getCompletedLevels } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageClick = (language: string) => {
    navigate(`/language/${language.toLowerCase()}/1`);
  };

  if (!user) return null;

  const totalCompleted = languages.reduce((sum, lang) => sum + getCompletedLevels(lang.name), 0);
  const totalLevels = languages.length * 100;
  const overallProgress = (totalCompleted / totalLevels) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <Code className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">CodeClimb Dashboard</h1>
              <p className="text-gray-300">Welcome back, {user.userId}!</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </header>

        {/* Overall Progress */}
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
              Overall Progress
            </CardTitle>
            <CardDescription className="text-gray-300">
              {totalCompleted} out of {totalLevels} levels completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-sm text-gray-300 mt-2">{overallProgress.toFixed(1)}% Complete</p>
          </CardContent>
        </Card>

        {/* Languages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language) => {
            const completed = getCompletedLevels(language.name);
            const progress = (completed / 100) * 100;
            
            return (
              <Card
                key={language.name}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer transform hover:scale-105"
                onClick={() => handleLanguageClick(language.name)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <div className={`w-4 h-4 rounded-full ${language.color} mr-3`}></div>
                      {language.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {completed}/100
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300">
                    {language.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="h-2 mb-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{progress.toFixed(0)}% Complete</span>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <BookOpen className="h-3 w-3 mr-1" />
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
