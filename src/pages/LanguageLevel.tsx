
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, BookOpen, Award, Code, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLevelContent } from '@/utils/levelContent';

const LanguageLevel = () => {
  const { language, level } = useParams<{ language: string; level: string }>();
  const { isAuthenticated } = useAuth();
  const { completeLevel, isLevelUnlocked } = useProgress();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSection, setCurrentSection] = useState<'theory' | 'quiz' | 'challenge'>('theory');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizResults, setQuizResults] = useState<(boolean | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [allQuizPassed, setAllQuizPassed] = useState(false);

  const currentLevel = parseInt(level || '1');
  const levelContent = generateLevelContent(language || '', currentLevel);

  // Reset state when level or language changes
  useEffect(() => {
    setCurrentSection('theory');
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setQuizResults([]);
    setShowResult(false);
    setAllQuizPassed(false);
  }, [language, level]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isLevelUnlocked(language || '', currentLevel)) {
      toast({ title: "Level Locked", description: "Complete the previous level to unlock this one.", variant: "destructive" });
      navigate('/dashboard');
    }
  }, [isAuthenticated, language, currentLevel, isLevelUnlocked, navigate, toast]);

  const currentQuiz = levelContent.quiz[currentQuizIndex];

  const handleQuizSubmit = () => {
    if (!selectedAnswer) {
      toast({ title: "Please select an answer", description: "Choose an option before submitting.", variant: "destructive" });
      return;
    }

    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    const newResults = [...quizResults];
    newResults[currentQuizIndex] = isCorrect;
    setQuizResults(newResults);
    setShowResult(true);

    if (!isCorrect) {
      toast({ title: "Incorrect Answer", description: "Try again! Review the theory if needed.", variant: "destructive" });
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < levelContent.quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // All questions answered — check if all correct
      const allCorrect = quizResults.every((r) => r === true);
      if (allCorrect) {
        setAllQuizPassed(true);
        completeLevel(language || '', currentLevel);
        toast({ title: "🎉 All Questions Correct!", description: "Level completed! You can proceed." });
      } else {
        toast({ title: "Some answers were wrong", description: "Review and retry the incorrect ones.", variant: "destructive" });
      }
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setQuizResults([]);
    setShowResult(false);
    setAllQuizPassed(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={goBack} className="border-white/20 text-white hover:bg-white/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white capitalize">
              {language} – Level {currentLevel}
            </h1>
            <p className="text-gray-300">{levelContent.title}</p>
            <Badge variant="secondary" className="mt-1 bg-white/10 text-gray-300">
              {levelContent.difficulty}
            </Badge>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {currentLevel}/100
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mb-8 bg-white/10 backdrop-blur-lg rounded-lg p-2 gap-1">
          {(['theory', 'quiz', 'challenge'] as const).map((tab) => (
            <Button
              key={tab}
              variant={currentSection === tab ? 'default' : 'ghost'}
              onClick={() => setCurrentSection(tab)}
              className={`flex-1 capitalize ${currentSection === tab ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'}`}
            >
              {tab === 'theory' && <BookOpen className="h-4 w-4 mr-2" />}
              {tab === 'quiz' && <Award className="h-4 w-4 mr-2" />}
              {tab === 'challenge' && <Code className="h-4 w-4 mr-2" />}
              {tab === 'theory' ? 'Theory' : tab === 'quiz' ? `Quiz (${levelContent.quiz.length}Q)` : 'Challenge'}
            </Button>
          ))}
        </div>

        {/* ── THEORY SECTION ── */}
        {currentSection === 'theory' && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">📘 Theory: {levelContent.topic}</CardTitle>
              <CardDescription className="text-gray-300">Learn the concept before taking the quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-200 text-lg leading-relaxed">{levelContent.theory.content}</p>

              {levelContent.theory.syntax && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-semibold mb-2">🧩 Syntax</h4>
                  <pre className="text-yellow-200 text-sm overflow-x-auto whitespace-pre-wrap"><code>{levelContent.theory.syntax}</code></pre>
                </div>
              )}

              {levelContent.theory.codeExample && (
                <div className="bg-gray-900 rounded-lg p-4">
                  <h4 className="text-blue-400 font-semibold mb-2">💡 Example Code</h4>
                  <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap"><code>{levelContent.theory.codeExample}</code></pre>
                </div>
              )}

              <Button onClick={() => setCurrentSection('quiz')} className="mt-4 bg-green-600 hover:bg-green-700 text-white">
                Take the Quiz <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ── QUIZ SECTION ── */}
        {currentSection === 'quiz' && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">📝 Quiz</CardTitle>
                  <CardDescription className="text-gray-300">
                    Question {currentQuizIndex + 1} of {levelContent.quiz.length}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {levelContent.quiz.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        quizResults[i] === true
                          ? 'bg-green-500 text-white'
                          : quizResults[i] === false
                          ? 'bg-red-500 text-white'
                          : i === currentQuizIndex
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/20 text-gray-400'
                      }`}
                    >
                      {quizResults[i] === true ? '✓' : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!allQuizPassed ? (
                <>
                  <div className="text-white text-lg font-medium">{currentQuiz.question}</div>

                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                    {currentQuiz.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                          showResult && option === currentQuiz.correctAnswer
                            ? 'border-green-500 bg-green-600/20'
                            : showResult && option === selectedAnswer && option !== currentQuiz.correctAnswer
                            ? 'border-red-500 bg-red-600/20'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <RadioGroupItem value={option} id={`opt-${index}`} className="border-white/20 text-blue-400" disabled={showResult} />
                        <Label htmlFor={`opt-${index}`} className="text-gray-200 cursor-pointer flex-1">{option}</Label>
                        {showResult && option === currentQuiz.correctAnswer && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                      </div>
                    ))}
                  </RadioGroup>

                  {showResult && (
                    <div className={`p-4 rounded-lg ${selectedAnswer === currentQuiz.correctAnswer ? 'bg-green-600/20 border border-green-500' : 'bg-red-600/20 border border-red-500'}`}>
                      <p className="text-white">
                        {selectedAnswer === currentQuiz.correctAnswer ? '✅ Correct!' : '❌ Incorrect.'}
                      </p>
                      {selectedAnswer !== currentQuiz.correctAnswer && (
                        <p className="text-gray-300 mt-1">Correct answer: {currentQuiz.correctAnswer}</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    {!showResult ? (
                      <Button onClick={handleQuizSubmit} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={!selectedAnswer}>
                        Submit Answer
                      </Button>
                    ) : selectedAnswer === currentQuiz.correctAnswer ? (
                      <Button onClick={handleNextQuestion} className="bg-green-600 hover:bg-green-700 text-white">
                        {currentQuizIndex < levelContent.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={() => { setShowResult(false); setSelectedAnswer(''); }} className="bg-orange-600 hover:bg-orange-700 text-white">
                        Try Again
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-2xl font-bold text-white">Level {currentLevel} Complete!</h3>
                  <p className="text-gray-300">You answered all {levelContent.quiz.length} questions correctly.</p>
                  <div className="flex gap-4 justify-center mt-6">
                    <Button onClick={() => setCurrentSection('challenge')} variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Code className="h-4 w-4 mr-2" /> View Challenge
                    </Button>
                    <Button onClick={handleNextLevel} className="bg-green-600 hover:bg-green-700 text-white">
                      {currentLevel < 100 ? 'Next Level' : 'Back to Dashboard'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ── CODING CHALLENGE SECTION ── */}
        {currentSection === 'challenge' && levelContent.codingChallenge && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">💻 Coding Challenge</CardTitle>
              <CardDescription className="text-gray-300">Apply what you learned — write the code yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Problem Statement */}
              <div className="bg-gray-900/80 rounded-lg p-5 border border-white/10">
                <h4 className="text-white font-semibold text-lg mb-3">📋 Problem</h4>
                <p className="text-gray-200">{levelContent.codingChallenge.problem}</p>
              </div>

              {/* Task Requirements */}
              {levelContent.codingChallenge.tasks.length > 0 && (
                <div className="bg-gray-900/80 rounded-lg p-4 border border-white/10">
                  <h5 className="text-blue-400 font-semibold mb-3">✅ Tasks</h5>
                  <ul className="space-y-2">
                    {levelContent.codingChallenge.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-blue-400 font-bold mt-0.5">{i + 1}.</span>
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Constraints */}
              {levelContent.codingChallenge.constraints && levelContent.codingChallenge.constraints.length > 0 && (
                <div className="bg-gray-900/80 rounded-lg p-4 border border-white/10">
                  <h5 className="text-orange-400 font-semibold mb-3">⚠️ Constraints</h5>
                  <ul className="space-y-1">
                    {levelContent.codingChallenge.constraints.map((c, i) => (
                      <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-orange-400">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Public Test Cases */}
              {levelContent.codingChallenge.testCases.length > 0 && (
                <div className="bg-gray-900/80 rounded-lg p-4 border border-white/10">
                  <h5 className="text-green-400 font-semibold mb-3">🧪 Test Cases</h5>
                  <div className="space-y-3">
                    {levelContent.codingChallenge.testCases.map((tc, i) => (
                      <div key={i} className="bg-black/30 rounded-md p-3 border border-white/5">
                        <p className="text-gray-400 text-xs mb-1">Test Case {i + 1}</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Input</p>
                            <pre className="text-gray-200 text-sm whitespace-pre-wrap">{tc.input}</pre>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Expected Output</p>
                            <pre className="text-green-300 text-sm whitespace-pre-wrap">{tc.output}</pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hints */}
              {levelContent.codingChallenge.hints.length > 0 && (
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/20">
                  <h5 className="text-yellow-400 font-semibold mb-3">💡 Hints</h5>
                  <ul className="space-y-2">
                    {levelContent.codingChallenge.hints.map((hint, i) => (
                      <li key={i} className="text-yellow-200/80 text-sm flex items-start gap-2">
                        <span className="text-yellow-400">→</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentSection === 'challenge' && !levelContent.codingChallenge && (
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="py-12 text-center">
              <p className="text-gray-300">No coding challenge available for this level yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LanguageLevel;
