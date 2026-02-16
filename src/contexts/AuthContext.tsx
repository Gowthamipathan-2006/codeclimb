
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  displayName: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (displayName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Fetch display name from profiles
        setTimeout(async () => {
          const { data } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('user_id', session.user.id)
            .maybeSingle();
          setDisplayName(data?.display_name ?? session.user.email ?? null);
        }, 0);
      } else {
        setDisplayName(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', session.user.id)
          .maybeSingle()
          .then(({ data }) => {
            setDisplayName(data?.display_name ?? session.user.email ?? null);
          });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (displayName: string, email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName }
      }
    });
    return !error;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setDisplayName(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      displayName,
      login,
      signup,
      logout,
      isAuthenticated: !!user,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
