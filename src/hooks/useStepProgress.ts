
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type StepType = 'theory' | 'quiz' | 'challenge';

interface StepProgressMap {
  [key: string]: Set<StepType>; // key = `${language}_${level}`
}

export const useStepProgress = () => {
  const { user } = useAuth();
  const [stepMap, setStepMap] = useState<StepProgressMap>({});
  const [loading, setLoading] = useState(false);

  const fetchStepProgress = useCallback(async (language?: string) => {
    if (!user) {
      setStepMap({});
      return;
    }
    setLoading(true);
    let query = supabase
      .from('topic_step_progress')
      .select('language, level, step')
      .eq('user_id', user.id);

    if (language) {
      query = query.eq('language', language);
    }

    const { data } = await query;
    const map: StepProgressMap = {};
    (data ?? []).forEach((row: any) => {
      const key = `${row.language}_${row.level}`;
      if (!map[key]) map[key] = new Set();
      map[key].add(row.step as StepType);
    });
    setStepMap(prev => ({ ...prev, ...map }));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchStepProgress();
  }, [fetchStepProgress]);

  const completeStep = useCallback(async (language: string, level: number, step: StepType) => {
    if (!user) return;
    const key = `${language}_${level}`;
    if (stepMap[key]?.has(step)) return; // Already completed

    const { error } = await supabase
      .from('topic_step_progress')
      .upsert(
        { user_id: user.id, language, level, step },
        { onConflict: 'user_id,language,level,step' }
      );

    if (!error) {
      setStepMap(prev => {
        const next = { ...prev };
        if (!next[key]) next[key] = new Set();
        next[key] = new Set(next[key]);
        next[key].add(step);
        return next;
      });
    }
  }, [user, stepMap]);

  const isStepCompleted = useCallback((language: string, level: number, step: StepType): boolean => {
    const key = `${language}_${level}`;
    return stepMap[key]?.has(step) ?? false;
  }, [stepMap]);

  const isStepUnlocked = useCallback((language: string, level: number, step: StepType): boolean => {
    if (step === 'theory') return true;
    if (step === 'quiz') return isStepCompleted(language, level, 'theory');
    if (step === 'challenge') return isStepCompleted(language, level, 'quiz');
    return false;
  }, [isStepCompleted]);

  const getTopicStepCount = useCallback((language: string, level: number): number => {
    const key = `${language}_${level}`;
    return stepMap[key]?.size ?? 0;
  }, [stepMap]);

  const getCompletedTopicsCount = useCallback((language: string, totalLevels: number): number => {
    let count = 0;
    for (let i = 1; i <= totalLevels; i++) {
      const key = `${language}_${i}`;
      if (stepMap[key]?.size === 3) count++;
    }
    return count;
  }, [stepMap]);

  return {
    completeStep,
    isStepCompleted,
    isStepUnlocked,
    getTopicStepCount,
    getCompletedTopicsCount,
    fetchStepProgress,
    loading,
  };
};
