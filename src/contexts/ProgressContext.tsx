
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Progress {
  [language: string]: {
    [level: number]: boolean;
  };
}

interface ProgressContextType {
  progress: Progress;
  completeLevel: (language: string, level: number) => void;
  isLevelUnlocked: (language: string, level: number) => boolean;
  getCompletedLevels: (language: string) => number;
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
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`codeclimb_progress_${user.id}`);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  const completeLevel = (language: string, level: number) => {
    if (!user) return;
    
    const newProgress = {
      ...progress,
      [language]: {
        ...progress[language],
        [level]: true
      }
    };
    
    setProgress(newProgress);
    localStorage.setItem(`codeclimb_progress_${user.id}`, JSON.stringify(newProgress));
  };

  const isLevelUnlocked = (language: string, level: number) => {
    if (level === 1) return true;
    return progress[language]?.[level - 1] === true;
  };

  const getCompletedLevels = (language: string) => {
    if (!progress[language]) return 0;
    return Object.values(progress[language]).filter(Boolean).length;
  };

  return (
    <ProgressContext.Provider value={{
      progress,
      completeLevel,
      isLevelUnlocked,
      getCompletedLevels
    }}>
      {children}
    </ProgressContext.Provider>
  );
};
