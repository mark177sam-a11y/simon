import React from 'react';
import { LayoutGrid, Sliders, CalendarPlus, Ticket, MessageCircle } from 'lucide-react';
import { AndroidTheme } from './AndroidFrame';
import { triggerHaptic } from '../utils/calendar';

export type NavTabId = 'sectors' | 'quote' | 'book' | 'bookings' | 'contact';

interface AndroidBottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  bookingCount: number;
  activeTheme: AndroidTheme;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onTabChange,
  bookingCount,
  activeTheme
}) => {
  const tabs = [
    {
      id: 'sectors' as NavTabId,
      label: 'Packages',
      icon: LayoutGrid,
    },
    {
      id: 'quote' as NavTabId,
      label: 'Calculator',
      icon: Sliders,
    },
    {
      id: 'book' as NavTabId,
      label: 'Book Now',
      icon: CalendarPlus,
      highlight: true
    },
    {
      id: 'bookings' as NavTabId,
      label: 'Bookings',
      icon: Ticket,
      badge: bookingCount
    },
    {
      id: 'contact' as NavTabId,
      label: 'Contact',
      icon: MessageCircle,
    },
  ];

  const themeAccentHex: Record<AndroidTheme, string> = {
    cyan: '#06b6d4',
    emerald: '#10b981',
    violet: '#a855f7',
    amber: '#f59e0b',
    slate: '#38bdf8'
  };

  const handleSelect = (tabId: NavTabId) => {
    triggerHaptic();
    onTabChange(tabId);
  };

  return (
    <nav className="sticky bottom-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-900/80 px-2 py-1 select-none">
      <div className="grid grid-cols-5 items-center h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              className="group relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all"
            >
              {/* Material You Active Pill Indicator */}
              <div
                className={`flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? 'w-14 h-7 rounded-full shadow-sm'
                    : 'w-10 h-7 rounded-full group-hover:bg-slate-900'
                }`}
                style={{
                  backgroundColor: isActive
                    ? `${themeAccentHex[activeTheme]}25`
                    : 'transparent'
                }}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'scale-110' : 'scale-100 text-slate-400 group-hover:text-slate-200'
                    }`}
                    style={{
                      color: isActive ? themeAccentHex[activeTheme] : undefined
                    }}
                  />
                  {tab.badge && tab.badge > 0 ? (
                    <span 
                      className="absolute -top-1.5 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold text-slate-950 flex items-center justify-center min-w-[14px] h-[14px]"
                      style={{ backgroundColor: themeAccentHex[activeTheme] }}
                    >
                      {tab.badge}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Tab Label */}
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 transition-colors ${
                  isActive
                    ? 'font-bold text-white'
                    : 'text-slate-400 group-hover:text-slate-300'
                }`}
                style={{
                  color: isActive ? themeAccentHex[activeTheme] : undefined
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
