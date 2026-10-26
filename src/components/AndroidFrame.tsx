import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium } from 'lucide-react';

export type AndroidTheme = 'cyan' | 'emerald' | 'violet' | 'amber' | 'slate';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTheme: AndroidTheme;
  onThemeChange: (theme: AndroidTheme) => void;
  onNavigateHome?: () => void;
  onNavigateBack?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  onNavigateHome,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('11:08');

  // Keep Android status bar time synced to real local time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const formatted = `${hours % 12 || 12}:${minutes}`;
      setCurrentTime(formatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center selection:bg-cyan-500 selection:text-slate-950">
      {/* Mobile-first centered app container without fake hardware simulation clutter */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[880px] sm:max-h-[920px] bg-slate-950 flex flex-col relative sm:border-x sm:border-slate-800/80 sm:shadow-2xl sm:rounded-[36px] overflow-hidden">
        {/* Android System Status Bar */}
        <div className="w-full h-10 shrink-0 px-5 pt-2 pb-1 bg-slate-950/95 backdrop-blur-md flex items-center justify-between text-xs text-slate-300 select-none z-40 border-b border-slate-900/60">
          {/* Left: Clock */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200 text-xs tracking-tight">{currentTime}</span>
            <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[9px] font-bold">
              W
            </div>
          </div>

          {/* Right: Network, 5G, Wi-Fi, Battery */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-tighter text-slate-400 font-bold">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-slate-400">98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col bg-slate-950">
          {children}
        </div>

        {/* Android Home Navigation Gesture Bar */}
        <div className="w-full shrink-0 h-6 bg-slate-950 flex items-center justify-center select-none z-40 pb-1">
          <div 
            onClick={onNavigateHome}
            title="Go to Webstudios Home"
            className="w-28 h-1 bg-slate-600/70 hover:bg-slate-400 rounded-full cursor-pointer transition-colors" 
          />
        </div>
      </div>
    </div>
  );
};
