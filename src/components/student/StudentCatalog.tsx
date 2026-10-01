import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventCategory, EventItem } from '../../types';
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CheckCircle2,
  Users,
  Sparkles,
  ArrowRight,
  Filter,
  AlertCircle,
} from 'lucide-react';

export const StudentCatalog: React.FC = () => {
  const {
    currentUser,
    events,
    registrations,
    registerForEvent,
    openPassModal,
    setActiveScreen,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showOnlyMyPasses, setShowOnlyMyPasses] = useState(false);

  // Student's registered event IDs
  const studentRegistrations = useMemo(() => {
    if (!currentUser) return [];
    return registrations.filter((r) => r.studentId === currentUser.id);
  }, [registrations, currentUser]);

  const registeredEventIdMap = useMemo(() => {
    const map = new Map<string, string>();
    studentRegistrations.forEach((r) => map.set(r.eventId, r.id));
    return map;
  }, [studentRegistrations]);

  const categories: string[] = ['All', 'Technical', 'Cultural', 'Workshops', 'Sports'];

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Filter by My Passes toggle
      if (showOnlyMyPasses && !registeredEventIdMap.has(evt.id)) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = evt.title.toLowerCase().includes(query);
        const matchVenue = evt.venue.toLowerCase().includes(query);
        const matchOrganizer = evt.organizerName.toLowerCase().includes(query);
        const matchCategory = evt.category.toLowerCase().includes(query);
        const matchTags = evt.tags.some((t) => t.toLowerCase().includes(query));
        return matchTitle || matchVenue || matchOrganizer || matchCategory || matchTags;
      }

      return true;
    });
  }, [events, selectedCategory, searchQuery, showOnlyMyPasses, registeredEventIdMap]);

  const handleRegisterClick = (eventId: string) => {
    registerForEvent(eventId);
  };

  const handleViewPassClick = (eventId: string) => {
    const reg = registrations.find(
      (r) => r.eventId === eventId && r.studentId === currentUser?.id
    );
    if (reg) {
      openPassModal(reg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* HEADER SECTION: Welcome banner & quick metrics */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Fall 2026 Campus Lineup
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Hello, {currentUser?.name?.split(' ')[0] || 'Scholar'}!
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Explore verified university events, secure your entry quota, and download tamper-proof QR passes instantly.
          </p>
        </div>

        {/* My Passes Quick Toggle Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOnlyMyPasses((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              showOnlyMyPasses
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200'
            }`}
          >
            <Ticket className="w-4 h-4 text-indigo-300" />
            <span>My Claimed Passes</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-md bg-indigo-900/80 text-indigo-200 font-mono text-[11px]">
              {studentRegistrations.length}
            </span>
          </button>
        </div>
      </div>

      {/* SEARCH BAR & CATEGORY FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, club, venue, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* FILTER STATUS NOTIFICATION (if filtered) */}
      {showOnlyMyPasses && (
        <div className="p-3 bg-indigo-950/40 border border-indigo-800/50 rounded-xl flex items-center justify-between text-xs text-indigo-200">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Showing only events you have registered for ({studentRegistrations.length} pass{studentRegistrations.length === 1 ? '' : 'es'}).</span>
          </div>
          <button
            onClick={() => setShowOnlyMyPasses(false)}
            className="underline font-semibold hover:text-white"
          >
            Show All Events
          </button>
        </div>
      )}

      {/* EVENT GRID: 3-column responsive layout */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center bg-slate-800/30 rounded-2xl border border-slate-800">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No events matched your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or reset the filters to see all campus events.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setShowOnlyMyPasses(false);
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs font-medium text-white transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isRegistered = registeredEventIdMap.has(evt.id);
            const remainingSeats = Math.max(0, evt.maxCapacity - evt.registeredCount);
            const isSoldOut = remainingSeats === 0;
            const isAlmostFull = remainingSeats > 0 && remainingSeats <= 5;
            const capacityPercent = Math.min(100, Math.round((evt.registeredCount / evt.maxCapacity) * 100));

            // Dynamic Category Styling
            let categoryBadgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
            if (evt.category === 'Cultural') {
              categoryBadgeColor = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
            } else if (evt.category === 'Workshops') {
              categoryBadgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            } else if (evt.category === 'Sports') {
              categoryBadgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            }

            return (
              <div
                key={evt.id}
                className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-slate-600 hover:shadow-xl hover:shadow-slate-950/50 group"
              >
                <div>
                  {/* Top Row: Category Pill Badge + Status Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${categoryBadgeColor}`}
                    >
                      {evt.category}
                    </span>

                    {/* Status Badge */}
                    {isRegistered ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Pass Active
                      </span>
                    ) : isSoldOut ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                        Sold Out
                      </span>
                    ) : isAlmostFull ? (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse">
                        Only {remainingSeats} left!
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {remainingSeats} seats available
                      </span>
                    )}
                  </div>

                  {/* Title (Bold H3) */}
                  <h3 className="text-lg font-bold text-white tracking-tight leading-snug group-hover:text-indigo-300 transition-colors">
                    {evt.title}
                  </h3>

                  {/* Organizer Subtitle */}
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Host: {evt.organizerName}
                  </p>

                  {/* Description preview */}
                  <p className="text-xs text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>

                  {/* Meta Row: Date & Time + Venue */}
                  <div className="mt-4 pt-4 border-t border-slate-700/60 space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span>{evt.date}</span>
                      <span className="text-slate-500">·</span>
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: Capacity Gauge & Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-700/60 space-y-3">
                  {/* Capacity Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] mb-1.5 font-medium">
                      <span className="text-slate-400">Capacity Filled</span>
                      <span className="text-slate-300 font-mono">
                        {evt.registeredCount} / {evt.maxCapacity} seats ({capacityPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-700/70 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSoldOut
                            ? 'bg-rose-500'
                            : isAlmostFull
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Action Buttons with exact 3-state logic */}
                  {isRegistered ? (
                    // State 3: Already Registered -> Secondary outlined button "View Pass" with green checkmark
                    <button
                      onClick={() => handleViewPassClick(evt.id)}
                      className="w-full py-2.5 px-4 rounded-xl border border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>View Entry Pass</span>
                    </button>
                  ) : isSoldOut ? (
                    // State 2: Sold Out -> Disabled state button
                    <button
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700/60 text-slate-500 text-xs font-semibold cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>Event Full / Closed</span>
                    </button>
                  ) : (
                    // State 1: Open -> Primary button "Register Now"
                    <button
                      onClick={() => handleRegisterClick(evt.id)}
                      className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/25 group/btn"
                    >
                      <span>Register Now</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
