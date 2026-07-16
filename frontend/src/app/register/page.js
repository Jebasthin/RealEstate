'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, User, Loader2, Home, Sparkles, ArrowLeft, Phone } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('BUYER'); // BUYER or SELLER
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(email, password, fullName, role, mobile);
    if (result.success) {
      router.push('/login?registered=true');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cream selection:bg-caramel/30 selection:text-brownie">
      {/* Decorative Warm Gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[380px] h-[380px] rounded-full bg-caramel/15 blur-[100px] animate-pulse duration-[8s]" />
        <div className="absolute bottom-[10%] right-[10%] w-[420px] h-[420px] rounded-full bg-coffee/10 blur-[120px] animate-pulse duration-[10s]" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
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
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-brownie shadow-lg shadow-brownie/15 mb-4 animate-bounce duration-[3.5s]">
            <Home className="h-7 w-7 text-cream" />
          </div>
          <h2 className="text-3xl font-extrabold text-brownie tracking-tight">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-coffee/85 font-medium">
            Join us to buy, sell, or rent premium real estate listings
          </p>
        </div>

        {/* Register Card (Trending Warm Minimalist UI) */}
        <div className="bg-cream/60 backdrop-blur-xl border border-caramel/20 p-8 rounded-3xl shadow-xl shadow-brownie/5">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-800 text-xs font-medium flex items-start">
              <span className="font-bold mr-1">Error:</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-xs font-bold text-brownie uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel transition-all duration-300 text-sm font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-xs font-bold text-brownie uppercase tracking-wider mb-2">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel transition-all duration-300 text-sm font-medium"
                  placeholder="e.g. +91 9876543210"
                />
              </div>
            </div>

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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-cream/10 border border-caramel/25 rounded-2xl text-brownie placeholder-coffee/40 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel transition-all duration-300 text-sm font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-brownie uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-coffee">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
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

            {/* Custom Account Role Selector Card */}
            <div>
              <label className="block text-xs font-bold text-brownie uppercase tracking-wider mb-3">
                Account Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('BUYER')}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 focus:outline-none ${
                    role === 'BUYER'
                      ? 'border-brownie bg-brownie/5 shadow-md shadow-brownie/5'
                      : 'border-caramel/20 bg-cream/10 hover:border-caramel/50'
                  }`}
                >
                  {role === 'BUYER' && (
                    <span className="absolute top-3 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-caramel opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-caramel"></span>
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-brownie">Buyer</h4>
                  <p className="text-[11px] text-coffee mt-1 leading-normal font-medium">
                    Search and inquire about properties
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('SELLER')}
                  className={`relative p-4 rounded-2xl border text-left transition-all duration-300 focus:outline-none ${
                    role === 'SELLER'
                      ? 'border-brownie bg-brownie/5 shadow-md shadow-brownie/5'
                      : 'border-caramel/20 bg-cream/10 hover:border-caramel/50'
                  }`}
                >
                  {role === 'SELLER' && (
                    <span className="absolute top-3 right-3 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-caramel opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-caramel"></span>
                    </span>
                  )}
                  <h4 className="text-sm font-bold text-brownie">Seller</h4>
                  <p className="text-[11px] text-coffee mt-1 leading-normal font-medium">
                    List and advertise properties for rent/sale
                  </p>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-caramel/15 text-center">
            <p className="text-sm text-coffee font-medium">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-caramel hover:text-caramel/80 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
