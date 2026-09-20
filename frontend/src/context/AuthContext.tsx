import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, DemoAccount, RegisterPayload } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  quickLoginDemo: (role: 'admin' | 'faculty' | 'student') => Promise<void>;
  demoAccounts: DemoAccount[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_CREDENTIALS: Record<string, { email: string; password: string }> = {
  admin: { email: 'admin@apex.edu', password: 'Admin@2026' },
  faculty: { email: 'faculty@apex.edu', password: 'Faculty@2026' },
  student: { email: 'student@apex.edu', password: 'Student@2026' }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('dropoutguard_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [demoAccounts, setDemoAccounts] = useState<DemoAccount[]>([]);

  useEffect(() => {
    // Fetch demo accounts metadata
    api.getDemoAccounts()
      .then(res => {
        if (res.accounts) setDemoAccounts(res.accounts);
      })
      .catch(() => {});

    // Validate stored session token
    const storedToken = localStorage.getItem('dropoutguard_token');
    if (storedToken) {
      api.getMe()
        .then(res => {
          if (res.user) {
            setUser(res.user);
            setToken(storedToken);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => setIsLoading(false));
    } else {
      // For immediate hackathon presentation convenience, initialize with Dean Dr. Aris Thorne demo persona
      const savedUser = localStorage.getItem('dropoutguard_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          setUser({
            id: 'USR-001',
            name: 'Dr. Aris Thorne',
            email: 'admin@apex.edu',
            role: 'admin',
            department: 'Dean of Academic Affairs',
            avatar: 'AT'
          });
        }
      } else {
        setUser({
          id: 'USR-001',
          name: 'Dr. Aris Thorne',
          email: 'admin@apex.edu',
          role: 'admin',
          department: 'Dean of Academic Affairs',
          avatar: 'AT'
        });
      }
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('dropoutguard_token', res.token);
      localStorage.setItem('dropoutguard_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('dropoutguard_token', res.token);
      localStorage.setItem('dropoutguard_user', JSON.stringify(res.user));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('dropoutguard_token');
    localStorage.removeItem('dropoutguard_user');
  };

  const quickLoginDemo = async (role: 'admin' | 'faculty' | 'student') => {
    const creds = DEMO_CREDENTIALS[role];
    if (creds) {
      try {
        await login(creds.email, creds.password);
      } catch (err) {
        const mockUser: User = role === 'admin'
          ? { id: 'USR-001', name: 'Dr. Aris Thorne', email: 'admin@apex.edu', role: 'admin', department: 'Dean of Academic Affairs', avatar: 'AT' }
          : role === 'faculty'
          ? { id: 'USR-002', name: 'Prof. Ananya Sen', email: 'faculty@apex.edu', role: 'faculty', department: 'Dept of Computer Applications', avatar: 'AS' }
          : { id: 'USR-003', name: 'Aarav Sharma', email: 'student@apex.edu', role: 'student', department: 'B.Tech Computer Science', avatar: 'AS' };
        setUser(mockUser);
        setToken(`demo_token_${role}`);
        localStorage.setItem('dropoutguard_token', `demo_token_${role}`);
        localStorage.setItem('dropoutguard_user', JSON.stringify(mockUser));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        quickLoginDemo,
        demoAccounts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
