import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Zap, 
  Smartphone, 
  ArrowRight,
  ShieldCheck,
  Globe,
  Sliders
} from 'lucide-react';
import { SectorItem } from '../types';
import { triggerHaptic } from '../utils/calendar';

interface SectorDemoModalProps {
  sector: SectorItem | null;
  onClose: () => void;
  onBookThisSector: (sector: SectorItem) => void;
  currency: 'KSH' | 'USD';
}

export const SectorDemoModal: React.FC<SectorDemoModalProps> = ({
  sector,
  onClose,
  onBookThisSector,
  currency
}) => {
  if (!sector) return null;

  const [selectedPages, setSelectedPages] = useState<number>(5);
  const [includeMpesa, setIncludeMpesa] = useState<boolean>(true);
  const [includeSEO, setIncludeSEO] = useState<boolean>(true);
  const [simulating, setSimulating] = useState(false);
  const [auditComplete, setAuditComplete] = useState(false);

  const handleRunAudit = () => {
    triggerHaptic();
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setAuditComplete(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-100">
        <div className="w-full pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        <div className="px-5 py-3 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              Webstudios Feature Simulation
            </span>
            <h3 className="text-sm font-bold text-white">{sector.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto no-scrollbar space-y-4 flex-1">
          <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs">
            <span className="font-bold text-cyan-300 block mb-0.5">
              Live Architecture Preview: {sector.bookingSystemType}
            </span>
            <p className="text-slate-400 text-[11px]">
              Every website built by Webstudios is hand-coded to guarantee sub-second load times on mobile 4G with built-in conversion engines.
            </p>
          </div>

          {!auditComplete ? (
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Target Page Scope:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 3, 5, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setSelectedPages(num);
                      }}
                      className={`flex-1 py-2 rounded-xl font-bold font-mono transition-all ${
                        selectedPages === num
                          ? 'bg-cyan-500 text-slate-950 shadow-md'
                          : 'bg-slate-950 border border-slate-800 text-slate-400'
                      }`}
                    >
                      {num} {num === 1 ? 'Page' : 'Pages'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-slate-300 font-semibold block">
                  Integrated Technologies:
                </label>
                
                <div
                  onClick={() => setIncludeMpesa(!includeMpesa)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between ${
                    includeMpesa ? 'bg-slate-800/80 border-emerald-500/60' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <div>
                      <p className="font-bold text-white text-xs">Daraja M-Pesa STK Push</p>
                      <p className="text-[10px] text-slate-400">Direct phone prompt for orders & deposits</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${includeMpesa ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {includeMpesa ? 'INCLUDED' : 'OPTIONAL'}
                  </span>
                </div>

                <div
                  onClick={() => setIncludeSEO(!includeSEO)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between ${
                    includeSEO ? 'bg-slate-800/80 border-cyan-500/60' : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="font-bold text-white text-xs">Technical SEO & Schema Markup</p>
                      <p className="text-[10px] text-slate-400">Google Search Console rich snippets</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${includeSEO ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {includeSEO ? 'INCLUDED' : 'OPTIONAL'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAudit}
                disabled={simulating}
                className="w-full h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                {simulating ? (
                  <span>Auditing Performance Architecture...</span>
                ) : (
                  <>
                    <span>Run Mobile Speed & Quality Audit</span>
                    <Zap className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-4 text-center space-y-3 bg-slate-950 rounded-2xl border border-slate-800 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Lighthouse Performance: 99/100</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Expected mobile loading time: <strong className="text-emerald-400 font-mono">0.65s</strong> on 4G networks. Zero unneeded WordPress plugins.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-center font-mono text-xs">
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="block text-emerald-400 font-bold">100%</span>
                  <span className="text-[9px] text-slate-400">SEO</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="block text-cyan-400 font-bold">99%</span>
                  <span className="text-[9px] text-slate-400">Performance</span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl">
                  <span className="block text-purple-400 font-bold">100%</span>
                  <span className="text-[9px] text-slate-400">Best Practice</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuditComplete(false)}
                className="text-[11px] text-cyan-400 hover:underline block mx-auto mt-2"
              >
                Configure Another Scope
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            onClick={() => {
              onBookThisSector(sector);
              onClose();
            }}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 active:scale-95 transition-transform"
          >
            <span>Book Website Build for {sector.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
