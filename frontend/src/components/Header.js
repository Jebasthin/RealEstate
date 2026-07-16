'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Home, Menu, X, ArrowRight, User } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-caramel/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-brownie to-caramel shadow-md shadow-brownie/15 group-hover:scale-105 transition-transform">
                <Home className="h-5 w-5 text-cream" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-brownie">
                Jose Estate
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-semibold text-coffee hover:text-brownie transition-colors">
              Buy Properties
            </Link>
            <Link href="#" className="text-sm font-semibold text-coffee hover:text-brownie transition-colors">
              Sell Properties
            </Link>
            <Link href="#" className="text-sm font-semibold text-coffee hover:text-brownie transition-colors">
              Browse Feed
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brownie text-cream hover:bg-caramel font-semibold text-sm transition-all duration-300 shadow-md shadow-brownie/10"
                >
                  <User className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-coffee hover:text-brownie transition-colors px-3 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-sm font-bold text-brownie hover:text-caramel transition-colors px-4 py-2"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brownie text-cream hover:bg-caramel font-bold text-sm transition-all duration-300 shadow-md shadow-brownie/10"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-brownie hover:text-caramel p-2 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream border-b border-caramel/20 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <Link 
            href="#" 
            className="block px-3 py-2 rounded-xl text-base font-semibold text-coffee hover:bg-caramel/10 hover:text-brownie transition-colors"
          >
            Buy Properties
          </Link>
          <Link 
            href="#" 
            className="block px-3 py-2 rounded-xl text-base font-semibold text-coffee hover:bg-caramel/10 hover:text-brownie transition-colors"
          >
            Sell Properties
          </Link>
          <Link 
            href="#" 
            className="block px-3 py-2 rounded-xl text-base font-semibold text-coffee hover:bg-caramel/10 hover:text-brownie transition-colors"
          >
            Browse Feed
          </Link>
          <hr className="border-caramel/10 my-2" />
          
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link 
                href="/dashboard" 
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brownie text-cream hover:bg-caramel font-bold text-sm text-center transition-colors"
              >
                <User className="h-4 w-4" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="block w-full py-3 text-center rounded-xl border border-brownie/20 text-brownie font-bold text-sm hover:bg-brownie/5"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <Link 
                href="/login" 
                className="block w-full py-3 text-center rounded-xl border border-brownie/20 text-brownie font-bold text-sm hover:bg-brownie/5 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/register" 
                className="block w-full py-3 text-center rounded-xl bg-brownie text-cream font-bold text-sm hover:bg-caramel transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
