import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  Palette, 
  Volume2, 
  ExternalLink,
  ChevronLeft,
  Circle,
  Square
} from 'lucide-react';

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
  activeTheme,
  onThemeChange,
  onNavigateHome,
  onNavigateBack,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('08:56');
  const [navStyle, setNavStyle] = useState<'gesture' | 'three-button'>('gesture');
  const [simulationMode, setSimulationMode] = useState<boolean>(true);

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

  const themeColors: Record<AndroidTheme, { accent: string; label: string }> = {
    cyan: { accent: '#06b6d4', label: 'Glacier Cyan' },
    emerald: { accent: '#10b981', label: 'Emerald Mint' },
    violet: { accent: '#a855f7', label: 'Cosmic Violet' },
    amber: { accent: '#f59e0b', label: 'Solar Amber' },
    slate: { accent: '#38bdf8', label: 'Pixel Blue' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start selection:bg-cyan-500 selection:text-slate-950">
      {/* Desktop Simulation Header Toolbar (Hidden on small mobile viewports) */}
      <div className="w-full hidden md:flex items-center justify-between px-6 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs z-50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-200">Webstudios Android Client</span>
          </div>
          <span className="text-slate-600">|</span>
          <a 
            href="https://webstudios.world" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>webstudios.world</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Center theme selector & phone controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400 mr-1">Material Color:</span>
            {(Object.keys(themeColors) as AndroidTheme[]).map((thm) => (
              <button
                key={thm}
                onClick={() => onThemeChange(thm)}
                title={themeColors[thm].label}
                className={`w-4 h-4 rounded-full transition-transform ${
                  activeTheme === thm ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: themeColors[thm].accent }}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setNavStyle('gesture')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                navStyle === 'gesture' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gesture Bar
            </button>
            <button
              onClick={() => setNavStyle('three-button')}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                navStyle === 'three-button' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3-Button Nav
            </button>
          </div>

          <button
            onClick={() => setSimulationMode(!simulationMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {simulationMode ? (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Canvas</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Pixel Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container: Handles Mobile Viewport vs Desktop Frame */}
      <div className={`w-full flex-1 flex items-center justify-center ${simulationMode ? 'p-0 md:py-6 md:px-4' : 'p-0'}`}>
        <div
          className={`relative transition-all duration-300 w-full ${
            simulationMode
              ? 'md:max-w-[430px] md:h-[910px] md:rounded-[52px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_70px_rgba(0,0,0,0.85)] md:ring-1 md:ring-slate-700/60'
              : 'max-w-2xl h-screen'
          } bg-slate-950 flex flex-col overflow-hidden`}
        >
          {/* Side Hardware Buttons (Desktop Frame Only) */}
          {simulationMode && (
            <>
              {/* Volume Rocker */}
              <div className="hidden md:block absolute -left-[14px] top-28 w-1 h-16 bg-slate-700 rounded-l-md" />
              {/* Power Button */}
              <div className="hidden md:block absolute -right-[14px] top-20 w-1 h-12 bg-slate-700 rounded-r-md" />
            </>
          )}

          {/* Android System Status Bar (Fixed at the top) */}
          <div className="w-full h-11 shrink-0 px-6 pt-2 pb-1 bg-slate-950/95 backdrop-blur-md flex items-center justify-between text-xs text-slate-300 select-none z-40 border-b border-slate-900/50">
            {/* Left: Clock & Webstudios App notification icon */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200 text-xs tracking-tight">{currentTime}</span>
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[9px] font-bold">
                W
              </div>
            </div>

            {/* Center: Camera Punch Hole on Pixel Chassis */}
            <div className="w-4 h-4 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
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

          {/* App Body Content Area (Scrollable inside phone) */}
          <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col bg-slate-950">
            {children}
          </div>

          {/* Android Bottom Navigation Bar (Gesture Pill or 3-Button) */}
          <div className="w-full shrink-0 h-8 bg-slate-950 flex items-center justify-center select-none z-40 border-t border-slate-900/60 pb-1">
            {navStyle === 'gesture' ? (
              <div 
                onClick={onNavigateHome}
                title="Tap gesture pill to go Home"
                className="w-32 h-1.5 bg-slate-600/80 hover:bg-slate-400 rounded-full cursor-pointer transition-colors" 
              />
            ) : (
              <div className="w-full max-w-xs flex items-center justify-around px-8">
                <button
                  onClick={onNavigateBack}
                  className="p-1 text-slate-500 hover:text-slate-200 active:scale-90 transition-transform"
                  title="Back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={onNavigateHome}
                  className="p-1 text-slate-500 hover:text-slate-200 active:scale-90 transition-transform"
                  title="Home"
                >
                  <Circle className="w-4 h-4" />
                </button>
                <button
                  onClick={onNavigateHome}
                  className="p-1 text-slate-500 hover:text-slate-200 active:scale-90 transition-transform"
                  title="Recents"
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
