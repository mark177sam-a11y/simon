import React from 'react';
import { Inbox, BarChart3, Database, Bell } from 'lucide-react';
import { triggerHaptic } from '../utils/calendar';

export type DeveloperTabId = 'feed' | 'analytics' | 'supabase';

interface AndroidBottomNavProps {
  activeTab: DeveloperTabId;
  onTabChange: (tab: DeveloperTabId) => void;
  pendingCount: number;
  totalCount: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onTabChange,
  pendingCount,
  totalCount
}) => {
  const tabs: { id: DeveloperTabId; label: string; icon: typeof Inbox; badge?: number }[] = [
    {
      id: 'feed',
      label: 'Bookings Feed',
      icon: Inbox,
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    {
      id: 'analytics',
      label: 'Pipeline & Stats',
      icon: BarChart3
    },
    {
      id: 'supabase',
      label: 'Supabase DB',
      icon: Database
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 px-3 py-1.5 max-w-xl mx-auto">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic();
                onTabChange(tab.id);
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl relative transition-all ${
                isActive ? 'text-cyan-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`relative px-4 py-1 rounded-full transition-all ${
                  isActive ? 'bg-cyan-500/15' : 'bg-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
