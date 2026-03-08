
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { useStepProgress } from '@/hooks/useStepProgress';
import { curriculum, getDifficulty } from '@/utils/curriculum';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, CheckCircle2, Award, Code } from 'lucide-react';

const MAX_LEVELS = 30;

const difficultyMeta: Record<string, { label: string; emoji: string; cardBg: string; badgeBg: string }> = {
  Beginner: { label: 'Easy', emoji: '🟢', cardBg: 'bg-cute-mint/10', badgeBg: 'bg-cute-mint/20 text-accent-foreground' },
  Intermediate: { label: 'Medium', emoji: '🟡', cardBg: 'bg-cute-yellow/10', badgeBg: 'bg-cute-yellow/20 text-secondary-foreground' },
  Advanced: { label: 'Hard', emoji: '🔴', cardBg: 'bg-cute-pink/10', badgeBg: 'bg-cute-pink/20 text-secondary-foreground' },
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

  // Group topics by difficulty section
  const sections = [
    { difficulty: 'Beginner', topics: topics.slice(0, 10) },
    { difficulty: 'Intermediate', topics: topics.slice(10, 20) },
    { difficulty: 'Advanced', topics: topics.slice(20, 30) },
  ].filter(s => s.topics.length > 0);

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

        {/* Topic List grouped by difficulty */}
        <div className="space-y-8">
          {sections.map((section) => {
            const meta = difficultyMeta[section.difficulty];
            const startIndex = section.difficulty === 'Beginner' ? 0 : section.difficulty === 'Intermediate' ? 10 : 20;

            return (
              <div key={section.difficulty} className="space-y-3 animate-fade-in">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{meta.emoji}</span>
                  <h2 className="text-lg font-extrabold text-foreground">{meta.label}</h2>
                  <Badge className={`${meta.badgeBg} border-0 rounded-full text-[10px] font-bold`}>
                    {section.topics.length} topics
                  </Badge>
                </div>

                {section.topics.map((topicName, idx) => {
                  const level = startIndex + idx + 1;
                  const stepsCompleted = getTopicStepCount(lang, level);
                  const isFullyDone = stepsCompleted === 3;
                  const theoryDone = isStepCompleted(lang, level, 'theory');
                  const quizDone = isStepCompleted(lang, level, 'quiz');
                  const challengeDone = isStepCompleted(lang, level, 'challenge');

                  return (
                    <Card
                      key={level}
                      className="cute-card border-0 hover:shadow-cute-hover transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopicList;
