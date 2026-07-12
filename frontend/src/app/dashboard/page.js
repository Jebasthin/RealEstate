'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthGuard from '../../components/AuthGuard';
import { LogOut, User, Home, PlusCircle, Search, Shield, HelpCircle, Bell, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-cream flex flex-col selection:bg-caramel/30 selection:text-brownie">
        {/* Background Blurs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-caramel/10 blur-[130px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-coffee/10 blur-[150px]" />
        </div>

        {/* Navigation Header */}
        <header className="relative z-10 border-b border-caramel/25 bg-cream/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-brownie shadow-md">
                <Home className="h-5 w-5 text-cream" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-brownie">
                Aether Estate
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button className="text-coffee hover:text-brownie transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-caramel" />
              </button>
              
              <div className="h-6 w-px bg-caramel/20" />

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-sm font-bold text-brownie">{user?.fullName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wide ${
                    user?.role === 'SELLER' 
                      ? 'bg-caramel/10 text-caramel border border-caramel/20' 
                      : 'bg-coffee/10 text-coffee border border-coffee/20'
                  }`}>
                    {user?.role}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full bg-cream border border-caramel/25 flex items-center justify-center text-brownie">
                  <User className="h-5 w-5" />
                </div>
              </div>

              <button 
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream border border-caramel/20 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-700 text-coffee text-sm font-semibold transition-all duration-300"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Welcome Section */}
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-brownie mb-2">
              Dashboard
            </h1>
            <p className="text-coffee/80 font-medium">
              Welcome back, <span className="text-brownie font-bold">{user?.fullName}</span>. Manage your real estate inquiries, search parameters, and listings.
            </p>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Main Content Area (2 Cols) */}
            <div className="md:col-span-2 space-y-8">
              {/* Action Card based on Role */}
              <div className="bg-cream/40 border border-caramel/20 p-8 rounded-3xl relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Home className="h-40 w-40 text-brownie" />
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-caramel/10 border border-caramel/20 text-caramel mb-6">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  
                  {user?.role === 'SELLER' ? (
                    <>
                      <h2 className="text-2xl font-bold text-brownie mb-3">Create your first property listing</h2>
                      <p className="text-coffee/80 mb-6 max-w-lg leading-relaxed font-medium">
                        Publish your residential properties, villas, or plots to our interactive feed where thousands of active buyers can locate them.
                      </p>
                      <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brownie hover:bg-caramel text-cream font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-brownie/15">
                        <PlusCircle className="h-5 w-5" />
                        Add New Listing
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-brownie mb-3">Discover premium properties</h2>
                      <p className="text-coffee/80 mb-6 max-w-lg leading-relaxed font-medium">
                        Explore listings by city, filters, or budget ranges and connect directly with verified property owners without intermediaries.
                      </p>
                      <button className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brownie hover:bg-caramel text-cream font-bold transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-brownie/15">
                        <Search className="h-5 w-5" />
                        Browse Properties
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Analytics Mock */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Active Inquiries', value: '0' },
                  { label: 'Saved Properties', value: '0' },
                  { label: 'Platform Listings', value: '1,429' },
                ].map((stat, idx) => (
                  <div key={idx} className="bg-cream/40 border border-caramel/15 p-6 rounded-2xl">
                    <span className="block text-xs font-bold text-coffee uppercase tracking-wider mb-2">{stat.label}</span>
                    <span className="text-2xl font-extrabold text-brownie">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Area (1 Col) */}
            <div className="space-y-8">
              
              {/* Quick Profile Summary */}
              <div className="bg-cream/40 border border-caramel/20 p-6 rounded-3xl">
                <h3 className="font-bold text-brownie text-lg mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-caramel" />
                  Security Credentials
                </h3>
                
                <div className="space-y-4 text-sm font-medium">
                  <div>
                    <span className="block text-xs text-coffee font-bold uppercase tracking-wider mb-1">Email ID</span>
                    <span className="text-brownie break-all">{user?.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-coffee font-bold uppercase tracking-wider mb-1">Full Name</span>
                    <span className="text-brownie">{user?.fullName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-coffee font-bold uppercase tracking-wider mb-1">System Privilege</span>
                    <span className="text-brownie uppercase">{user?.role}</span>
                  </div>
                </div>
              </div>

              {/* Platform Help Card */}
              <div className="bg-cream/20 border border-caramel/15 p-6 rounded-3xl flex gap-4">
                <div className="flex-shrink-0 text-caramel">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-brownie font-bold text-sm mb-1">Need assistance?</h4>
                  <p className="text-xs text-coffee leading-relaxed mb-3 font-medium">
                    Read our documentation on how listing property rules, verification flags, and inquiries work.
                  </p>
                  <a href="#" className="text-xs font-bold text-caramel hover:text-caramel/80 transition-colors">
                    Contact Support →
                  </a>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>
    </AuthGuard>
  );
}
