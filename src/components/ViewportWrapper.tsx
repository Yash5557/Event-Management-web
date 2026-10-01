import React from 'react';
import { useApp } from '../context/AppContext';
import { Monitor, Smartphone, Wifi, Battery, Signal } from 'lucide-react';

export const ViewportWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { viewportMode, setViewportMode } = useApp();

  if (viewportMode === 'responsive' || viewportMode === 'design-system') {
    return <main className="w-full flex-1">{children}</main>;
  }

  if (viewportMode === 'desktop-1440') {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center overflow-x-auto">
        {/* Frame Label */}
        <div className="w-[1440px] max-w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-2">
          <div className="flex items-center gap-2 font-mono">
            <Monitor className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-200">Figma Desktop Artboard (1440px)</span>
            <span className="text-slate-600">·</span>
            <span>100% Scale Baseline</span>
          </div>
          <button
            onClick={() => setViewportMode('responsive')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
          >
            Exit Frame Mode
          </button>
        </div>

        {/* 1440px Container */}
        <div className="w-[1440px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden shrink-0">
          {children}
        </div>
      </div>
    );
  }

  // Mobile 375px iPhone frame
  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 flex flex-col items-center overflow-y-auto">
      {/* Frame Label */}
      <div className="w-[375px] flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <div className="flex items-center gap-1.5 font-mono">
          <Smartphone className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-200">Mobile Frame (375px)</span>
        </div>
        <button
          onClick={() => setViewportMode('responsive')}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline"
        >
          Exit Frame Mode
        </button>
      </div>

      {/* Smartphone Device Shell */}
      <div className="w-[375px] min-h-[780px] bg-slate-900 border-4 border-slate-700 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-white/10">
        {/* Notch / Dynamic Island */}
        <div className="h-10 bg-slate-900 flex items-center justify-between px-6 shrink-0 relative z-30 select-none">
          <span className="text-xs font-bold text-white font-mono">09:41</span>
          <div className="w-20 h-4 bg-black rounded-full" />
          <div className="flex items-center gap-1.5 text-white">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <Battery className="w-4 h-4" />
          </div>
        </div>

        {/* Device Content Screen */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden text-sm">
          {children}
        </div>

        {/* Home Bar Indicator */}
        <div className="h-5 bg-slate-900 flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-slate-600 rounded-full" />
        </div>
      </div>
    </div>
  );
};
