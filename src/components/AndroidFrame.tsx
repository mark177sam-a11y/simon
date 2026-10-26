import React from 'react';

export type AndroidTheme = 'cyan' | 'emerald' | 'violet' | 'amber' | 'slate';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTheme: AndroidTheme;
  onThemeChange: (theme: AndroidTheme) => void;
  onNavigateHome?: () => void;
  onNavigateBack?: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      {/* Clean responsive container without fake phone hardware simulation clutter */}
      <div className="w-full max-w-xl mx-auto min-h-screen flex flex-col relative shadow-2xl bg-slate-950 border-x border-slate-900/60">
        {/* App Content */}
        <div className="flex-1 w-full overflow-y-auto no-scrollbar relative flex flex-col bg-slate-950">
          {children}
        </div>
      </div>
    </div>
  );
};
