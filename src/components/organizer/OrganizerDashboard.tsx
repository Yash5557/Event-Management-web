import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { EventCategory, EventItem, Registration } from '../../types';
import {
  Plus,
  Users,
  Calendar,
  Layers,
  TrendingUp,
  Search,
  Download,
  Printer,
  X,
  MapPin,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const OrganizerDashboard: React.FC = () => {
  const {
    currentUser,
    events,
    registrations,
    createEvent,
    deleteEvent,
    toggleCheckIn,
    addToast,
    isCreateModalOpen,
    setIsCreateModalOpen,
    selectedRosterEventId,
    setSelectedRosterEventId,
  } = useApp();

  // Create Event Form Local State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EventCategory>('Technical');
  const [newDate, setNewDate] = useState('2026-11-15');
  const [newTime, setNewTime] = useState('10:00 AM - 04:00 PM');
  const [newVenue, setNewVenue] = useState('Dr. Radhakrishnan Auditorium');
  const [newDescription, setNewDescription] = useState('');
  const [newCapacity, setNewCapacity] = useState<number>(100);

  // Attendee drawer search
  const [rosterSearch, setRosterSearch] = useState('');

  // Computed metrics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + e.registeredCount, 0);
  const totalMaxCapacity = events.reduce((sum, e) => sum + e.maxCapacity, 0);
  const overallUtilization = totalMaxCapacity > 0 ? Math.round((totalRegistrations / totalMaxCapacity) * 100) : 0;

  // Selected event for Attendee Drawer
  const activeRosterEvent = useMemo(() => {
    return events.find((e) => e.id === selectedRosterEventId) || null;
  }, [events, selectedRosterEventId]);

  const activeRosterAttendees = useMemo(() => {
    if (!selectedRosterEventId) return [];
    return registrations.filter((r) => r.eventId === selectedRosterEventId);
  }, [registrations, selectedRosterEventId]);

  const filteredAttendees = useMemo(() => {
    if (!rosterSearch.trim()) return activeRosterAttendees;
    const query = rosterSearch.toLowerCase();
    return activeRosterAttendees.filter(
      (a) =>
        a.studentName.toLowerCase().includes(query) ||
        a.studentRollNumber.toLowerCase().includes(query) ||
        a.id.toLowerCase().includes(query)
    );
  }, [activeRosterAttendees, rosterSearch]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newVenue.trim()) {
      addToast('warning', 'Missing Fields', 'Please provide event title and venue.');
      return;
    }

    createEvent({
      title: newTitle,
      category: newCategory,
      date: newDate,
      time: newTime,
      venue: newVenue,
      description: newDescription || 'Official campus event for students and faculty members.',
      organizerName: currentUser?.name || 'Department of Student Affairs',
      organizerId: currentUser?.id || 'usr_organizer_1',
      maxCapacity: Number(newCapacity) || 50,
      tags: [newCategory, 'Campus2026'],
    });

    // Reset fields
    setNewTitle('');
    setNewDescription('');
    setNewCapacity(100);
  };

  const handleDownloadCSV = () => {
    if (!activeRosterEvent || activeRosterAttendees.length === 0) {
      addToast('warning', 'No Data to Export', 'There are no registered students for this event yet.');
      return;
    }

    const headers = ['Registration ID', 'Student Name', 'Roll Number', 'Email', 'Registered At', 'Check-In Status'];
    const rows = activeRosterAttendees.map((a) => [
      `"${a.id}"`,
      `"${a.studentName}"`,
      `"${a.studentRollNumber}"`,
      `"${a.studentEmail}"`,
      `"${new Date(a.registeredAt).toLocaleString()}"`,
      `"${a.checkInStatus}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeRosterEvent.title.replace(/\s+/g, '_')}_Attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Roster Exported', `CSV file generated with ${activeRosterAttendees.length} records.`);
  };

  const handlePrintRoster = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* SECTION A: Header & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Organizer Administration Console
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Event Quotas & Live Rosters
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervise department seating capacities, issue real-time updates, and verify gate check-ins.
          </p>
        </div>

        {/* CTA: Create New Event */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Event</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Stat 1: Total Events */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Total Events Published
            </p>
            <h3 className="text-3xl font-extrabold text-white mt-2 font-mono">{totalEvents}</h3>
            <span className="text-xs text-indigo-400 mt-1 inline-block">Active campus schedule</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 2: Total Registrations */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Total Passes Claimed
            </p>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">
              {totalRegistrations}
            </h3>
            <span className="text-xs text-slate-400 mt-1 inline-block">Across all college faculties</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Stat 3: Capacity Utilization */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Capacity Utilization
            </p>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-2 font-mono">
              {overallUtilization}%
            </h3>
            <span className="text-xs text-slate-400 mt-1 inline-block">
              {totalRegistrations} / {totalMaxCapacity} total seats filled
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION C: Manage Events & Attendee Roster Table */}
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Manage Events & Capacity Quotas
            </h2>
            <p className="text-xs text-slate-400">
              Select an event to view the live registered student roster or modify allocations.
            </p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {events.length} event records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-700/80 bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Event Title & Host</th>
                <th className="py-3.5 px-5 font-semibold">Date & Venue</th>
                <th className="py-3.5 px-5 font-semibold">Category</th>
                <th className="py-3.5 px-5 font-semibold">Capacity Quota</th>
                <th className="py-3.5 px-5 font-semibold">Status</th>
                <th className="py-3.5 px-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {events.map((evt) => {
                const remaining = Math.max(0, evt.maxCapacity - evt.registeredCount);
                const isSoldOut = remaining === 0;
                const percent = Math.min(100, Math.round((evt.registeredCount / evt.maxCapacity) * 100));

                let catBadge = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
                if (evt.category === 'Cultural') catBadge = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
                if (evt.category === 'Workshops') catBadge = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                if (evt.category === 'Sports') catBadge = 'text-amber-400 bg-amber-500/10 border-amber-500/20';

                return (
                  <tr
                    key={evt.id}
                    className="hover:bg-slate-700/30 transition-colors group"
                  >
                    {/* Event Title */}
                    <td className="py-4 px-5">
                      <div className="font-semibold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                        {evt.title}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{evt.organizerName}</div>
                    </td>

                    {/* Date & Venue */}
                    <td className="py-4 px-5 text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{evt.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        <span className="truncate max-w-[180px]">{evt.venue}</span>
                      </div>
                    </td>

                    {/* Category Badge */}
                    <td className="py-4 px-5">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${catBadge}`}>
                        {evt.category}
                      </span>
                    </td>

                    {/* Capacity Progress */}
                    <td className="py-4 px-5">
                      <div className="w-44">
                        <div className="flex justify-between text-xs mb-1 font-mono">
                          <span className="text-white font-medium">
                            {evt.registeredCount}/{evt.maxCapacity}
                          </span>
                          <span className="text-slate-400">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isSoldOut ? 'bg-rose-500' : percent > 85 ? 'bg-amber-500' : 'bg-indigo-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-5">
                      {isSoldOut ? (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                          Sold Out
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          Open ({remaining} left)
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedRosterEventId(evt.id)}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>View Attendee List</span>
                        </button>
                        <button
                          onClick={() => deleteEvent(evt.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION B: "Create Event" Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-tight">Create New Campus Event</h3>
                <p className="text-xs text-slate-400 mt-0.5">Configure event schedule, venue, and maximum seat capacity.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Event Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Apex AI Hackathon 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category & Capacity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EventCategory)}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Maximum Seat Capacity <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Nov 18, 2026"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time Slot</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 02:00 PM - 06:00 PM"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Venue */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Venue / Location <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  placeholder="e.g. Main Auditorium, West Wing Lab 2"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description & Guidelines
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide an overview of the event, eligibility, and what attendees must bring..."
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Actions: Publish Event (Primary) and Cancel (Ghost) */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/30 active:scale-[0.98]"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION D: Attendee Drawer / Slide-Over Modal */}
      {activeRosterEvent && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
          <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-700 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/90 flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-indigo-400 tracking-wider">
                  Live Attendee Roster
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight mt-1">
                  {activeRosterEvent.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2 font-mono">
                  <span>Registered: {activeRosterEvent.registeredCount} / {activeRosterEvent.maxCapacity}</span>
                  <span>·</span>
                  <span className="text-emerald-400">
                    Remaining: {Math.max(0, activeRosterEvent.maxCapacity - activeRosterEvent.registeredCount)} seats
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRosterEventId(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Roster Controls: Search & CSV / Print */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  placeholder="Filter attendees by name, roll no, or ID..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadCSV}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Download CSV</span>
                </button>
                <button
                  onClick={handlePrintRoster}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-400" />
                  <span>Print</span>
                </button>
              </div>
            </div>

            {/* Roster List Table */}
            <div className="flex-1 overflow-y-auto p-4">
              {filteredAttendees.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No registered attendees found matching the query.
                </div>
              ) : (
                <div className="border border-slate-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                        <th className="py-2.5 px-3 font-semibold">Pass ID</th>
                        <th className="py-2.5 px-3 font-semibold">Student Name</th>
                        <th className="py-2.5 px-3 font-semibold">Roll Number</th>
                        <th className="py-2.5 px-3 font-semibold">Registered At</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Gate Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredAttendees.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-mono text-indigo-300 font-medium">
                            {att.id}
                          </td>
                          <td className="py-3 px-3 font-semibold text-white">
                            {att.studentName}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-300">
                            {att.studentRollNumber}
                          </td>
                          <td className="py-3 px-3 text-slate-400">
                            {new Date(att.registeredAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={() => toggleCheckIn(att.id)}
                              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-all ${
                                att.checkInStatus === 'Checked-in'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                              }`}
                            >
                              {att.checkInStatus}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
              <span>Showing {filteredAttendees.length} of {activeRosterAttendees.length} records</span>
              <button
                onClick={() => setSelectedRosterEventId(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
