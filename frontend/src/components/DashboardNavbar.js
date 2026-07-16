'use client';

import React, { useState } from 'react';
import { 
  Menu, X, Home, LogOut, User, PlusCircle, Search, 
  Shield, Mail, MessageSquare, Building, Phone
} from 'lucide-react';

export default function DashboardNavbar({
  activeTab,
  setActiveTab,
  role,
  enquiriesCount = 0,
  pendingCount = 0,
  user,
  logout
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const handleMenuClick = (tab) => {
    setActiveTab(tab);
    setIsOpen(false);
  };

  // Get Initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Navigation Header */}
      <header className="relative z-30 border-b border-caramel/25 bg-cream/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Toggle Button */}
            <button 
              onClick={toggleDrawer}
              aria-label="Toggle menu"
              className="p-2.5 rounded-xl border border-caramel/20 hover:bg-caramel/10 text-brownie transition-colors duration-200 cursor-pointer flex items-center justify-center"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <Home className="h-6 w-6 text-brownie" />
              <span className="font-extrabold text-lg tracking-tight text-brownie">Jose Estate</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Profile Badge */}
            <div className="hidden sm:flex items-center gap-3 bg-caramel/10 px-4 py-2 rounded-2xl border border-caramel/15">
              <div className="h-8 w-8 rounded-xl bg-brownie text-cream flex items-center justify-center font-bold text-sm">
                {getInitials(user?.fullName)}
              </div>
              <div className="text-left leading-none">
                <span className="block text-xs font-bold text-brownie truncate max-w-[120px]">{user?.fullName || 'User'}</span>
                <span className="text-[9px] font-extrabold text-coffee uppercase tracking-wide">{role}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cream border border-caramel/20 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-700 text-coffee text-sm font-semibold transition-all duration-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sliding Navigation Drawer */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={toggleDrawer}
        />

        {/* Drawer Panel */}
        <aside 
          className={`absolute top-0 left-0 h-full w-80 max-w-[85vw] bg-cream shadow-2xl border-r border-caramel/30 p-6 flex flex-col justify-between transition-transform duration-300 transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="space-y-8">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-caramel/20">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-brownie text-cream flex items-center justify-center font-bold text-sm">
                  {getInitials(user?.fullName)}
                </div>
                <div>
                  <h4 className="font-extrabold text-brownie text-sm leading-tight truncate max-w-[180px]">{user?.fullName}</h4>
                  <span className="text-[10px] font-bold text-coffee uppercase tracking-wider">{role}</span>
                </div>
              </div>
              
              <button 
                onClick={toggleDrawer}
                aria-label="Close menu"
                className="p-2 rounded-lg bg-caramel/10 text-brownie hover:bg-caramel/20 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <button
                onClick={() => handleMenuClick('OVERVIEW')}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                  activeTab === 'OVERVIEW' 
                    ? 'bg-brownie text-cream shadow-md shadow-brownie/10' 
                    : 'text-coffee hover:bg-caramel/10'
                }`}
              >
                <User className="h-4.5 w-4.5" />
                <span>Overview</span>
              </button>

              {role === 'BUYER' && (
                <>
                  <button
                    onClick={() => handleMenuClick('BROWSE')}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                      activeTab === 'BROWSE' 
                        ? 'bg-brownie text-cream shadow-md shadow-brownie/10' 
                        : 'text-coffee hover:bg-caramel/10'
                    }`}
                  >
                    <Search className="h-4.5 w-4.5" />
                    <span>Browse Properties</span>
                  </button>
                  
                  <button
                    onClick={() => handleMenuClick('INQUIRIES')}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                      activeTab === 'INQUIRIES' 
                        ? 'bg-brownie text-cream shadow-md shadow-brownie/10' 
                        : 'text-coffee hover:bg-caramel/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <MessageSquare className="h-4.5 w-4.5" />
                      <span>My Inquiries</span>
                    </div>
                    {enquiriesCount > 0 && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                        activeTab === 'INQUIRIES' ? 'bg-cream text-brownie' : 'bg-brownie text-cream'
                      }`}>
                        {enquiriesCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {(role === 'SELLER' || role === 'ADMIN') && (
                <>
                  <button
                    onClick={() => handleMenuClick('MY_LISTINGS')}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                      activeTab === 'MY_LISTINGS' 
                        ? 'bg-brownie text-cream shadow-md shadow-brownie/10' 
                        : 'text-coffee hover:bg-caramel/10'
                    }`}
                  >
                    <Building className="h-4.5 w-4.5" />
                    <span>My Properties</span>
                  </button>

                  <button
                    onClick={() => handleMenuClick('ADD_PROPERTY')}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                      activeTab === 'ADD_PROPERTY' 
                        ? 'bg-brownie text-cream shadow-md shadow-brownie/10' 
                        : 'text-coffee hover:bg-caramel/10'
                    }`}
                  >
                    <PlusCircle className="h-4.5 w-4.5" />
                    <span>Add Property</span>
                  </button>

                  <button
                    onClick={() => handleMenuClick('LEADS')}
                    className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                      activeTab === 'LEADS' 
                        ? 'bg-brownie text-cream shadow-md shadow-brownie/10' 
                        : 'text-coffee hover:bg-caramel/10'
                    }`}
                  >
                    <Mail className="h-4.5 w-4.5" />
                    <span>Leads / Inquiries</span>
                  </button>
                </>
              )}

              {role === 'ADMIN' && (
                <button
                  onClick={() => handleMenuClick('MODERATION')}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left ${
                    activeTab === 'MODERATION' 
                      ? 'bg-brownie text-cream shadow-md shadow-brownie/10' 
                      : 'text-coffee hover:bg-caramel/10'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Shield className="h-4.5 w-4.5" />
                    <span>Moderation Queue</span>
                  </div>
                  {pendingCount > 0 && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                      activeTab === 'MODERATION' ? 'bg-cream text-brownie' : 'bg-red-600 text-white'
                    }`}>
                      {pendingCount}
                    </span>
                  )}
                </button>
              )}
            </nav>
          </div>

          {/* Drawer Footer info details */}
          <div className="pt-4 border-t border-caramel/15 space-y-3.5">
            <div className="text-xs font-semibold text-coffee/70">
              <span className="block text-[9px] uppercase tracking-wider text-coffee/50 mb-0.5">Logged in email</span>
              <span className="truncate block font-bold text-brownie">{user?.email}</span>
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-700 text-xs font-bold transition-all duration-300 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out session</span>
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
