'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, setAccessToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Attempt to silent refresh on load (gets new access token via HttpOnly refresh cookie)
        const response = await apiRequest('/auth/refresh', { method: 'POST' });
        
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.data.accessToken);
          
          // Fetch user profile
          const profileRes = await apiRequest('/auth/me');
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUser(profileData.data.user);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for force logouts from API client
    const handleForceLogout = () => {
      setUser(null);
      router.push('/login');
    };

    window.addEventListener('auth-logout', handleForceLogout);
    return () => {
      window.removeEventListener('auth-logout', handleForceLogout);
    };
  }, [router]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      const resData = await response.json();

      if (!response.ok) {
        const errorMsg = resData.errors 
          ? `${resData.message}: ${resData.errors.map(e => e.message).join(', ')}` 
          : (resData.message || 'Login failed');
        throw new Error(errorMsg);
      }

      setAccessToken(resData.data.accessToken);
      setUser(resData.data.user);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, role) => {
    setLoading(true);
    try {
      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, fullName, role }),
      });

      const resData = await response.json();

      if (!response.ok) {
        const errorMsg = resData.errors 
          ? `${resData.message}: ${resData.errors.map(e => e.message).join(', ')}` 
          : (resData.message || 'Registration failed');
        throw new Error(errorMsg);
      }

      // Return success without auto-logging in
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken('');
      setUser(null);
      setLoading(false);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
