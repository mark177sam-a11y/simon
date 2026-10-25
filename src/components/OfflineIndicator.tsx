import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-2 left-4 right-4 z-50 flex items-center justify-between gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg shadow-amber-900/40">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 animate-pulse" />
        <span>Offline Mode — Showing cached bookings & studio data.</span>
      </div>
      <span className="text-[10px] bg-amber-700/80 px-2 py-0.5 rounded-md font-mono">Offline</span>
    </div>
  );
};
