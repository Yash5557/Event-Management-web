import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useApp } from '../../context/AppContext';
import {
  Download,
  Printer,
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Share2,
} from 'lucide-react';

export const DigitalPassModal: React.FC = () => {
  const { activePass, closePassModal, addToast } = useApp();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isCopied, setIsCopied] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activePass) return;

    // Generate high-resolution verifiable QR code
    const payload = JSON.stringify({
      regId: activePass.id,
      event: activePass.eventTitle,
      student: activePass.studentName,
      rollNo: activePass.studentRollNumber,
      venue: activePass.eventVenue,
      issuedAt: activePass.registeredAt,
      verifiedSignature: `UNI-GATE-KEY-${activePass.id.slice(-4)}`,
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [activePass]);

  if (!activePass) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    // Download verifiable pass summary text or pass image
    const element = document.createElement('a');
    element.href = qrDataUrl;
    element.download = `${activePass.id}-${activePass.studentRollNumber}-pass-qr.png`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    addToast('success', 'Pass QR Code Saved', 'Your QR entry pass image has been downloaded.');
  };

  const handleCopyPassId = () => {
    navigator.clipboard.writeText(activePass.id);
    setIsCopied(true);
    addToast('info', 'Pass ID Copied', `${activePass.id} copied to clipboard.`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formattedDate = new Date(activePass.registeredAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto no-print-backdrop">
      <div className="relative w-full max-w-md my-8">
        {/* Floating close button */}
        <button
          onClick={closePassModal}
          className="absolute -top-12 right-0 text-slate-400 hover:text-white p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors z-20 flex items-center gap-1.5 text-xs font-medium no-print"
          aria-label="Close pass dialog"
        >
          <span>Close</span>
          <X className="w-4 h-4" />
        </button>

        {/* The Realistic Perforated Ticket Card */}
        <div
          id="printable-pass"
          ref={ticketRef}
          className="relative bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 transition-transform duration-200"
        >
          {/* TOP SECTION: Event Branding & Primary Details */}
          <div className="relative p-6 sm:p-7 bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 text-white overflow-hidden">
            {/* Subtle background circuit pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* University / Portal Top Bar */}
            <div className="relative flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <GraduationCap className="w-5 h-5 text-indigo-100" />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-200 block">
                    CampusPass Portal
                  </span>
                  <span className="text-xs font-semibold text-white/90">Apex University</span>
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/25 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Official Entry Pass
              </span>
            </div>

            {/* Category text kicker & Event Title */}
            <div className="relative mt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-200">
                {activePass.eventCategory} Event
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1 leading-snug">
                {activePass.eventTitle}
              </h2>
            </div>

            {/* Event Time & Venue Meta Box */}
            <div className="relative grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-indigo-500/40 text-xs">
              <div className="flex items-start gap-1.5 text-indigo-100">
                <Calendar className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase text-indigo-300 font-semibold tracking-wider">Date</p>
                  <p className="font-semibold text-white">{activePass.eventDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-indigo-100">
                <Clock className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase text-indigo-300 font-semibold tracking-wider">Time</p>
                  <p className="font-semibold text-white">{activePass.eventTime}</p>
                </div>
              </div>
              <div className="col-span-2 flex items-start gap-1.5 text-indigo-100 mt-1">
                <MapPin className="w-4 h-4 text-indigo-300 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] uppercase text-indigo-300 font-semibold tracking-wider">Venue / Hall</p>
                  <p className="font-semibold text-white">{activePass.eventVenue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE PERFORATED DIVIDER (with semi-circle cutouts on left and right edges) */}
          <div className="relative h-6 bg-slate-50 flex items-center justify-center overflow-hidden">
            {/* Left cutout notch */}
            <div className="absolute -left-3.5 w-7 h-7 bg-slate-950 rounded-full border border-slate-300 shadow-inner" />
            {/* Dashed perforation line */}
            <div className="w-full border-b-2 border-dashed border-slate-300 mx-5" />
            {/* Right cutout notch */}
            <div className="absolute -right-3.5 w-7 h-7 bg-slate-950 rounded-full border border-slate-300 shadow-inner" />
          </div>

          {/* BOTTOM SECTION: Attendee & Verification Details */}
          <div className="p-6 sm:p-7 bg-slate-50 text-slate-900">
            {/* Student Meta Details */}
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Attendee Name</p>
                <p className="text-base font-bold text-slate-900 mt-0.5 truncate">{activePass.studentName}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Roll / Student ID</p>
                <p className="text-sm font-bold text-slate-900 font-mono mt-0.5">{activePass.studentRollNumber}</p>
              </div>
            </div>

            {/* Registration ID & Copy */}
            <div className="mt-4 flex items-center justify-between bg-indigo-50/70 border border-indigo-100 rounded-xl px-3.5 py-2.5">
              <div>
                <p className="text-[10px] font-semibold uppercase text-indigo-700 tracking-wider">Registration Pass ID</p>
                <p className="text-base font-bold font-mono text-indigo-950 tracking-tight">{activePass.id}</p>
              </div>
              <button
                onClick={handleCopyPassId}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-700 transition-colors flex items-center gap-1"
                title="Copy Pass ID"
              >
                {isCopied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Centered Dynamic QR Code */}
            <div className="mt-5 flex flex-col items-center justify-center text-center">
              <div className="p-3 bg-white rounded-2xl border-2 border-slate-200 shadow-sm flex items-center justify-center">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`Entry QR code for ${activePass.id}`}
                    className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                    Generating dynamic QR pass...
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Scan this QR code at the entrance turnstile
              </p>
            </div>

            {/* Pass Metadata Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <span>Booked on: {formattedDate}</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Valid Ticket
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 grid grid-cols-2 gap-3 no-print">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/25 active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Download Pass</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-sm border border-slate-700 transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span>Print Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
};
