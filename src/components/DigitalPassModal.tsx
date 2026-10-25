import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Download, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  Share2, 
  Check, 
  Copy,
  Video,
  Phone,
  MessageSquare
} from 'lucide-react';
import { BookingRecord } from '../types';
import { QRCodeDisplay } from './QRCodeDisplay';
import { downloadICS, getGoogleCalendarUrl, triggerHaptic } from '../utils/calendar';

interface DigitalPassModalProps {
  booking: BookingRecord | null;
  onClose: () => void;
  onCancelBooking: (id: string) => void;
  onRescheduleBooking: (id: string, newDate: string, newTime: string) => void;
  currency: 'KSH' | 'USD';
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  booking,
  onClose,
  onCancelBooking,
  onRescheduleBooking,
  currency
}) => {
  if (!booking) return null;

  const [copied, setCopied] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState(booking.date);
  const [newTime, setNewTime] = useState(booking.timeSlot);

  const handleCopyLink = () => {
    triggerHaptic();
    navigator.clipboard.writeText(
      `Webstudios Booking: ${booking.title} (ID: ${booking.id}) - Date: ${booking.date} at ${booking.timeSlot}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = async () => {
    triggerHaptic();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Webstudios: ${booking.title}`,
          text: `Booking Pass ${booking.id} on ${booking.date} at ${booking.timeSlot}`,
          url: 'https://webstudios.world',
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleConfirmReschedule = () => {
    triggerHaptic();
    onRescheduleBooking(booking.id, newDate, newTime);
    setIsRescheduling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        {/* Grab handle */}
        <div className="w-full pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-sm font-bold text-white">Google Wallet Style Pass</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4">
          {!isRescheduling ? (
            <>
              {/* Pass Ticket Design */}
              <div className="rounded-3xl bg-slate-950 border border-slate-800/90 p-4 relative overflow-hidden shadow-lg">
                {/* Top Notch decorative indicator */}
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-cyan-400 font-semibold block">
                      WEBSTUDIOS VERIFIED PASS
                    </span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{booking.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-md font-bold">
                      {booking.id}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 my-3.5 text-xs">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Client Name</span>
                    <span className="font-semibold text-slate-200">{booking.clientName}</span>
                    <span className="block text-[10px] text-slate-400 truncate">{booking.clientCompany}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Meeting Mode</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {booking.meetingFormat === 'google-meet' ? (
                        <Video className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                      <span className="font-semibold text-slate-200 capitalize">
                        {booking.meetingFormat.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Date & Time</span>
                    <span className="font-semibold text-slate-200">{booking.date}</span>
                    <span className="block text-[11px] text-slate-400 font-mono">{booking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">Est. Budget</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {booking.bookingType === 'discovery'
                        ? 'FREE Discovery'
                        : (currency === 'KSH' ? `KSh ${booking.estimatedCostKSh.toLocaleString()}` : `$${booking.estimatedCostUSD}`)}
                    </span>
                    <span className="block text-[10px] text-slate-400">Fixed Contract</span>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="my-3 flex justify-center">
                  <QRCodeDisplay token={booking.qrCodeToken} size={140} label={`ID: ${booking.id}`} />
                </div>

                {/* Link / Call detail */}
                <div className="pt-2 border-t border-dashed border-slate-800 text-center">
                  {booking.meetUrl ? (
                    <a
                      href={booking.meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-cyan-400 hover:underline flex items-center justify-center gap-1"
                    >
                      <span>Join Google Meet Room</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 font-mono">
                      Direct WhatsApp / Phone: +254 728 423 472
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getGoogleCalendarUrl(booking)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Google Calendar</span>
                </a>
                <button
                  type="button"
                  onClick={() => downloadICS(booking)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save .ICS</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-purple-400" />}
                  <span>{copied ? 'Copied!' : 'Share Pass'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRescheduling(true)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>Reschedule</span>
                </button>
              </div>

              {/* Cancel Action */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this booking session?')) {
                    onCancelBooking(booking.id);
                    onClose();
                  }
                }}
                className="w-full py-2 text-xs font-medium text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Cancel this Booking</span>
              </button>
            </>
          ) : (
            /* Reschedule Sub-flow */
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-white">Select New Date & Time Slot:</h4>
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">New Date (YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">New Slot</label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="09:30 AM - 10:00 AM">09:30 AM - 10:00 AM</option>
                  <option value="11:00 AM - 11:30 AM">11:00 AM - 11:30 AM</option>
                  <option value="02:00 PM - 02:30 PM">02:00 PM - 02:30 PM</option>
                  <option value="03:30 PM - 04:00 PM">03:30 PM - 04:00 PM</option>
                  <option value="05:00 PM - 05:30 PM">05:00 PM - 05:30 PM</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescheduling(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReschedule}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 text-xs font-bold shadow"
                >
                  Save Reschedule
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
