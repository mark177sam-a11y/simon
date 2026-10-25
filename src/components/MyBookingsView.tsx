import React, { useState } from 'react';
import { 
  Ticket, 
  Calendar as CalendarIcon, 
  Clock, 
  Download, 
  ExternalLink, 
  Video, 
  Phone, 
  Plus, 
  CheckCircle2, 
  QrCode,
  ArrowRight
} from 'lucide-react';
import { BookingRecord } from '../types';
import { downloadICS, getGoogleCalendarUrl, triggerHaptic } from '../utils/calendar';

interface MyBookingsViewProps {
  bookings: BookingRecord[];
  onOpenPass: (booking: BookingRecord) => void;
  onOpenNewBooking: () => void;
  currency: 'KSH' | 'USD';
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onOpenPass,
  onOpenNewBooking,
  currency
}) => {
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'completed'>('all');

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'all') return true;
    return b.status === filter;
  });

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">My Booking Passes</h2>
          <p className="text-xs text-slate-400">
            {bookings.length} verified project sessions & discovery slots
          </p>
        </div>
        <button
          onClick={() => {
            triggerHaptic();
            onOpenNewBooking();
          }}
          className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-800">
        {[
          { id: 'all', label: 'All Passes' },
          { id: 'confirmed', label: 'Upcoming' },
          { id: 'completed', label: 'Completed' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              triggerHaptic();
              setFilter(tab.id as typeof filter);
            }}
            className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-all ${
              filter === tab.id
                ? 'bg-slate-800 text-cyan-400 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="rounded-3xl bg-slate-900 border border-slate-800/90 p-4 space-y-3 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-cyan-400">
                      {b.id}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-full uppercase">
                      {b.status}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-white mt-1 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Client: {b.clientName} {b.clientCompany ? `(${b.clientCompany})` : ''}
                  </p>
                </div>

                <button
                  onClick={() => {
                    triggerHaptic();
                    onOpenPass(b);
                  }}
                  className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 hover:border-cyan-500 shrink-0 shadow-sm"
                  title="View Digital QR Pass"
                >
                  <QrCode className="w-5 h-5" />
                </button>
              </div>

              {/* Date & Mode Pill */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 rounded-2xl p-2.5 border border-slate-800/60">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CalendarIcon className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="font-mono text-[11px]">{b.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-[11px] truncate">{b.timeSlot.split('-')[0]}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="font-mono font-bold text-emerald-400">
                  {b.bookingType === 'discovery'
                    ? 'FREE Discovery'
                    : (currency === 'KSH' ? `KSh ${b.estimatedCostKSh.toLocaleString()}` : `$${b.estimatedCostUSD}`)}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => downloadICS(b)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Download .ics Calendar Invite"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => {
                      triggerHaptic();
                      onOpenPass(b);
                    }}
                    className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1"
                  >
                    <span>Open Pass</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 mx-auto flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No passes found</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            You don't have any sessions under this filter. Schedule a discovery call or website kickoff today.
          </p>
          <button
            onClick={() => {
              triggerHaptic();
              onOpenNewBooking();
            }}
            className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Book Free Discovery Call
          </button>
        </div>
      )}
    </div>
  );
};
