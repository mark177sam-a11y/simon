import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { BookingRecord } from '../types';
import { triggerHaptic } from '../utils/calendar';

interface PipelineAnalyticsViewProps {
  bookings: BookingRecord[];
  currency: 'KSH' | 'USD';
}

export const PipelineAnalyticsView: React.FC<PipelineAnalyticsViewProps> = ({
  bookings,
  currency
}) => {
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inProgressCount = bookings.filter((b) => b.status === 'in-progress').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const totalValueKSh = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.estimatedCostKSh || 0), 0);

  const totalValueUSD = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.estimatedCostUSD || 0), 0);

  // Group by plan
  const planCounts: Record<string, { count: number; totalKSh: number }> = {};
  bookings.forEach((b) => {
    const key = b.planName || b.title || 'General Scoping';
    if (!planCounts[key]) {
      planCounts[key] = { count: 0, totalKSh: 0 };
    }
    planCounts[key].count += 1;
    planCounts[key].totalKSh += b.estimatedCostKSh || 0;
  });

  const exportCSV = () => {
    triggerHaptic();
    if (bookings.length === 0) return;

    const headers = ['ID', 'Client Name', 'Email', 'Phone', 'Company', 'Plan', 'Date', 'Time Slot', 'Format', 'Status', 'Cost KSh', 'Notes', 'Created At'];
    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.clientName}"`,
      `"${b.clientEmail}"`,
      `"${b.clientPhone || ''}"`,
      `"${b.clientCompany || ''}"`,
      `"${b.planName || b.title}"`,
      `"${b.date}"`,
      `"${b.timeSlot}"`,
      `"${b.meetingFormat}"`,
      `"${b.status}"`,
      `"${b.estimatedCostKSh || 0}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`,
      `"${b.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `webstudios-bookings-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-24 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Pipeline & Inquiries Analytics</h2>
          <p className="text-xs text-slate-400">Financial pipeline and inquiry trends</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={bookings.length === 0}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs text-cyan-400 font-semibold flex items-center gap-1.5 disabled:opacity-50"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Revenue Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-mono uppercase tracking-wider">Total Active Pipeline</span>
          <TrendingUp className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="text-2xl font-black font-mono text-white">
            {currency === 'KSH' ? `KSh ${totalValueKSh.toLocaleString()}` : `$${totalValueUSD.toLocaleString()}`}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {bookings.filter((b) => b.status !== 'cancelled').length} active and confirmed project inquiries
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center text-xs">
          <div>
            <span className="text-amber-400 font-bold font-mono">{pendingCount}</span>
            <span className="block text-[10px] text-slate-400">Pending Review</span>
          </div>
          <div>
            <span className="text-emerald-400 font-bold font-mono">{confirmedCount}</span>
            <span className="block text-[10px] text-slate-400">Confirmed</span>
          </div>
          <div>
            <span className="text-cyan-400 font-bold font-mono">{inProgressCount}</span>
            <span className="block text-[10px] text-slate-400">In Build</span>
          </div>
        </div>
      </div>

      {/* Breakdown by Plan */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider">
            Most Selected Plans & Packages
          </h3>
          <Layers className="w-4 h-4 text-cyan-400" />
        </div>

        {Object.keys(planCounts).length > 0 ? (
          <div className="space-y-2.5">
            {Object.entries(planCounts)
              .sort((a, b) => b[1].count - a[1].count)
              .map(([plan, data]) => {
                const percentage = Math.round((data.count / bookings.length) * 100);
                return (
                  <div key={plan} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-200 font-semibold truncate max-w-[220px]">
                        {plan}
                      </span>
                      <span className="font-mono text-slate-400">
                        {data.count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-4">No inquiries recorded yet.</p>
        )}
      </div>

      {/* Meeting Format Distribution */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Phone Calls</span>
          <span className="text-base font-bold text-white font-mono mt-0.5 block">
            {bookings.filter((b) => b.meetingFormat === 'phone-call').length}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">WhatsApp</span>
          <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
            {bookings.filter((b) => b.meetingFormat === 'whatsapp-call').length}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-mono block">Google Meet</span>
          <span className="text-base font-bold text-cyan-400 font-mono mt-0.5 block">
            {bookings.filter((b) => b.meetingFormat === 'google-meet').length}
          </span>
        </div>
      </div>
    </div>
  );
};
