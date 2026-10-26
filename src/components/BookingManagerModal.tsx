import React, { useState } from 'react';
import { 
  X, 
  Database, 
  Search, 
  Download, 
  Mail, 
  Phone, 
  Trash2
} from 'lucide-react';
import { BookingRecord } from '../types';
import { triggerHaptic } from '../utils/calendar';

interface BookingManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onUpdateStatus: (bookingId: string, status: BookingRecord['status']) => void;
  onDeleteBooking: (bookingId: string) => void;
  currency: 'KSH' | 'USD';
  isSupabaseConnected: boolean;
  onOpenSupabase: () => void;
}

export const BookingManagerModal: React.FC<BookingManagerModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  currency,
  isSupabaseConnected,
  onOpenSupabase
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = bookings.filter((b) => {
    const q = query.toLowerCase();
    const match = 
      b.clientName.toLowerCase().includes(q) ||
      b.clientEmail.toLowerCase().includes(q) ||
      b.clientPhone.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.title.toLowerCase().includes(q);

    if (!match) return false;
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  const handleExportCSV = () => {
    triggerHaptic();
    const headers = [
      'Booking ID',
      'Title',
      'Client Name',
      'Email',
      'Phone',
      'Company',
      'Date',
      'Time Slot',
      'Meeting Format',
      'Status',
      'Estimated KSh',
      'Estimated USD',
      'Created At'
    ];

    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.title}"`,
      `"${b.clientName}"`,
      `"${b.clientEmail}"`,
      `"${b.clientPhone}"`,
      `"${b.clientCompany || ''}"`,
      `"${b.date}"`,
      `"${b.timeSlot}"`,
      `"${b.meetingFormat}"`,
      `"${b.status}"`,
      b.estimatedCostKSh,
      b.estimatedCostUSD,
      `"${b.createdAt}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `webstudios-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        {/* Grab handle */}
        <div className="w-full pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Database Bookings Manager</h3>
                <button
                  onClick={() => {
                    triggerHaptic();
                    onOpenSupabase();
                  }}
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border transition-colors ${
                    isSupabaseConnected 
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {isSupabaseConnected ? '⚡ Supabase Synced' : '+ Supabase'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {bookings.length} Total Records Synced Across Cloud Database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="p-4 border-b border-slate-800 space-y-2.5 shrink-0 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by client, ID, email..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={() => {
                triggerHaptic();
                onOpenSupabase();
              }}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-mono font-bold flex items-center gap-1 shrink-0"
              title="Open Supabase Project Configuration"
            >
              <span>⚡ Supabase</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0"
              title="Export all database bookings as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {['all', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  triggerHaptic();
                  setStatusFilter(status);
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium uppercase whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3 flex-1">
          {filtered.length > 0 ? (
            filtered.map((b) => (
              <div
                key={b.id}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-bold text-[11px]">{b.id}</span>
                      <span className="text-[10px] font-mono text-slate-400">· {b.date}</span>
                    </div>
                    <h4 className="font-bold text-white text-xs mt-0.5">{b.title}</h4>
                  </div>
                  <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-emerald-400">
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-xl">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{b.clientEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{b.clientPhone}</span>
                  </div>
                </div>

                {/* Status Updater & Delete Action */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500">Change Status:</span>
                    <select
                      value={b.status}
                      onChange={(e) => {
                        triggerHaptic();
                        onUpdateStatus(b.id, e.target.value as BookingRecord['status']);
                      }}
                      className="bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300 rounded px-1.5 py-0.5 focus:outline-none"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In-Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Delete booking record ${b.id} from database?`)) {
                        triggerHaptic();
                        onDeleteBooking(b.id);
                      }
                    }}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                    title="Delete record from database"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching records found in database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
