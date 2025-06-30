
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Code, TrendingUp, Award, Users } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Code className="h-8 w-8 text-blue-400" />
            <h1 className="text-2xl font-bold text-white">CodeClimb</h1>
          </div>
          <div className="space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/login')}
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign Up
            </Button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Master Programming
            <span className="text-blue-400"> Step by Step</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Learn 7 programming languages through 100 progressive levels each. 
            Theory, practice, and mastery - all in one platform.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
          >
            Start Your Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Progressive Learning</h3>
            <p className="text-gray-300">100 levels per language, each building on the previous</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <Award className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Exams</h3>
            <p className="text-gray-300">Test your knowledge with hands-on coding challenges</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 text-center">
            <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Track Progress</h3>
            <p className="text-gray-300">Monitor your advancement across all languages</p>
          </div>
        </div>

        {/* Languages Section */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-white mb-8">Supported Languages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {['C', 'C++', 'Java', 'Python', 'HTML', 'CSS', 'JavaScript'].map((lang) => (
              <div key={lang} className="bg-white/10 backdrop-blur-lg rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white">{lang}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
