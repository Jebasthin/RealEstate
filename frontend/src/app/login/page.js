'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, Loader2, Home, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('registered') === 'true') {
        setSuccessMessage('Registration successful! Please sign in with your credentials.');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    const result = await login(email, password);
    if (!result.success) {
      setError(result.error || 'Invalid credentials. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cream selection:bg-caramel/30 selection:text-brownie">
      {/* Decorative Warm Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] right-[10%] w-[380px] h-[380px] rounded-full bg-caramel/15 blur-[100px] animate-pulse duration-[8s]" />
        <div className="absolute bottom-[15%] left-[10%] w-[420px] h-[420px] rounded-full bg-coffee/10 blur-[120px] animate-pulse duration-[10s]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-coffee hover:text-brownie mb-8 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Back to Homepage
        </Link>

        {/* Branding header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-brownie shadow-lg shadow-brownie/15 mb-4 animate-bounce duration-[3s]">
            <Home className="h-7 w-7 text-cream" />
          </div>
          <h2 className="text-3xl font-extrabold text-brownie tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-coffee/85 font-medium">
            Sign in to access your premium real estate account
          </p>
        </div>

        {/* Login Card (Trending Warm Minimalist UI) */}
        <div className="bg-cream/60 backdrop-blur-xl border border-caramel/20 p-8 rounded-3xl shadow-xl shadow-brownie/5">
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-xs font-medium flex items-start">
              <span className="font-bold mr-1">Success:</span> {successMessage}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-medium flex items-start">
              <span className="font-bold mr-1">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-brownie uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel transition-all duration-300 text-sm font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-brownie uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-caramel hover:text-caramel/80 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-12 py-3.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel transition-all duration-300 text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-coffee hover:text-brownie transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-4 px-4 bg-brownie hover:bg-caramel text-cream font-bold rounded-2xl shadow-lg shadow-brownie/15 focus:outline-none focus:ring-2 focus:ring-caramel focus:ring-offset-2 focus:ring-offset-cream transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Verifying account...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-caramel/15 text-center">
            <p className="text-sm text-coffee font-medium">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-caramel hover:text-caramel/80 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
