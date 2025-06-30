
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  userId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userId: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
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

  useEffect(() => {
    const savedUser = localStorage.getItem('codeclimb_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signup = async (userId: string, email: string, password: string): Promise<boolean> => {
    if (password.length < 6) {
      return false;
    }

    const users = JSON.parse(localStorage.getItem('codeclimb_users') || '[]');
    
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    const newUser = { id: Date.now().toString(), userId, email, password };
    users.push(newUser);
    localStorage.setItem('codeclimb_users', JSON.stringify(users));
    
    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('codeclimb_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const userToSet = { id: foundUser.id, email: foundUser.email, userId: foundUser.userId };
      setUser(userToSet);
      localStorage.setItem('codeclimb_user', JSON.stringify(userToSet));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('codeclimb_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
