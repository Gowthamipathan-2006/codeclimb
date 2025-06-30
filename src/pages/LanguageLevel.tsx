
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, BookOpen, Award, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLevelContent } from '@/utils/levelContent';

const LanguageLevel = () => {
  const { language, level } = useParams<{ language: string; level: string }>();
  const { isAuthenticated } = useAuth();
  const { completeLevel, isLevelUnlocked } = useProgress();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentSection, setCurrentSection] = useState<'theory' | 'exam'>('theory');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [examCompleted, setExamCompleted] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const currentLevel = parseInt(level || '1');
  const levelContent = generateLevelContent(language || '', currentLevel);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isLevelUnlocked(language || '', currentLevel)) {
      toast({
        title: "Level Locked",
        description: "Complete the previous level to unlock this one.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [isAuthenticated, language, currentLevel, isLevelUnlocked, navigate, toast]);

  const handleExamSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "Choose an option before submitting.",
        variant: "destructive"
      });
      return;
    }

    const isCorrect = selectedAnswer === levelContent.exam.correctAnswer;
    setShowResult(true);
    
    if (isCorrect) {
      setExamCompleted(true);
      completeLevel(language || '', currentLevel);
      toast({
        title: "Congratulations!",
        description: "Level completed successfully!",
      });
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Try again! Review the theory section if needed.",
        variant: "destructive"
      });
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < 100) {
      navigate(`/language/${language}/${currentLevel + 1}`);
    } else {
      navigate('/dashboard');
    }
  };

  const goBack = () => {
    if (currentLevel > 1) {
      navigate(`/language/${language}/${currentLevel - 1}`);
    } else {
      navigate('/dashboard');
    }
  };

  if (!levelContent) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={goBack}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white capitalize">
              {language} - Level {currentLevel}
            </h1>
            <p className="text-gray-300">{levelContent.title}</p>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {currentLevel}/100
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mb-8 bg-white/10 backdrop-blur-lg rounded-lg p-2">
          <Button
            variant={currentSection === 'theory' ? 'default' : 'ghost'}
            onClick={() => setCurrentSection('theory')}
            className={`flex-1 ${currentSection === 'theory' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Theory
          </Button>
          <Button
            variant={currentSection === 'exam' ? 'default' : 'ghost'}
            onClick={() => setCurrentSection('exam')}
            className={`flex-1 ${currentSection === 'exam' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
          >
            <Award className="h-4 w-4 mr-2" />
            Exam
          </Button>
        </div>

        {/* Content */}
        {currentSection === 'theory' ? (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Theory</CardTitle>
              <CardDescription className="text-gray-300">
                Learn the concepts before taking the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-200 text-lg leading-relaxed">
                  {levelContent.theory.content}
                </p>
                {levelContent.theory.codeExample && (
                  <div className="bg-gray-900 rounded-lg p-4 mt-4">
                    <h4 className="text-blue-400 mb-2">Example:</h4>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{levelContent.theory.codeExample}</code>
                    </pre>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setCurrentSection('exam')}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white"
              >
                Take the Exam
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Exam</CardTitle>
              <CardDescription className="text-gray-300">
                Test your understanding of the concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-white text-lg">
                {levelContent.exam.question}
              </div>
              
              <RadioGroup
                value={selectedAnswer}
                onValueChange={setSelectedAnswer}
                className="space-y-3"
              >
                {levelContent.exam.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${index}`}
                      className="border-white/20 text-blue-400"
                    />
                    <Label 
                      htmlFor={`option-${index}`} 
                      className="text-gray-200 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {showResult && (
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === levelContent.exam.correctAnswer 
                    ? 'bg-green-600/20 border border-green-500' 
                    : 'bg-red-600/20 border border-red-500'
                }`}>
                  <p className="text-white">
                    {selectedAnswer === levelContent.exam.correctAnswer 
                      ? '✅ Correct! Well done!' 
                      : '❌ Incorrect. Try again!'}
                  </p>
                  {selectedAnswer !== levelContent.exam.correctAnswer && (
                    <p className="text-gray-300 mt-2">
                      The correct answer is: {levelContent.exam.correctAnswer}
                    </p>
                  )}
                </div>
              )}

              <div className="flex space-x-4">
                {!showResult ? (
                  <Button
                    onClick={handleExamSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!selectedAnswer}
                  >
                    Submit Answer
                  </Button>
                ) : examCompleted ? (
                  <Button
                    onClick={handleNextLevel}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {currentLevel < 100 ? 'Next Level' : 'Back to Dashboard'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      setShowResult(false);
                      setSelectedAnswer('');
                    }}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Try Again
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LanguageLevel;
