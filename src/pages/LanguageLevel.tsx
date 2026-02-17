
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProgress } from '@/contexts/ProgressContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, BookOpen, Award, Code, CheckCircle2, Play, Trash2, Terminal, Send, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLevelContent, fetchLevelContent, hasHandCraftedContent, LevelContent } from '@/utils/levelContent';
import MonacoCodeEditor from '@/components/MonacoCodeEditor';
import { Textarea } from '@/components/ui/textarea';

const LanguageLevel = () => {
  const { language, level } = useParams<{ language: string; level: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { completeLevel, isLevelUnlocked, getHighestCompletedLevel } = useProgress();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentSection, setCurrentSection] = useState<'theory' | 'quiz' | 'challenge'>('theory');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [quizResults, setQuizResults] = useState<(boolean | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [allQuizPassed, setAllQuizPassed] = useState(false);
  const MAX_LEVELS = 30;

  // Code editor state
  const [userCode, setUserCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [submitResult, setSubmitResult] = useState<'pass' | 'fail' | null>(null);
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const currentLevel = parseInt(level || '1');
  const [levelContent, setLevelContent] = useState<LevelContent>(() => generateLevelContent(language || '', currentLevel));

  // Fetch AI-generated content for levels without hand-crafted content
  useEffect(() => {
    const lang = language || '';
    const syncContent = generateLevelContent(lang, currentLevel);
    setLevelContent(syncContent);

    if (!hasHandCraftedContent(lang, currentLevel)) {
      setIsLoadingContent(true);
      fetchLevelContent(lang, currentLevel).then((aiContent) => {
        if (aiContent) {
          setLevelContent(aiContent);
        }
        setIsLoadingContent(false);
      });
    } else {
      setIsLoadingContent(false);
    }
  }, [language, currentLevel]);

  useEffect(() => {
    const highest = getHighestCompletedLevel(language || '');
    const completed = currentLevel <= highest;
    setIsAlreadyCompleted(completed);
    setCurrentSection(completed ? 'challenge' : 'theory');
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setQuizResults([]);
    setShowResult(false);
    setAllQuizPassed(completed);
    setUserCode('');
    setCustomInput('');
    setCodeOutput('');
    setSubmitResult(completed ? 'pass' : null);
  }, [language, level, getHighestCompletedLevel, currentLevel]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isLevelUnlocked(language || '', currentLevel)) {
      toast({ title: "Level Locked 🔒", description: "Complete the previous level to unlock this one.", variant: "destructive" });
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, language, currentLevel, isLevelUnlocked, navigate, toast]);

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
      const allCorrect = quizResults.every((r) => r === true);
      if (allCorrect) {
        setAllQuizPassed(true);
        toast({ title: "🎉 Quiz Complete!", description: "Moving to the coding challenge..." });
        setTimeout(() => setCurrentSection('challenge'), 1500);
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
    if (currentLevel < MAX_LEVELS) {
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

  // Simulate code execution based on user code and input
  const simulateExecution = useCallback((code: string, input: string): string => {
    if (!code.trim()) return '';
    const lang = (language || '').toLowerCase();
    const lines: string[] = [];

    // Extract print/printf/console.log statements and simulate output
    const printPatterns = [
      /printf\s*\(\s*"([^"]*)"/g,              // C printf
      /print\s*\(\s*(?:f?")?([^")]*)"?\s*\)/g,  // Python print
      /console\.log\s*\(\s*(?:['"`])([^'"`]*)['"`]\s*\)/g, // JS console.log
      /System\.out\.println\s*\(\s*"([^"]*)"/g,  // Java
    ];

    for (const pattern of printPatterns) {
      let match;
      while ((match = pattern.exec(code)) !== null) {
        let output = match[1]
          .replace(/\\n/g, '\n')
          .replace(/\\t/g, '\t')
          .replace(/%d|%i|%f|%lf|%c|%s|%lu|%ld/g, () => {
            return input.trim() || '0';
          });
        lines.push(output);
      }
    }

    if (lines.length > 0) {
      return lines.join('\n');
    }

    // Fallback: acknowledge the code ran
    return `> Program compiled and executed successfully.\n> Input: ${input || '(none)'}\n> [Output depends on your code logic]`;
  }, [language]);

  const handleRunCode = useCallback(() => {
    if (!userCode.trim()) {
      toast({ title: "Empty Editor", description: "Write some code before running.", variant: "destructive" });
      return;
    }
    setIsRunning(true);
    setCodeOutput('');
    setSubmitResult(null);

    setTimeout(() => {
      const output = simulateExecution(userCode, customInput);
      setCodeOutput(`> Running ${(language || '').toUpperCase()} code...\n> Compilation successful ✓\n\n${output}`);
      setIsRunning(false);
    }, 800);
  }, [userCode, customInput, language, simulateExecution, toast]);

  const handleSubmitCode = useCallback(async () => {
    if (!userCode.trim()) {
      toast({ title: "Empty Editor", description: "Write some code before submitting.", variant: "destructive" });
      return;
    }
    setIsRunning(true);
    setCodeOutput('');
    setSubmitResult(null);

    const challenge = levelContent.codingChallenge;
    if (!challenge) return;

    setTimeout(async () => {
      const results: string[] = [];
      let allPassed = true;

      for (let i = 0; i < challenge.testCases.length; i++) {
        const tc = challenge.testCases[i];
        const output = simulateExecution(userCode, tc.input === 'None' ? '' : tc.input);
        const cleanOutput = output.trim().toLowerCase();
        const expectedClean = tc.output.trim().toLowerCase();
        const passed = cleanOutput.includes(expectedClean);

        if (!passed) allPassed = false;
        results.push(`Test ${i + 1}: ${passed ? '✅ PASSED' : '❌ FAILED'}\n  Input: ${tc.input}\n  Expected: ${tc.output}\n  Got: ${output || '(no output)'}`);
      }

      const resultText = results.join('\n\n');

      if (allPassed) {
        setSubmitResult('pass');
        await completeLevel(language || '', currentLevel);
        setCodeOutput(`🎯 Submission Results\n${'─'.repeat(30)}\n\n${resultText}\n\n✅ All tests passed! Level ${currentLevel} complete!`);
        toast({ title: "🎉 Level Complete!", description: `All test cases passed!` });
      } else {
        setSubmitResult('fail');
        setCodeOutput(`🎯 Submission Results\n${'─'.repeat(30)}\n\n${resultText}\n\n❌ Some tests failed. Review your code and try again.`);
        toast({ title: "Tests Failed", description: "Some test cases didn't pass.", variant: "destructive" });
      }
      setIsRunning(false);
    }, 1000);
  }, [userCode, levelContent, language, currentLevel, simulateExecution, completeLevel, toast]);

  const handleClearCode = useCallback(() => {
    setUserCode('');
    setCustomInput('');
    setCodeOutput('');
    setSubmitResult(null);
  }, []);

  if (authLoading) return null;

  return (
    <div className="min-h-screen cute-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <Button variant="outline" onClick={goBack} className="cute-btn rounded-full border-primary/30 text-primary hover:bg-primary/10">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-foreground capitalize">
              {language} – Level {currentLevel}
            </h1>
            <p className="text-muted-foreground text-sm">{levelContent.title}</p>
            <Badge className="mt-1 bg-cute-lavender/20 text-primary border-0 rounded-full">
              {levelContent.difficulty}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {isAlreadyCompleted && (
              <Badge className="bg-cute-success/20 text-cute-success border-0 rounded-full font-bold text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
            <Badge className="bg-cute-pink/20 text-secondary-foreground border-0 rounded-full font-bold">
              {currentLevel}/{MAX_LEVELS}
            </Badge>
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="cute-btn rounded-full border-primary/30 text-primary hover:bg-primary/10 h-9 px-3">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mb-8 bg-card rounded-2xl p-1.5 gap-1 shadow-cute animate-fade-in">
          {(['theory', 'quiz', 'challenge'] as const).map((tab) => (
            <Button
              key={tab}
              variant={currentSection === tab ? 'default' : 'ghost'}
              onClick={() => setCurrentSection(tab)}
              className={`flex-1 capitalize rounded-xl font-semibold ${
                currentSection === tab
                  ? 'bg-primary text-primary-foreground shadow-cute'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab === 'theory' && <BookOpen className="h-4 w-4 mr-2" />}
              {tab === 'quiz' && <Award className="h-4 w-4 mr-2" />}
              {tab === 'challenge' && <Code className="h-4 w-4 mr-2" />}
              {tab === 'theory' ? 'Theory' : tab === 'quiz' ? `Quiz (${levelContent.quiz.length}Q)` : 'Challenge'}
            </Button>
          ))}
        </div>

        {/* THEORY SECTION */}
        {currentSection === 'theory' && (
          <Card className="cute-card border-0 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-foreground font-extrabold">📘 Theory: {levelContent.topic}</CardTitle>
              <CardDescription className="text-muted-foreground">Learn the concept before taking the quiz</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {isLoadingContent && (
                <div className="flex items-center gap-2 text-primary animate-pulse mb-4">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Generating topic-specific content...</span>
                </div>
              )}
              <p className="text-foreground/80 text-lg leading-relaxed">{levelContent.theory.content}</p>

              {levelContent.theory.syntax && (
                <div className="bg-foreground/5 rounded-2xl p-5">
                  <h4 className="text-primary font-bold mb-2">🧩 Syntax</h4>
                  <pre className="text-foreground/70 text-sm overflow-x-auto whitespace-pre-wrap"><code>{levelContent.theory.syntax}</code></pre>
                </div>
              )}

              {levelContent.theory.codeExample && (
                <div className="bg-foreground/5 rounded-2xl p-5">
                  <h4 className="text-accent-foreground font-bold mb-2">💡 Example Code</h4>
                  <pre className="text-foreground/70 text-sm overflow-x-auto whitespace-pre-wrap"><code>{levelContent.theory.codeExample}</code></pre>
                </div>
              )}

              <Button onClick={() => setCurrentSection('quiz')} className="mt-4 cute-btn rounded-full bg-cute-success text-foreground font-bold hover:opacity-90 shadow-cute">
                Take the Quiz <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* QUIZ SECTION */}
        {currentSection === 'quiz' && (
          <Card className="cute-card border-0 animate-fade-in">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-foreground font-extrabold">📝 Quiz</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Question {currentQuizIndex + 1} of {levelContent.quiz.length}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {levelContent.quiz.map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        quizResults[i] === true
                          ? 'bg-cute-success text-foreground'
                          : quizResults[i] === false
                          ? 'bg-destructive/20 text-destructive'
                          : i === currentQuizIndex
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
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
                  <div className="text-foreground text-lg font-semibold">{currentQuiz.question}</div>

                  <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
                    {currentQuiz.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-4 rounded-2xl border-2 transition-all ${
                          showResult && option === currentQuiz.correctAnswer
                            ? 'border-cute-success bg-cute-success/10'
                            : showResult && option === selectedAnswer && option !== currentQuiz.correctAnswer
                            ? 'border-destructive bg-destructive/10'
                            : selectedAnswer === option
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30 hover:bg-muted/30'
                        }`}
                      >
                        <RadioGroupItem value={option} id={`opt-${index}`} className="border-primary text-primary" disabled={showResult} />
                        <Label htmlFor={`opt-${index}`} className="text-foreground cursor-pointer flex-1">{option}</Label>
                        {showResult && option === currentQuiz.correctAnswer && <CheckCircle2 className="h-5 w-5 text-cute-success" />}
                      </div>
                    ))}
                  </RadioGroup>

                  {showResult && (
                    <div className={`p-4 rounded-2xl ${selectedAnswer === currentQuiz.correctAnswer ? 'bg-cute-success/15 border-2 border-cute-success/30' : 'bg-destructive/10 border-2 border-destructive/20'}`}>
                      <p className="text-foreground font-semibold">
                        {selectedAnswer === currentQuiz.correctAnswer ? '✅ Correct!' : '❌ Incorrect.'}
                      </p>
                      {selectedAnswer !== currentQuiz.correctAnswer && (
                        <p className="text-muted-foreground mt-1 text-sm">Correct answer: {currentQuiz.correctAnswer}</p>
                      )}
                    </div>
                  )}

                  <div className="flex gap-4">
                    {!showResult ? (
                      <Button onClick={handleQuizSubmit} className="cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute" disabled={!selectedAnswer}>
                        Submit Answer
                      </Button>
                    ) : selectedAnswer === currentQuiz.correctAnswer ? (
                      <Button onClick={handleNextQuestion} className="cute-btn rounded-full bg-cute-success text-foreground font-bold hover:opacity-90 shadow-cute">
                        {currentQuizIndex < levelContent.quiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button onClick={() => { setShowResult(false); setSelectedAnswer(''); }} className="cute-btn rounded-full bg-cute-peach text-foreground font-bold hover:opacity-90">
                        Try Again
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="text-6xl animate-float">🎉</div>
                  <h3 className="text-2xl font-extrabold text-foreground">Quiz Complete!</h3>
                  <p className="text-muted-foreground">Switching to coding challenge... ✨</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* CODING CHALLENGE SECTION */}
        {currentSection === 'challenge' && levelContent.codingChallenge && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Left: Problem & Info */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="cute-card border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-foreground font-extrabold text-lg">📋 Problem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground/80 text-sm leading-relaxed">{levelContent.codingChallenge.problem}</p>
                  </CardContent>
                </Card>

                {levelContent.codingChallenge.tasks.length > 0 && (
                  <Card className="cute-card border-0">
                    <CardContent className="pt-5">
                      <h5 className="text-accent-foreground font-bold mb-3 text-sm">✅ Tasks</h5>
                      <ul className="space-y-1.5">
                        {levelContent.codingChallenge.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/70 text-xs">
                            <span className="text-accent-foreground font-bold mt-0.5">{i + 1}.</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {levelContent.codingChallenge.testCases.length > 0 && (
                  <Card className="cute-card border-0">
                    <CardContent className="pt-5">
                      <h5 className="text-accent-foreground font-bold mb-3 text-sm">🧪 Test Cases</h5>
                      <div className="space-y-2">
                        {levelContent.codingChallenge.testCases.map((tc, i) => (
                          <div key={i} className="bg-muted/50 rounded-xl p-3">
                            <p className="text-muted-foreground text-[10px] mb-1.5 font-bold uppercase">Test {i + 1}</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-muted-foreground text-[10px] uppercase font-semibold">Input</p>
                                <pre className="text-foreground/70 text-xs whitespace-pre-wrap">{tc.input}</pre>
                              </div>
                              <div>
                                <p className="text-muted-foreground text-[10px] uppercase font-semibold">Output</p>
                                <pre className="text-cute-success text-xs whitespace-pre-wrap font-semibold">{tc.output}</pre>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {levelContent.codingChallenge.hints.length > 0 && (
                  <Card className="cute-card border-0 bg-cute-yellow/10">
                    <CardContent className="pt-5">
                      <h5 className="text-secondary-foreground font-bold mb-3 text-sm">💡 Hints</h5>
                      <ul className="space-y-1.5">
                        {levelContent.codingChallenge.hints.map((hint, i) => (
                          <li key={i} className="text-foreground/60 text-xs flex items-start gap-2">
                            <span className="text-secondary-foreground">→</span>
                            <span>{hint}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {levelContent.codingChallenge.constraints && levelContent.codingChallenge.constraints.length > 0 && (
                  <Card className="cute-card border-0 bg-cute-peach/10">
                    <CardContent className="pt-5">
                      <h5 className="text-secondary-foreground font-bold mb-3 text-sm">⚠️ Constraints</h5>
                      <ul className="space-y-1">
                        {levelContent.codingChallenge.constraints.map((c, i) => (
                          <li key={i} className="text-foreground/70 text-xs flex items-start gap-2">
                            <span className="text-secondary-foreground">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Right: Code Editor + Input + Output */}
              <div className="lg:col-span-3 space-y-4">
                {/* Monaco Editor */}
                <Card className="cute-card border-0 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3 bg-foreground/[0.03] border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-destructive/40" />
                        <div className="w-3 h-3 rounded-full bg-cute-yellow" />
                        <div className="w-3 h-3 rounded-full bg-cute-success" />
                      </div>
                      <span className="text-muted-foreground text-xs font-semibold ml-2">
                        {(language || '').toLowerCase()}_solution.{language === 'python' ? 'py' : language === 'javascript' ? 'js' : language === 'java' ? 'java' : language === 'html' ? 'html' : language === 'css' ? 'css' : 'c'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleClearCode}
                        className="h-7 px-2 text-muted-foreground hover:text-destructive text-xs"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <MonacoCodeEditor
                    language={language || 'c'}
                    value={userCode}
                    onChange={setUserCode}
                    placeholder={`// Write your ${(language || '').toUpperCase()} code here...`}
                  />
                </Card>

                {/* Custom Input Area */}
                <Card className="cute-card border-0 overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-2 bg-foreground/[0.03] border-b border-border/50">
                    <Send className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs font-bold">Custom Input</span>
                  </div>
                  <Textarea
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Enter custom input here (stdin)..."
                    className="border-0 rounded-none bg-card font-mono text-sm min-h-[60px] resize-y focus-visible:ring-0 focus-visible:ring-offset-0"
                    rows={2}
                  />
                </Card>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleRunCode}
                    disabled={isRunning || !userCode.trim()}
                    className="cute-btn rounded-full bg-cute-success text-foreground font-bold hover:opacity-90 shadow-cute text-xs h-9 px-5"
                  >
                    <Play className="h-3.5 w-3.5 mr-1.5" />
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                  <Button
                    onClick={handleSubmitCode}
                    disabled={isRunning || !userCode.trim()}
                    className="cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-cute text-xs h-9 px-5"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                    Submit Solution
                  </Button>
                  <Button
                    onClick={handleNextLevel}
                    variant="outline"
                    className="cute-btn rounded-full border-primary/30 text-primary hover:bg-primary/10 text-xs h-9 px-5 ml-auto"
                  >
                    {currentLevel < MAX_LEVELS ? 'Next Level' : 'Dashboard'}
                    <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                  </Button>
                </div>

                {/* Output Console */}
                <Card className={`cute-card border-0 overflow-hidden ${submitResult === 'pass' ? 'ring-2 ring-cute-success/40' : submitResult === 'fail' ? 'ring-2 ring-destructive/30' : ''}`}>
                  <div className="flex items-center gap-2 px-5 py-3 bg-foreground/[0.03] border-b border-border/50">
                    <Terminal className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground text-xs font-bold">Output Console</span>
                    {submitResult === 'pass' && <Badge className="ml-auto bg-cute-success/20 text-cute-success border-0 text-[10px]">ALL PASSED</Badge>}
                    {submitResult === 'fail' && <Badge className="ml-auto bg-destructive/20 text-destructive border-0 text-[10px]">FAILED</Badge>}
                  </div>
                  <div className="p-5 min-h-[120px] bg-card">
                    {codeOutput ? (
                      <pre className="text-foreground/70 text-sm font-mono whitespace-pre-wrap leading-relaxed">{codeOutput}</pre>
                    ) : (
                      <p className="text-muted-foreground/50 text-sm italic">
                        Output will appear here after running your code...
                      </p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}

        {currentSection === 'challenge' && !levelContent.codingChallenge && (
          <Card className="cute-card border-0 animate-fade-in">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No coding challenge available for this level yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LanguageLevel;
