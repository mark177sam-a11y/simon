import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Globe2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { SectorItem } from '../types';

interface SectorDetailModalProps {
  sector: SectorItem | null;
  onClose: () => void;
  onBookThisSector: (sector: SectorItem) => void;
  currency: 'KSH' | 'USD';
}

export const SectorDetailModal: React.FC<SectorDetailModalProps> = ({
  sector,
  onClose,
  onBookThisSector,
  currency
}) => {
  if (!sector) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        {/* Grab handle */}
        <div className="w-full pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              {sector.badge}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{sector.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          {/* Price & Timeline Strip */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Baseline Package</span>
              <span className="text-lg font-bold font-mono text-cyan-400">
                {currency === 'KSH' ? `KSh ${sector.basePriceKSh.toLocaleString()}` : `$${sector.basePriceUSD}`}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase text-slate-500 block">Target Delivery</span>
              <span className="text-sm font-semibold text-slate-200">
                {sector.deliveryDays} Business Days
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              Sector Overview
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {sector.description}
            </p>
          </div>

          {/* Booking Engine Specialized Architecture */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40">
            <div className="flex items-center gap-2 mb-1.5">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-cyan-300">Included Booking Architecture</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {sector.bookingSystemType}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Engineered with real-time slot checking, automated SMS/Email confirmations, and optional M-Pesa STK Push deposit capture.
            </p>
          </div>

          {/* Included Features */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Key Architecture Features
            </h4>
            <div className="space-y-2">
              {sector.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Included Webstudios Standard Stack */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
            <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">
              Included In Every Build:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Domain (.co.ke / .com)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Global SSL & Hosting</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Sub-Second Speeds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>5 Business Emails</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0 flex items-center gap-2">
          <a
            href="https://webstudios.world"
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center transition-colors"
            title="Open webstudios.world website"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => {
              onBookThisSector(sector);
              onClose();
            }}
            className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-transform"
          >
            <span>Book Project for this Sector</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
