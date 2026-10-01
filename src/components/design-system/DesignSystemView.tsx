import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Copy,
  Check,
  Sparkles,
  Ticket,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  QrCode,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  const { addToast } = useApp();
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    addToast('info', 'Token Copied', `${hex} copied to clipboard.`);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const colorTokens = [
    { name: 'Canvas Dark', hex: '#0F172A', role: 'Default dark background', bg: 'bg-[#0F172A]' },
    { name: 'Surface Dark', hex: '#1E293B', role: 'Cards & modal surfaces', bg: 'bg-[#1E293B]' },
    { name: 'Border Dark', hex: '#334155', role: 'Card & divider borders', bg: 'bg-[#334155]' },
    { name: 'Accent Primary', hex: '#4F46E5', role: 'Indigo core CTA & brand', bg: 'bg-[#4F46E5]' },
    { name: 'Accent Electric', hex: '#6366F1', role: 'Hover & interactive glow', bg: 'bg-[#6366F1]' },
    { name: 'Success / Active', hex: '#10B981', role: 'Seats available, check-in', bg: 'bg-[#10B981]' },
    { name: 'Danger / Sold Out', hex: '#EF4444', role: 'Full capacity, deletions', bg: 'bg-[#EF4444]' },
    { name: 'Warning / Rush', hex: '#F59E0B', role: 'Almost full, edge alerts', bg: 'bg-[#F59E0B]' },
    { name: 'Tech Cyan', hex: '#06B6D4', role: 'Technical category badge', bg: 'bg-[#06B6D4]' },
    { name: 'Cultural Purple', hex: '#A855F7', role: 'Cultural category badge', bg: 'bg-[#A855F7]' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Figma Design System Specification
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Visual Identity, Tokens & Component Matrix
        </h1>
        <p className="text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
          Comprehensive design tokens, typography scale, component state variants, and auto-layout blueprints adhering to the design constitution.
        </p>
      </div>

      {/* SECTION 1: Color Palette Tokens */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>1. Color Tokens & Swatches</span>
            <span className="text-xs font-mono text-slate-500 font-normal">(Click swatch to copy hex)</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {colorTokens.map((token) => (
            <button
              key={token.hex}
              onClick={() => copyToClipboard(token.hex)}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3 text-left transition-all group hover:border-slate-600 hover:shadow-lg"
            >
              <div
                className={`w-full h-14 rounded-lg mb-2.5 border border-white/10 ${token.bg} flex items-center justify-center`}
              >
                {copiedHex === token.hex ? (
                  <Check className="w-5 h-5 text-white drop-shadow" />
                ) : (
                  <Copy className="w-4 h-4 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <p className="text-xs font-bold text-white truncate">{token.name}</p>
              <p className="text-[11px] font-mono text-indigo-300 font-semibold">{token.hex}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 truncate">{token.role}</p>
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 2: Typography Scale */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          2. Typography Scale (Plus Jakarta Sans & JetBrains Mono)
        </h2>
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 space-y-5">
          <div className="pb-4 border-b border-slate-700/60 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1">
                H1 · 36px Bold (tracking-tight)
              </span>
              <h1 className="text-3xl font-extrabold text-white">Apex Campus Event Portal</h1>
            </div>
            <span className="text-xs font-mono text-slate-400">Headlines & Hero</span>
          </div>

          <div className="pb-4 border-b border-slate-700/60 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1">
                H2 · 28px SemiBold (leading-snug)
              </span>
              <h2 className="text-2xl font-bold text-white">Event Quotas & Live Rosters</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Dashboard & Section Headers</span>
          </div>

          <div className="pb-4 border-b border-slate-700/60 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1">
                H3 · 20px SemiBold
              </span>
              <h3 className="text-lg font-semibold text-white">HackApex 2026: 24h Campus Hackathon</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Event Cards & Modals</span>
          </div>

          <div className="pb-4 border-b border-slate-700/60 flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1">
                Body Regular · 16px & Body Small · 14px
              </span>
              <p className="text-sm text-slate-300 max-w-xl">
                Explore verified university events, secure your entry quota, and download tamper-proof QR passes instantly.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Card Descriptions & Form Inputs</span>
          </div>

          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono text-indigo-400 font-semibold block mb-1">
                JetBrains Mono (Pass IDs & Numerical Quotas)
              </span>
              <p className="font-mono text-lg font-bold text-cyan-300">#REG-EVT4-8921 · 142/150 SEATS (94%)</p>
            </div>
            <span className="text-xs font-mono text-slate-400">Machine verification & counters</span>
          </div>
        </div>
      </section>

      {/* SECTION 3: Component State Matrix - Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          3. Button Component State Matrix
        </h2>
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider">
                <th className="py-2 px-3">Variant</th>
                <th className="py-2 px-3">Default</th>
                <th className="py-2 px-3">Hover Simulation</th>
                <th className="py-2 px-3">Active / Pressed</th>
                <th className="py-2 px-3">Disabled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Primary (CTA)</td>
                <td className="py-3 px-3">
                  <button className="py-2 px-4 rounded-lg bg-indigo-600 text-white font-semibold">
                    Register Now
                  </button>
                </td>
                <td className="py-3 px-3">
                  <button className="py-2 px-4 rounded-lg bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30">
                    Register Now
                  </button>
                </td>
                <td className="py-3 px-3">
                  <button className="py-2 px-4 rounded-lg bg-indigo-700 text-white font-semibold scale-95">
                    Register Now
                  </button>
                </td>
                <td className="py-3 px-3">
                  <button disabled className="py-2 px-4 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 font-semibold cursor-not-allowed">
                    Sold Out
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Secondary / Outlined</td>
                <td className="py-3 px-3">
                  <button className="py-2 px-4 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 font-semibold">
                    View Pass
                  </button>
                </td>
                <td className="py-3 px-3">
                  <button className="py-2 px-4 rounded-lg border border-slate-600 bg-slate-700 text-white font-semibold">
                    View Pass
                  </button>
                </td>
                <td className="py-3 px-3">
                  <button className="py-2 px-4 rounded-lg border border-indigo-500 bg-slate-900 text-indigo-300 font-semibold scale-95">
                    View Pass
                  </button>
                </td>
                <td className="py-3 px-3">
                  <button disabled className="py-2 px-4 rounded-lg border border-slate-800 text-slate-600 font-semibold cursor-not-allowed">
                    View Pass
                  </button>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold text-white">Active Verified</td>
                <td className="py-3 px-3" colSpan={4}>
                  <div className="flex items-center gap-2 py-2 px-4 rounded-lg border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-semibold inline-flex">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Pass Active (#REG-EVT1-8921)</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: Event Card Architecture - 4 Variable States */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center justify-between">
          <span>4. Event Card Architecture (4 Variable States)</span>
          <span className="text-xs text-indigo-400 font-mono">Auto-layout · rounded-2xl · 12px inner</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* State 1: Open / Available */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Technical
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  42 seats left
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">AI & Cloud Symposium</h4>
              <p className="text-[11px] text-slate-400 mt-1">Oct 24 · Turing Hall</p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Capacity</span>
                  <span>58/100 (58%)</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[58%]" />
                </div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
              Register Now
            </button>
          </div>

          {/* State 2: Almost Full */}
          <div className="bg-slate-800 border border-amber-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-amber-950/20">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Workshops
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                  Only 2 left!
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">UI/UX Design Sprint</h4>
              <p className="text-[11px] text-slate-400 mt-1">Nov 12 · Design Lab 102</p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Capacity</span>
                  <span>43/45 (95%)</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full w-[95%]" />
                </div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold">
              Register Now
            </button>
          </div>

          {/* State 3: Sold Out */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 flex flex-col justify-between opacity-80">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Cultural
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Sold Out
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">Synapse Music Fest</h4>
              <p className="text-[11px] text-slate-400 mt-1">Nov 02 · Amphitheater</p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Capacity</span>
                  <span>500/500 (100%)</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full w-[100%]" />
                </div>
              </div>
            </div>
            <button disabled className="mt-4 w-full py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-500 text-xs font-semibold cursor-not-allowed">
              Event Full / Closed
            </button>
          </div>

          {/* State 4: Already Registered */}
          <div className="bg-slate-800 border border-emerald-500/40 rounded-2xl p-4 flex flex-col justify-between shadow-lg shadow-emerald-950/20">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Technical
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Pass Active
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">HackApex 2026: 24h Hack</h4>
              <p className="text-[11px] text-slate-400 mt-1">Oct 24 · Innovation Hub</p>
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                  <span>Capacity</span>
                  <span>142/150 (94%)</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[94%]" />
                </div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 rounded-lg border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>View Pass</span>
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 5: Toast Notifications Playground */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white tracking-tight">
          5. Toast Notification System & Edge Cases
        </h2>
        <p className="text-xs text-slate-400">
          Click the test triggers below to test the floating toast alerts for all required edge-cases:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() =>
              addToast(
                'error',
                'Event Registration Closed',
                'This event has reached full capacity. No further passes can be allocated.'
              )
            }
            className="p-4 bg-slate-800 border border-rose-500/40 hover:border-rose-500 rounded-xl text-left transition-all"
          >
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs mb-1">
              <AlertCircle className="w-4 h-4" />
              <span>Trigger Error Toast</span>
            </div>
            <p className="text-xs text-slate-300">"Event Registration Closed — This event has reached full capacity."</p>
          </button>

          <button
            onClick={() =>
              addToast(
                'warning',
                'Already Registered',
                'You already hold an active pass for this event. View your pass in My Passes.'
              )
            }
            className="p-4 bg-slate-800 border border-amber-500/40 hover:border-amber-500 rounded-xl text-left transition-all"
          >
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Trigger Warning Toast</span>
            </div>
            <p className="text-xs text-slate-300">"Already Registered — You already hold a pass for this event."</p>
          </button>

          <button
            onClick={() =>
              addToast(
                'success',
                'Registration Confirmed!',
                'Your entry pass is ready. Show your QR code at the entrance.'
              )
            }
            className="p-4 bg-slate-800 border border-emerald-500/40 hover:border-emerald-500 rounded-xl text-left transition-all"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Trigger Success Toast</span>
            </div>
            <p className="text-xs text-slate-300">"Registration Confirmed! Your entry pass is ready."</p>
          </button>
        </div>
      </section>
    </div>
  );
};
