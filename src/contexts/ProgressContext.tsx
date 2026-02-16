
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProgressContextType {
  completeLevel: (language: string, level: number) => Promise<void>;
  isLevelUnlocked: (language: string, level: number) => boolean;
  getCompletedLevels: (language: string) => number;
  getHighestCompletedLevel: (language: string) => number;
  loading: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

interface ProgressProviderProps {
  children: ReactNode;
}

export const ProgressProvider: React.FC<ProgressProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [progressMap, setProgressMap] = useState<{ [language: string]: Set<number> }>({});
  const [loading, setLoading] = useState(false);

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setProgressMap({});
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('user_progress')
      .select('language, completed_level')
      .eq('user_id', user.id);

    const map: { [language: string]: Set<number> } = {};
    (data ?? []).forEach(row => {
      if (!map[row.language]) map[row.language] = new Set();
      map[row.language].add(row.completed_level);
    });
    setProgressMap(map);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const completeLevel = async (language: string, level: number) => {
    if (!user) return;
    const highest = getHighestCompletedLevel(language);
    // Only allow completing the next sequential level
    if (level > highest + 1) return;

    const { error } = await supabase
      .from('user_progress')
      .upsert(
        { user_id: user.id, language, completed_level: level },
        { onConflict: 'user_id,language,completed_level' }
      );

    if (!error) {
      setProgressMap(prev => {
        const next = { ...prev };
        if (!next[language]) next[language] = new Set();
        next[language] = new Set(next[language]);
        next[language].add(level);
        return next;
      });
    }
  };

  const isLevelUnlocked = (language: string, level: number) => {
    if (level === 1) return true;
    return (progressMap[language]?.has(level - 1)) ?? false;
  };

  const getCompletedLevels = (language: string) => {
    return progressMap[language]?.size ?? 0;
  };

  const getHighestCompletedLevel = (language: string) => {
    const set = progressMap[language];
    if (!set || set.size === 0) return 0;
    return Math.max(...set);
  };

  return (
    <ProgressContext.Provider value={{
      completeLevel,
      isLevelUnlocked,
      getCompletedLevels,
      getHighestCompletedLevel,
      loading
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
