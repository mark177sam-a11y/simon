import React from 'react';
import { Database, Plus, DollarSign, Bell } from 'lucide-react';

interface AndroidTopBarProps {
  currency: 'KSH' | 'USD';
  onCurrencyToggle: () => void;
  bookingCount: number;
  pendingCount: number;
  isSupabaseConnected: boolean;
  onOpenSupabase: () => void;
  onOpenManualEntry: () => void;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  currency,
  onCurrencyToggle,
  bookingCount,
  pendingCount,
  isSupabaseConnected,
  onOpenSupabase,
  onOpenManualEntry
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-900 px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand Identity as Developer Dashboard */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-cyan-500 flex items-center justify-center font-black text-sm text-slate-950 shadow-sm shrink-0">
            W
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold tracking-tight text-white truncate">Webstudios</h1>
              <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-semibold">Dashboard</span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">Bookings & Realtime Dispatch</p>
          </div>
        </div>

        {/* Right: Supabase Connection, Pending Badge, Currency Toggle, Quick Intake */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabase}
            className={`px-2 py-1 rounded-lg border text-[11px] font-mono flex items-center gap-1.5 transition-colors ${
              isSupabaseConnected
                ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/60'
                : 'bg-amber-950/60 border-amber-800/80 text-amber-300 hover:bg-amber-900/60'
            }`}
            title={isSupabaseConnected ? 'Supabase Connected & Realtime Active' : 'Configure Supabase Connection'}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="font-semibold">Supabase</span>
          </button>

          {/* Pending Alerts Indicator */}
          {pendingCount > 0 && (
            <div 
              className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1"
              title={`${pendingCount} pending inquiries awaiting your confirmation`}
            >
              <Bell className="w-3 h-3 text-amber-400 animate-bounce" />
              <span>{pendingCount}</span>
            </div>
          )}

          {/* Currency Switcher */}
          <button
            onClick={onCurrencyToggle}
            className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
            title="Switch currency between Kenyan Shillings (KSh) and US Dollars ($)"
          >
            <span className="text-slate-500">$</span>
            <span className="font-semibold text-cyan-400">{currency}</span>
          </button>

          {/* Quick Intake Button */}
          <button
            onClick={onOpenManualEntry}
            className="w-8 h-8 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-950/40 transition-colors"
            title="Log manual client inquiry"
            aria-label="Add booking intake"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
