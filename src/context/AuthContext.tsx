'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile } from '@/types/database';
import { createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<{ error?: string }>;
  signup: (fullName: string, email: string, pass: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USER: Profile = {
  id: 'usr-demo-001',
  full_name: 'Pooja Sharma',
  phone: '+91 98765 43210',
  avatar_url: null,
  is_admin: true, // Brand Owner / Admin access for testing
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage first for demo/saved session
    const saved = localStorage.getItem('ciraaya_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        setUser(null);
      }
    } else {
      // Standard visitor starts with null (unauthenticated guest session)
      setUser(null);
    }

    const supabase = createClient();
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const profile: Profile = {
            id: session.user.id,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Member',
            phone: session.user.user_metadata?.phone || null,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            is_admin: Boolean(session.user.user_metadata?.is_admin || session.user.email === 'admin@ciraaya.com'),
            created_at: session.user.created_at,
          };
          setUser(profile);
          localStorage.setItem('ciraaya_user', JSON.stringify(profile));
        }
      });
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { error: error.message };
      if (data.user) {
        const profile: Profile = {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Member',
          phone: data.user.user_metadata?.phone || null,
          avatar_url: null,
          is_admin: Boolean(data.user.user_metadata?.is_admin || email.toLowerCase().includes('admin')),
        };
        setUser(profile);
        localStorage.setItem('ciraaya_user', JSON.stringify(profile));
        return {};
      }
    }

    // Local / Demo mode fallback
    const isMockAdmin = email.toLowerCase().includes('admin');
    const mockProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: isMockAdmin ? 'Pooja Sharma (Admin)' : (email.split('@')[0] || 'Valued Patron'),
      phone: '+91 98765 43210',
      avatar_url: null,
      is_admin: isMockAdmin,
    };
    setUser(mockProfile);
    localStorage.setItem('ciraaya_user', JSON.stringify(mockProfile));
    return {};
  };

  const signup = async (fullName: string, email: string, pass: string) => {
    const supabase = createClient();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) return { error: error.message };
      if (data.user) {
        const profile: Profile = {
          id: data.user.id,
          full_name: fullName,
          phone: null,
          avatar_url: null,
          is_admin: false,
        };
        setUser(profile);
        localStorage.setItem('ciraaya_user', JSON.stringify(profile));
        return {};
      }
    }

    // Local mode fallback
    const mockProfile: Profile = {
      id: `usr-${Date.now()}`,
      full_name: fullName,
      phone: null,
      avatar_url: null,
      is_admin: false,
    };
    setUser(mockProfile);
    localStorage.setItem('ciraaya_user', JSON.stringify(mockProfile));
    return {};
  };

  const logout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('ciraaya_user');
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('ciraaya_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: !!user?.is_admin,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
