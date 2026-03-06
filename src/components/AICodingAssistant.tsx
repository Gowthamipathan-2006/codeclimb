
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MessageCircle, X, Sparkles, Loader2 } from 'lucide-react';

interface AICodingAssistantProps {
  language: string;
  code: string;
  problem: string;
}

const AICodingAssistant = ({ language, code, problem }: AICodingAssistantProps) => {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const getHelp = useCallback(async () => {
    if (!code.trim()) {
      setResponse("Write some code first, and I'll help you debug it! 😊");
      return;
    }
    setLoading(true);
    setResponse('');

    try {
      const { data, error } = await supabase.functions.invoke('ai-coding-assistant', {
        body: { language, code, problem },
      });

      if (error) throw error;
      setResponse(data?.response || "I couldn't analyze your code right now. Try again!");
    } catch (err) {
      console.error('AI assistant error:', err);
      setResponse("Oops! I'm having trouble connecting. Please try again in a moment. 🔧");
    } finally {
      setLoading(false);
    }
  }, [language, code, problem]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full transition-all duration-200 hover:-translate-y-0.5 group"
      >
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-lg group-hover:animate-float">
          🧑‍💻
        </div>
        <span className="text-primary font-semibold text-sm">Ask AI Assistant</span>
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </button>
    );
  }

  return (
    <Card className="cute-card border-0 bg-primary/5 animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl animate-float">
              🧑‍💻
            </div>
            <div>
              <p className="text-foreground font-bold text-sm">AI Coding Assistant</p>
              <p className="text-muted-foreground text-xs">I'll help with hints, not full solutions!</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-7 w-7 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-2 mb-3 flex-wrap">
          <Button
            size="sm"
            onClick={getHelp}
            disabled={loading}
            className="cute-btn rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-4"
          >
            {loading ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <MessageCircle className="h-3 w-3 mr-1" />}
            {loading ? 'Analyzing...' : 'Analyze My Code'}
          </Button>
        </div>

        {response && (
          <div className="bg-card rounded-xl p-3 text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap border border-border/50">
            {response}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AICodingAssistant;
