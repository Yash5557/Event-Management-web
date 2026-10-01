import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export const MyPassesView: React.FC = () => {
  const { currentUser, registrations, openPassModal, setActiveScreen } = useApp();

  const myRegistrations = registrations.filter(
    (r) => r.studentId === currentUser?.id
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Digital Wallet
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Event Passes ({myRegistrations.length})
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Present your entry QR code at campus venue gates for automated scanning.
          </p>
        </div>

        <button
          onClick={() => setActiveScreen('catalog')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all self-start sm:self-auto"
        >
          <span>Explore More Events</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {myRegistrations.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/40 rounded-3xl border border-slate-800 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No passes claimed yet</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You haven't registered for any events yet. Explore our campus hackathons, cultural fests, and workshops to claim your seats.
          </p>
          <button
            onClick={() => setActiveScreen('catalog')}
            className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            Browse Campus Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRegistrations.map((pass) => (
            <div
              key={pass.id}
              className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/30 transition-all group"
            >
              <div>
                {/* Header with pass ID and category */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                    {pass.id}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Confirmed
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                  {pass.eventTitle}
                </h3>

                {/* Details */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{pass.eventDate}</span>
                    <span className="text-slate-500">·</span>
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{pass.eventTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{pass.eventVenue}</span>
                  </div>
                </div>

                {/* Attendee Info Box */}
                <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Attendee</span>
                    <span className="font-semibold text-white">{pass.studentName}</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Roll No</span>
                    <span className="font-medium text-slate-300">{pass.studentRollNumber}</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Open Digital Ticket */}
              <div className="mt-5 pt-4 border-t border-slate-700/60">
                <button
                  onClick={() => openPassModal(pass)}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/25"
                >
                  <QrCode className="w-4 h-4" />
                  <span>View Perforated Digital Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
