import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Ticket,
  Users,
  Compass,
  Layers,
  Monitor,
  Smartphone,
  Maximize2,
  LogOut,
  GraduationCap,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    logout,
    loginAs,
    activeScreen,
    setActiveScreen,
    viewportMode,
    setViewportMode,
    registrations,
  } = useApp();

  const myPassesCount = currentUser
    ? registrations.filter((r) => r.studentId === currentUser.id).length
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 no-print">
      {/* Top Viewport & Figma Mode Bar */}
      <div className="bg-slate-950/80 border-b border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            CampusPass Portal
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-[11px] text-slate-400">
            Figma Design Spec & Live Responsive Preview
          </span>
        </div>

        {/* Viewport switch buttons */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setViewportMode('responsive')}
            title="Fluid Responsive Mode"
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              viewportMode === 'responsive'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden md:inline">Fluid</span>
          </button>
          <button
            onClick={() => setViewportMode('desktop-1440')}
            title="Figma Desktop Frame (1440px)"
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              viewportMode === 'desktop-1440'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3 h-3" />
            <span>1440px</span>
          </button>
          <button
            onClick={() => setViewportMode('mobile-375')}
            title="Figma Mobile Frame (375px)"
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              viewportMode === 'mobile-375'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3 h-3" />
            <span>375px</span>
          </button>
          <button
            onClick={() => {
              setViewportMode('design-system');
              setActiveScreen('design-system');
            }}
            title="Design System & Component Kit"
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeScreen === 'design-system'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Figma Tokens & Kit</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              if (currentUser?.role === 'organizer') {
                setActiveScreen('organizer-dashboard');
              } else {
                setActiveScreen('catalog');
              }
            }}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block leading-none">
                CampusPass
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                Apex University
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveScreen('catalog')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeScreen === 'catalog'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Event Discovery</span>
            </button>

            {currentUser?.role === 'student' && (
              <button
                onClick={() => setActiveScreen('my-passes')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeScreen === 'my-passes'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>My Passes</span>
                {myPassesCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white font-mono text-[10px]">
                    {myPassesCount}
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setActiveScreen('organizer-dashboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeScreen === 'organizer-dashboard'
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Organizer Dashboard</span>
            </button>

            <button
              onClick={() => setActiveScreen('design-system')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeScreen === 'design-system'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Design System</span>
            </button>
          </nav>
        </div>

        {/* Right Section: Persona Switcher & User Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Persona Switcher */}
          <div className="hidden sm:flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs">
            <button
              onClick={() => loginAs('student')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                currentUser?.role === 'student'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              <span>Student</span>
            </button>
            <button
              onClick={() => loginAs('organizer')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                currentUser?.role === 'organizer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>Organizer</span>
            </button>
          </div>

          {/* User Profile Badge or Sign In button */}
          {currentUser ? (
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-indigo-400/40 object-cover"
                />
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {currentUser.rollNumber || currentUser.department?.slice(0, 18) || 'Member'}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveScreen('auth')}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
