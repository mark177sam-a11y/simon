import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Globe2, X, Check, ArrowRight } from 'lucide-react';
import { AndroidTheme } from './AndroidFrame';

interface AndroidTopBarProps {
  currency: 'KSH' | 'USD';
  onCurrencyToggle: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  bookingCount: number;
  onOpenMyBookings: () => void;
  activeTheme: AndroidTheme;
}

export const AndroidTopBar: React.FC<AndroidTopBarProps> = ({
  currency,
  onCurrencyToggle,
  searchQuery,
  onSearchChange,
  bookingCount,
  onOpenMyBookings,
  activeTheme
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const themeAccentHex: Record<AndroidTheme, string> = {
    cyan: '#06b6d4',
    emerald: '#10b981',
    violet: '#a855f7',
    amber: '#f59e0b',
    slate: '#38bdf8'
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-900 px-4 py-2.5">
        {!isSearching ? (
          <div className="flex items-center justify-between gap-3">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm text-slate-950 shadow-sm"
                style={{ backgroundColor: themeAccentHex[activeTheme] }}
              >
                W
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm font-bold tracking-tight text-white truncate">Webstudios</h1>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-wider font-semibold">.world</span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Hand-Coded · Sub-Second Sites</p>
              </div>
            </div>

            {/* Right: Currency Toggle, Search & Notifications */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Currency Selector */}
              <button
                onClick={onCurrencyToggle}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
                title="Switch currency between Kenyan Shillings (KSh) and US Dollars ($)"
              >
                <span className="text-slate-500">$</span>
                <span className="font-semibold text-cyan-400">{currency}</span>
              </button>

              {/* Search Toggle */}
              <button
                onClick={() => setIsSearching(true)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="Search sectors and packages"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Notifications / Booking Status */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {bookingCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-slate-950 flex items-center justify-center"
                    style={{ backgroundColor: themeAccentHex[activeTheme] }}
                  >
                    {bookingCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Search Bar active state */
          <div className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search web packages, M-Pesa stores, redesigns..."
                autoFocus
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setIsSearching(false);
                onSearchChange('');
              }}
              className="text-xs text-slate-400 hover:text-white font-medium px-2 py-1"
            >
              Cancel
            </button>
          </div>
        )}
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-16">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {bookingCount > 0 ? (
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-200">{bookingCount} Active Studio Booking{bookingCount > 1 ? 's' : ''}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Your scheduled session{bookingCount > 1 ? 's are' : ' is'} synced with Firestore cloud database.
                    </p>
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        onOpenMyBookings();
                      }}
                      className="mt-2 text-[11px] font-semibold text-cyan-400 flex items-center gap-1 hover:underline"
                    >
                      <span>View in Passes</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-400 text-center">
                  No pending alerts. Cloud database connected and synchronized.
                </div>
              )}

              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                  99+
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-200">Sub-Second Mobile Guarantee</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    All Webstudios sites are hand-coded with zero bloated WordPress/Wix plugins for top Google ranking.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowNotifications(false)}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
