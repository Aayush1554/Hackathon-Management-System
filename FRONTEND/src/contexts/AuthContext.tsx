import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

interface User {
  user_id: number;
  email: string;
  full_name: string;
  user_type: 'admin' | 'mentor' | 'team_member';
  phone?: string;
  organization?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, userType: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMentor: boolean;
  isTeamMember: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const statusCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load user and token from sessionStorage on mount (tab-isolated)
    const storedToken = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Auto-logout check - verify account status every 10 seconds
  useEffect(() => {
    if (token && user) {
      const checkAccountStatus = async () => {
        try {
          await authAPI.verifyAccountStatus();
        } catch (error: any) {
          const response = error.response?.data;
          if (response?.shouldLogout) {
            // Account deleted or deactivated
            toast.error(response.message || 'Your account has been deactivated', {
              duration: 5000,
            });
            
            // Force logout
            logout();
            
            // Redirect to appropriate login page
            const redirectPath = user.user_type === 'admin' 
              ? '/login/admin' 
              : user.user_type === 'mentor'
              ? '/login/mentor'
              : '/login/team';
            
            setTimeout(() => {
              window.location.href = redirectPath;
            }, 1000);
          }
        }
      };

      // Check immediately
      checkAccountStatus();

      // Then check every 10 seconds
      statusCheckIntervalRef.current = setInterval(checkAccountStatus, 10000);

      return () => {
        if (statusCheckIntervalRef.current) {
          clearInterval(statusCheckIntervalRef.current);
        }
      };
    }
  }, [token, user]);

  const login = async (email: string, password: string, userType: string) => {
    try {
      const response = await authAPI.login(email, password, userType);
      
      if (response.data.success) {
        const { token: newToken, ...userData } = response.data.data;
        
        setToken(newToken);
        setUser(userData);
        
        sessionStorage.setItem('token', newToken);
        sessionStorage.setItem('user', JSON.stringify(userData));
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getProfile();
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const value = {
    user,
    token,
    login,
    logout,
    refreshUser,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.user_type === 'admin',
    isMentor: user?.user_type === 'mentor',
    isTeamMember: user?.user_type === 'team_member',
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
