
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useStepProgress } from '@/hooks/useStepProgress';
import { curriculum, getTopic, getDifficulty } from '@/utils/curriculum';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, CheckCircle2, Award, Code, Lock } from 'lucide-react';

const MAX_LEVELS = 30;

const difficultyColors: Record<string, string> = {
  Beginner: 'bg-cute-mint/20 text-accent-foreground',
  Intermediate: 'bg-cute-yellow/20 text-secondary-foreground',
  Advanced: 'bg-cute-pink/20 text-secondary-foreground',
};

const TopicList = () => {
  const { language } = useParams<{ language: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { getCompletedLevels } = useProgress();
  const { isStepCompleted, getTopicStepCount, getCompletedTopicsCount, fetchStepProgress } = useStepProgress();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (language) fetchStepProgress(language.toLowerCase());
  }, [language, fetchStepProgress]);

  if (authLoading || !language) return null;

  const lang = language.toLowerCase();
  const topics = curriculum[lang] || [];
  const completedTopics = getCompletedTopicsCount(lang, topics.length);
  const progress = (completedTopics / topics.length) * 100;

  return (
    <div className="min-h-screen cute-gradient">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="cute-btn rounded-full border-primary/30 text-primary hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <h1 className="text-2xl font-extrabold text-foreground capitalize">{language}</h1>
          <Badge className="bg-cute-lavender/20 text-primary border-0 rounded-full font-bold">
            {completedTopics}/{topics.length}
          </Badge>
        </div>

        {/* Progress bar */}
        <Card className="cute-card border-0 mb-6 animate-fade-in">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-foreground font-bold text-sm">Course Progress</span>
              <span className="text-muted-foreground text-sm">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-muted" />
          </CardContent>
        </Card>

        {/* Topic List */}
        <div className="space-y-3">
          {topics.map((topicName, index) => {
            const level = index + 1;
            const difficulty = getDifficulty(level);
            const stepsCompleted = getTopicStepCount(lang, level);
            const isFullyDone = stepsCompleted === 3;
            const theoryDone = isStepCompleted(lang, level, 'theory');
            const quizDone = isStepCompleted(lang, level, 'quiz');
            const challengeDone = isStepCompleted(lang, level, 'challenge');

            return (
              <Card
                key={level}
                className="cute-card border-0 hover:shadow-cute-hover transition-all duration-300 cursor-pointer hover:-translate-y-0.5 animate-fade-in"
                onClick={() => navigate(`/language/${language}/${level}`)}
              >
                <CardContent className="py-4 px-5">
                  <div className="flex items-center gap-4">
                    {/* Level number */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                      isFullyDone ? 'bg-cute-success/20 text-cute-success' : 'bg-primary/10 text-primary'
                    }`}>
                      {isFullyDone ? <CheckCircle2 className="h-5 w-5" /> : level}
                    </div>

                    {/* Topic info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-bold text-sm truncate">{topicName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-[10px] border-0 rounded-full px-2 py-0 ${difficultyColors[difficulty] || 'bg-muted text-muted-foreground'}`}>
                          {difficulty}
                        </Badge>
                        {/* Step indicators */}
                        <div className="flex items-center gap-1.5">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${theoryDone ? 'bg-cute-success text-card' : 'bg-muted text-muted-foreground'}`}>
                            <BookOpen className="h-2.5 w-2.5" />
                          </div>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${quizDone ? 'bg-cute-success text-card' : 'bg-muted text-muted-foreground'}`}>
                            <Award className="h-2.5 w-2.5" />
                          </div>
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${challengeDone ? 'bg-cute-success text-card' : 'bg-muted text-muted-foreground'}`}>
                            <Code className="h-2.5 w-2.5" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <span className="text-muted-foreground text-xs font-semibold shrink-0">
                      {stepsCompleted}/3
                    </span>
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

export default TopicList;
