import React, { useState } from 'react';
import { 
  Inbox, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink, 
  Calendar, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  Filter, 
  X, 
  ChevronRight, 
  Plus, 
  ShieldAlert, 
  DollarSign, 
  Check, 
  Send,
  Zap,
  Tag,
  ArrowUpRight,
  SlidersHorizontal,
  Bell,
  Volume2,
  VolumeX
} from 'lucide-react';
import { BookingRecord, BookingStatus } from '../types';
import { triggerHaptic } from '../utils/calendar';

interface DeveloperDashboardProps {
  bookings: BookingRecord[];
  onUpdateStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  onDeleteBooking: (bookingId: string) => Promise<void>;
  onOpenSupabase: () => void;
  onOpenManualEntry: () => void;
  onSendTestBooking: () => Promise<void>;
  isSupabaseConnected: boolean;
  currency: 'KSH' | 'USD';
  latestIncomingBooking: BookingRecord | null;
  onDismissIncomingAlert: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onOpenSupabase,
  onOpenManualEntry,
  onSendTestBooking,
  isSupabaseConnected,
  currency,
  latestIncomingBooking,
  onDismissIncomingAlert,
  soundEnabled,
  onToggleSound
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Status counts
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in-progress').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  // Pipeline calculations
  const totalPipelineKSh = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.estimatedCostKSh || 0), 0);

  const totalPipelineUSD = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.estimatedCostUSD || 0), 0);

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    // Status filter
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    // Search query filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.clientName.toLowerCase().includes(q) ||
      b.clientEmail.toLowerCase().includes(q) ||
      (b.clientPhone && b.clientPhone.toLowerCase().includes(q)) ||
      (b.clientCompany && b.clientCompany.toLowerCase().includes(q)) ||
      (b.planName && b.planName.toLowerCase().includes(q)) ||
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.notes && b.notes.toLowerCase().includes(q)) ||
      b.id.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (bookingId: string, nextStatus: BookingStatus) => {
    triggerHaptic();
    setUpdatingId(bookingId);
    try {
      await onUpdateStatus(bookingId, nextStatus);
      if (selectedBooking && selectedBooking.id === bookingId) {
        setSelectedBooking((prev) => (prev ? { ...prev, status: nextStatus } : null));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleTestPush = async () => {
    triggerHaptic();
    setIsSendingTest(true);
    try {
      await onSendTestBooking();
    } finally {
      setIsSendingTest(false);
    }
  };

  const formatPrice = (b: BookingRecord) => {
    if (currency === 'KSH') {
      return `KSh ${(b.estimatedCostKSh || 0).toLocaleString()}`;
    }
    return `$${(b.estimatedCostUSD || 0).toLocaleString()}`;
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending Review
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Check className="w-3 h-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <X className="w-3 h-3" />
            Cancelled
          </span>
        );
    }
  };

  const getCleanPhoneForWhatsApp = (phone?: string) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.substring(1);
    }
    return cleaned;
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-24 text-slate-100">
      {/* Realtime Incoming Alert Banner (shows when Supabase pushes a new booking) */}
      {latestIncomingBooking && (
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950 via-slate-900 to-emerald-950 border border-cyan-500/50 p-3.5 shadow-2xl relative animate-bounce-short">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/30 text-cyan-300 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4 animate-wiggle" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800">
                    Supabase Push Received
                  </span>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1">
                  {latestIncomingBooking.clientName} selected{' '}
                  <span className="text-cyan-300 font-extrabold">{latestIncomingBooking.planName || latestIncomingBooking.title}</span>
                </h4>
                <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                  {latestIncomingBooking.clientPhone || latestIncomingBooking.clientEmail} · {latestIncomingBooking.date} ({latestIncomingBooking.timeSlot})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => {
                  triggerHaptic();
                  setSelectedBooking(latestIncomingBooking);
                  onDismissIncomingAlert();
                }}
                className="px-2.5 py-1 rounded-lg bg-cyan-500 text-slate-950 font-bold text-[11px] hover:bg-cyan-400"
              >
                Review
              </button>
              <button
                onClick={onDismissIncomingAlert}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                title="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-400">
              DEVELOPER ADMIN
            </span>
            <button
              onClick={() => {
                triggerHaptic();
                onOpenSupabase();
              }}
              className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5 border transition-all ${
                isSupabaseConnected
                  ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-300 hover:bg-emerald-900/80'
                  : 'bg-amber-950/80 border-amber-700/80 text-amber-300 hover:bg-amber-900/80'
              }`}
              title="Click to configure or test Supabase connection"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isSupabaseConnected ? 'Supabase Realtime Synced' : 'Supabase Setup Needed'}</span>
            </button>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight">
            Bookings & Inquiries Dispatch
          </h2>
          <p className="text-xs text-slate-400">
            Real-time feed of incoming website inquiries, plan selections, and client bookings.
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <button
            onClick={() => {
              triggerHaptic();
              onToggleSound();
            }}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-cyan-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title={soundEnabled ? 'Push chime enabled' : 'Push chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={handleTestPush}
            disabled={isSendingTest}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
            title="Simulate a client booking submission on Supabase"
          >
            <Send className={`w-3.5 h-3.5 text-cyan-400 ${isSendingTest ? 'animate-spin' : ''}`} />
            <span>{isSendingTest ? 'Pushing...' : 'Test Push'}</span>
          </button>

          <button
            onClick={() => {
              triggerHaptic();
              onOpenManualEntry();
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:opacity-95 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40 active:scale-95 transition-all"
            title="Record direct phone call or WhatsApp inquiry"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Record Intake</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Total Inquiries</span>
            <Inbox className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white font-mono">{bookings.length}</div>
          <span className="text-[10px] text-slate-500">All recorded</span>
        </div>

        <div className={`p-3.5 rounded-2xl border shadow-md transition-colors ${
          pendingCount > 0
            ? 'bg-amber-950/30 border-amber-500/40'
            : 'bg-slate-900 border-slate-800/90'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Pending Review</span>
            <AlertCircle className={`w-4 h-4 ${pendingCount > 0 ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          </div>
          <div className={`text-xl font-black font-mono ${pendingCount > 0 ? 'text-amber-300' : 'text-white'}`}>
            {pendingCount}
          </div>
          <span className="text-[10px] text-slate-500">Needs your confirmation</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Confirmed & Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400 font-mono">
            {confirmedCount + inProgressCount}
          </div>
          <span className="text-[10px] text-slate-500">{confirmedCount} confirmed · {inProgressCount} in build</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800/90 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-medium">Active Pipeline</span>
            <DollarSign className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-black text-white font-mono truncate">
            {currency === 'KSH' ? `KSh ${totalPipelineKSh.toLocaleString()}` : `$${totalPipelineUSD.toLocaleString()}`}
          </div>
          <span className="text-[10px] text-slate-500">Selected plan quotes</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="space-y-2">
        {/* Search */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by client name, email, phone, company, plan name, or ID..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-9 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'pending', label: `Pending (${pendingCount})`, highlight: pendingCount > 0 },
            { id: 'confirmed', label: `Confirmed (${confirmedCount})` },
            { id: 'in-progress', label: `In Progress (${inProgressCount})` },
            { id: 'completed', label: `Completed (${completedCount})` },
            { id: 'cancelled', label: `Cancelled (${cancelledCount})` }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                triggerHaptic();
                setStatusFilter(item.id as typeof statusFilter);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                statusFilter === item.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : item.highlight
                    ? 'bg-amber-950/60 border border-amber-600/70 text-amber-300'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Feed */}
      <div className="space-y-3">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => {
            const cleanPhone = getCleanPhoneForWhatsApp(b.clientPhone);
            const planDisplay = b.planName || b.title;

            return (
              <div
                key={b.id}
                className={`rounded-3xl bg-slate-900 border p-4 space-y-3.5 relative shadow-lg transition-all hover:border-slate-700 ${
                  b.status === 'pending'
                    ? 'border-amber-500/40 bg-gradient-to-b from-slate-900 to-amber-950/10'
                    : 'border-slate-800/90'
                }`}
              >
                {/* Top Row: Client Name, Plan Tag, Status Badge, Price */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-white tracking-tight truncate">
                        {b.clientName}
                      </h3>
                      {b.clientCompany && (
                        <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md truncate max-w-[150px]">
                          {b.clientCompany}
                        </span>
                      )}
                    </div>
                    
                    {/* Plan Badge */}
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-cyan-950/90 border border-cyan-800 text-cyan-300 flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5 text-cyan-400" />
                        <span>{planDisplay}</span>
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        ID: {b.id}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge & Price */}
                  <div className="text-right shrink-0 space-y-1">
                    <div>{getStatusBadge(b.status)}</div>
                    <div className="text-xs font-black font-mono text-emerald-400">
                      {formatPrice(b)}
                    </div>
                  </div>
                </div>

                {/* Details Row: Date, Time slot, Meeting format, M-Pesa */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800/70 text-[11px]">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Date & Slot</span>
                    <span className="text-slate-200 font-medium">{b.date}</span>
                    <span className="block text-slate-400 text-[10px]">{b.timeSlot}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Meeting Format</span>
                    <span className="text-slate-200 capitalize font-medium">
                      {b.meetingFormat.replace('-', ' ')}
                    </span>
                    <span className="block text-slate-400 text-[10px]">30-45 mins</span>
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block text-[9px] uppercase font-mono">Payment / Ref</span>
                    {b.mpesaRef ? (
                      <span className="text-emerald-400 font-mono text-[10px] font-bold">
                        M-Pesa: {b.mpesaRef}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Quote stage</span>
                    )}
                  </div>
                </div>

                {/* Client Notes / Requirements excerpt if provided */}
                {b.notes && (
                  <div className="text-[11px] text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 italic leading-relaxed">
                    "{b.notes}"
                  </div>
                )}

                {/* Developer Actions Row: WhatsApp, Call, Email, Status Dropdown, Details */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 flex-wrap">
                  {/* Client Direct Reach buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hi ${b.clientName}, this is Mark from Webstudios.world regarding your booking/inquiry for the ${planDisplay}. When is a good time to connect?`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={triggerHaptic}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}

                    {b.clientPhone && (
                      <a
                        href={`tel:${b.clientPhone}`}
                        onClick={triggerHaptic}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                        title="Call client phone directly"
                      >
                        <Phone className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Call</span>
                      </a>
                    )}

                    {b.clientEmail && (
                      <a
                        href={`mailto:${b.clientEmail}?subject=${encodeURIComponent(
                          `Webstudios.world - Regarding your booking for ${planDisplay}`
                        )}`}
                        onClick={triggerHaptic}
                        className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Send email"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Status update & View Modal */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    {/* Fast Status Selector */}
                    <select
                      value={b.status}
                      disabled={updatingId === b.id}
                      onChange={(e) => handleStatusChange(b.id, e.target.value as BookingStatus)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => {
                        triggerHaptic();
                        setSelectedBooking(b);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                      title="View all details"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        triggerHaptic();
                        if (confirm(`Delete booking ${b.id} for ${b.clientName}?`)) {
                          onDeleteBooking(b.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                      title="Delete booking"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 mx-auto flex items-center justify-center">
              <Inbox className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {searchQuery || statusFilter !== 'all'
                  ? 'No matching inquiries found'
                  : 'Waiting for incoming client bookings'}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 leading-relaxed">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your search keywords or status filter pills.'
                  : 'When clients submit an inquiry or select a pricing plan on webstudios.world, it will immediately push here in real-time from Supabase.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={handleTestPush}
                disabled={isSendingTest}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-950/40 active:scale-95 transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isSendingTest ? 'Generating...' : 'Push Sample Test Booking'}</span>
              </button>

              <button
                onClick={() => {
                  triggerHaptic();
                  onOpenSupabase();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700"
              >
                Check Supabase
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Full Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar space-y-4 text-slate-100">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {selectedBooking.id}
                  </span>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedBooking.clientName}
                </h3>
                {selectedBooking.clientCompany && (
                  <p className="text-xs text-slate-400">{selectedBooking.clientCompany}</p>
                )}
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Plan Details */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                Plan / Package Selection
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">
                  {selectedBooking.planName || selectedBooking.title}
                </span>
                <span className="text-sm font-black font-mono text-emerald-400">
                  {formatPrice(selectedBooking)}
                </span>
              </div>
              {selectedBooking.addons && selectedBooking.addons.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 block mb-1">Add-ons requested:</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedBooking.addons.map((a, i) => (
                      <span key={i} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Client Contact Info */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                Client Contact Information
              </span>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Email:</span>
                  <a href={`mailto:${selectedBooking.clientEmail}`} className="text-cyan-400 hover:underline">
                    {selectedBooking.clientEmail}
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <a href={`tel:${selectedBooking.clientPhone}`} className="text-emerald-400 font-mono hover:underline">
                    {selectedBooking.clientPhone || 'Not provided'}
                  </a>
                </div>
                {selectedBooking.meetingFormat && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Format:</span>
                    <span className="text-white capitalize">{selectedBooking.meetingFormat.replace('-', ' ')}</span>
                  </div>
                )}
                {selectedBooking.meetUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Meeting Link:</span>
                    <a href={selectedBooking.meetUrl} target="_blank" rel="noreferrer" className="text-cyan-400 text-[11px] underline truncate max-w-[200px]">
                      {selectedBooking.meetUrl}
                    </a>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Submitted at:</span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(selectedBooking.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
                  Client Project Scope & Notes
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedBooking.notes}
                </p>
              </div>
            )}

            {/* Status change actions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold block">
                Update Booking Status
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {(['pending', 'confirmed', 'in-progress', 'completed'] as BookingStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedBooking.id, st)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                      selectedBooking.status === st
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    {st.replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
