'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Home, LogOut, User, PlusCircle, Search, 
  Shield, Mail, MessageSquare, Building, Phone,
  ChevronDown, ChevronUp, Database
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
  const [masterOpen, setMasterOpen] = useState(
    activeTab === 'USER_MASTER' || activeTab === 'LOCATION_MASTER'
  );
  const isMasterActive = activeTab === 'USER_MASTER' || activeTab === 'LOCATION_MASTER';
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            {/* User Profile Badge Button */}
            <button 
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-3 bg-caramel/10 hover:bg-caramel/20 px-4 py-2.5 rounded-2xl border border-caramel/15 transition-all duration-200 cursor-pointer select-none text-left focus:outline-none"
            >
              <div className="h-8 w-8 rounded-xl bg-brownie text-cream flex items-center justify-center font-bold text-sm">
                {getInitials(user?.fullName)}
              </div>
              <div className="hidden sm:block text-left leading-none pr-1">
                <span className="block text-xs font-bold text-brownie truncate max-w-[120px]">{user?.fullName || 'User'}</span>
                <span className="text-[9px] font-extrabold text-coffee uppercase tracking-wide">{role}</span>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-brownie transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Card */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 bg-cream border border-caramel/25 rounded-3xl shadow-xl p-5 z-50 text-center animate-slide-right opacity-0 [animation-fill-mode:forwards]">
                {/* Large Avatar Initial */}
                <div className="mx-auto h-16 w-16 rounded-full border-2 border-brownie flex items-center justify-center font-extrabold text-xl text-brownie bg-cream/50 mb-3 shadow-inner">
                  {getInitials(user?.fullName)}
                </div>
                
                {/* Greeting & Info */}
                <h5 className="font-extrabold text-brownie text-sm">Hi, {user?.fullName || 'User'}</h5>
                <span className="text-[10px] font-extrabold text-coffee/60 uppercase tracking-wider block mt-0.5">{role}</span>
                
                {/* Divider */}
                <div className="h-[1px] bg-caramel/15 my-4" />
                
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => {
                      setActiveTab('OVERVIEW');
                      setProfileDropdownOpen(false);
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-caramel/15 hover:bg-caramel/25 text-brownie font-bold text-xs transition-colors cursor-pointer"
                  >
                    <User className="h-4 w-4 text-brownie" />
                    <span>Profile</span>
                  </button>

                  <button 
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 text-rose-700" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
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
                <>
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

                  <div className="space-y-1">
                    <button
                      onClick={() => setMasterOpen(!masterOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 text-left cursor-pointer ${
                        isMasterActive 
                          ? 'bg-caramel/10 text-brownie border border-caramel/25' 
                          : 'text-coffee hover:bg-caramel/10'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <Database className="h-4.5 w-4.5" />
                        <span>Master</span>
                      </div>
                      {masterOpen ? (
                        <ChevronUp className="h-4 w-4 text-coffee" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-coffee" />
                      )}
                    </button>
                    
                    {masterOpen && (
                      <div className="pl-6 space-y-1 transition-all duration-200">
                        <button
                          onClick={() => handleMenuClick('USER_MASTER')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 text-left cursor-pointer ${
                            activeTab === 'USER_MASTER'
                              ? 'bg-brownie text-cream shadow-sm'
                              : 'text-coffee/80 hover:bg-caramel/10'
                          }`}
                        >
                          <User className="h-3.5 w-3.5" />
                          <span>User Master</span>
                        </button>
                        <button
                          onClick={() => handleMenuClick('LOCATION_MASTER')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 text-left cursor-pointer ${
                            activeTab === 'LOCATION_MASTER'
                              ? 'bg-brownie text-cream shadow-sm'
                              : 'text-coffee/80 hover:bg-caramel/10'
                          }`}
                        >
                          <Home className="h-3.5 w-3.5" />
                          <span>Location Master</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
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
