import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  GraduationCap,
  Calendar,
  Ticket,
  Users,
  Shield,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { setCurrentUser, setActiveScreen, addToast } = useApp();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<UserRole>('student');

  // Form fields
  const [name, setName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex.chen@campus.edu');
  const [idNumber, setIdNumber] = useState('CS-2024-042');
  const [password, setPassword] = useState('••••••••••••');

  const handleRoleToggle = (selectedRole: UserRole) => {
    setRole(selectedRole);
    if (selectedRole === 'student') {
      setName('Alex Chen');
      setEmail('alex.chen@campus.edu');
      setIdNumber('CS-2024-042');
    } else {
      setName('Dr. Sarah Jenkins');
      setEmail('s.jenkins@campus.edu');
      setIdNumber('FAC-CSE-890');
    }
  };

  const handleQuickDemo = (targetRole: UserRole) => {
    handleRoleToggle(targetRole);
    addToast(
      'info',
      `Switched to ${targetRole === 'student' ? 'Student' : 'Organizer'} Preset`,
      'Credentials updated. Click Sign In to proceed.'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (authMode === 'signup' && !name)) {
      addToast('warning', 'Missing Details', 'Please complete all required fields.');
      return;
    }

    const user = {
      id: `usr_${role}_${Date.now()}`,
      name: name || (role === 'student' ? 'Alex Chen' : 'Dr. Sarah Jenkins'),
      email,
      role,
      rollNumber: role === 'student' ? idNumber : undefined,
      department:
        role === 'organizer'
          ? 'Department of Student Affairs'
          : 'Computer Science & Engineering',
      avatarUrl:
        role === 'student'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    };

    setCurrentUser(user);
    addToast(
      'success',
      authMode === 'signin' ? 'Welcome Back!' : 'Account Created Successfully',
      `Logged in as ${user.name} (${role === 'student' ? 'Student Portal' : 'Organizer Dashboard'}).`
    );

    setActiveScreen(role === 'student' ? 'catalog' : 'organizer-dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 sm:p-6 lg:p-10">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* LEFT COLUMN: Visual Showcase & Campus Life Collage */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-8 sm:p-10 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* Top Logo / Brand */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white block">
                  CampusPass
                </span>
                <span className="text-xs text-indigo-300 font-medium">
                  University Event Portal
                </span>
              </div>
            </div>

            <div className="mt-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Live Campus Quotas & Entry
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-4 leading-tight">
                Your Gateway to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                  Campus Life
                </span>
              </h1>
              <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                Seamlessly discover tech hackathons, cultural nights, athletic
                tournaments, and reserve instant tamper-proof QR entry passes.
              </p>
            </div>
          </div>

          {/* Bottom Value Props */}
          <div className="relative z-10 mt-8 pt-8 border-t border-indigo-800/40 space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Real-time seat quotas & instantaneous pass generation</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Organizer dashboard with attendee rosters & CSV exports</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Gate-ready verifiable QR codes with print styling</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-slate-900/90">
          <div className="max-w-md w-full mx-auto">
            {/* Header with quick switch */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  {authMode === 'signin' ? 'Welcome back' : 'Create an account'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose your role to access personalized campus services
                </p>
              </div>

              {/* Toggle mode button */}
              <button
                type="button"
                onClick={() => setAuthMode((m) => (m === 'signin' ? 'signup' : 'signin'))}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {authMode === 'signin' ? 'Need an account?' : 'Already registered?'}
              </button>
            </div>

            {/* Role Switcher Pill Container */}
            <div className="mb-6">
              <label className="block text-xs font-semibold uppercase text-slate-400 tracking-wider mb-2">
                I am signing in as:
              </label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
                <button
                  type="button"
                  onClick={() => handleRoleToggle('student')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    role === 'student'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student Persona</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleToggle('organizer')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                    role === 'organizer'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Organizer / Admin</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Pre-fills */}
            <div className="mb-6 p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Quick Evaluation:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('student')}
                  className="px-2.5 py-1 rounded bg-slate-700/80 hover:bg-slate-700 text-indigo-300 text-[11px] font-medium transition-colors"
                >
                  Fill Student
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('organizer')}
                  className="px-2.5 py-1 rounded bg-slate-700/80 hover:bg-slate-700 text-cyan-300 text-[11px] font-medium transition-colors"
                >
                  Fill Organizer
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={role === 'student' ? 'e.g. Alex Chen' : 'e.g. Dr. Sarah Jenkins'}
                    className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  College Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username@campus.edu"
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {role === 'student' ? 'Student Roll Number' : 'Department / Faculty Code'}
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder={role === 'student' ? 'e.g. CS-2024-042' : 'e.g. FAC-CSE-890'}
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 group active:scale-[0.99]"
              >
                <span>
                  {authMode === 'signin'
                    ? `Sign In as ${role === 'student' ? 'Student' : 'Organizer'}`
                    : `Create ${role === 'student' ? 'Student' : 'Organizer'} Account`}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Footer privacy guarantee */}
            <p className="text-center text-[11px] text-slate-500 mt-6 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              Apex University SSO & Identity Verification Shield
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
