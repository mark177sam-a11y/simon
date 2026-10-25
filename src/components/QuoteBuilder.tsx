import React, { useState } from 'react';
import { 
  Sliders, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Zap, 
  CreditCard,
  Building2,
  UtensilsCrossed,
  Stethoscope,
  ShoppingBag,
  Scale,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { SectorItem, SectorId, AddonOption } from '../types';
import { SECTORS, ADDONS } from '../data/mockData';
import { triggerHaptic } from '../utils/calendar';
import { AndroidTheme } from './AndroidFrame';

interface QuoteBuilderProps {
  currency: 'KSH' | 'USD';
  onBookConfiguredProject: (sectorId: SectorId, selectedAddonIds: string[]) => void;
  activeTheme: AndroidTheme;
}

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  currency,
  onBookConfiguredProject,
  activeTheme
}) => {
  const [selectedSectorId, setSelectedSectorId] = useState<SectorId>('ecommerce');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['mpesa-stk', 'seo-boost', 'care-plan']);
  const [timelineSpeed, setTimelineSpeed] = useState<'standard' | 'rush'>('standard');

  const selectedSector = SECTORS.find((s) => s.id === selectedSectorId) || SECTORS[0];

  const toggleAddon = (id: string) => {
    triggerHaptic();
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const getBasePrice = () => {
    return currency === 'KSH' ? selectedSector.basePriceKSh : selectedSector.basePriceUSD;
  };

  const getAddonsTotal = () => {
    return selectedAddons.reduce((sum, id) => {
      const addon = ADDONS.find((a) => a.id === id);
      if (!addon) return sum;
      return sum + (currency === 'KSH' ? addon.priceKSh : addon.priceUSD);
    }, 0);
  };

  const getRushFee = () => {
    if (timelineSpeed === 'rush') {
      return currency === 'KSH' ? 4500 : 35;
    }
    return 0;
  };

  const grandTotal = getBasePrice() + getAddonsTotal() + getRushFee();

  const getSectorIcon = (id: SectorId) => {
    switch (id) {
      case 'restaurants': return UtensilsCrossed;
      case 'clinics': return Stethoscope;
      case 'real-estate': return Building2;
      case 'ecommerce': return ShoppingBag;
      case 'legal': return Scale;
      case 'wellness': return Sparkles;
      case 'schools': return GraduationCap;
      case 'corporate': return Briefcase;
    }
  };

  const themeAccentHex: Record<AndroidTheme, string> = {
    cyan: '#06b6d4',
    emerald: '#10b981',
    violet: '#a855f7',
    amber: '#f59e0b',
    slate: '#38bdf8'
  };

  return (
    <div className="p-4 space-y-5 animate-fade-in pb-20">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-4 border border-slate-800 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
            Transparent Price Estimator
          </span>
        </div>
        <h2 className="text-base font-bold text-white">Interactive Project Calculator</h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Configure your hand-coded website specifications with zero hidden fees. Quoted upfront in {currency}.
        </p>
      </div>

      {/* Sector Selection Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          1. Select Primary Sector:
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SECTORS.map((sec) => {
            const Icon = getSectorIcon(sec.id);
            const isSelected = selectedSectorId === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setSelectedSectorId(sec.id);
                }}
                className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-md scale-[1.01]'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {sec.name.split('&')[0]}
                  </p>
                  <span className="text-[11px] font-mono font-semibold text-cyan-400 block mt-0.5">
                    {currency === 'KSH' ? `KSh ${sec.basePriceKSh.toLocaleString()}` : `$${sec.basePriceUSD}`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Addons Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300">
            2. High-Performance Addons:
          </label>
          <span className="text-[10px] font-mono text-slate-400">
            {selectedAddons.length} enabled
          </span>
        </div>

        <div className="space-y-2">
          {ADDONS.map((addon) => {
            const isChecked = selectedAddons.includes(addon.id);
            return (
              <div
                key={addon.id}
                onClick={() => toggleAddon(addon.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                  isChecked
                    ? 'bg-slate-800/80 border-cyan-400'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                        isChecked ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{addon.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{addon.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-cyan-400 shrink-0">
                    {currency === 'KSH' ? `+KSh ${addon.priceKSh.toLocaleString()}` : `+$${addon.priceUSD}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Speed / Delivery Option */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 block">
          3. Delivery Pace:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setTimelineSpeed('standard');
            }}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              timelineSpeed === 'standard'
                ? 'bg-slate-800 border-cyan-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-white">Standard Delivery</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {selectedSector.deliveryDays} Business Days (Included)
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              setTimelineSpeed('rush');
            }}
            className={`p-2.5 rounded-2xl border text-left transition-all ${
              timelineSpeed === 'rush'
                ? 'bg-slate-800 border-cyan-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-white">Priority Rush</span>
            </div>
            <p className="text-[10px] text-slate-400">
              3-4 Days Fast Track ({currency === 'KSH' ? '+KSh 4,500' : '+$35'})
            </p>
          </button>
        </div>
      </div>

      {/* Live Calculation Bill Box */}
      <div className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-slate-300">Quote Breakdown</span>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
            All-Inclusive Quote
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>{selectedSector.name} Base Build</span>
            <span className="font-mono">{currency === 'KSH' ? `KSh ${getBasePrice().toLocaleString()}` : `$${getBasePrice()}`}</span>
          </div>
          {selectedAddons.length > 0 && (
            <div className="flex items-center justify-between text-slate-300">
              <span>{selectedAddons.length} Selected Addons</span>
              <span className="font-mono">+{currency === 'KSH' ? `KSh ${getAddonsTotal().toLocaleString()}` : `$${getAddonsTotal()}`}</span>
            </div>
          )}
          {timelineSpeed === 'rush' && (
            <div className="flex items-center justify-between text-amber-400">
              <span>Priority Fast Track</span>
              <span className="font-mono">+{currency === 'KSH' ? `KSh ${getRushFee().toLocaleString()}` : `$${getRushFee()}`}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Domain, SSL & 5 Business Emails</span>
            <span className="font-mono text-emerald-400">FREE INCLUDED</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Total Estimated Fixed Cost</span>
            <span className="text-xl font-black text-cyan-400 font-mono tracking-tight">
              {currency === 'KSH' ? `KSh ${grandTotal.toLocaleString()}` : `$${grandTotal}`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono text-right">
            50% deposit on kickoff<br />50% on verified launch
          </span>
        </div>

        <button
          onClick={() => {
            triggerHaptic();
            onBookConfiguredProject(selectedSectorId, selectedAddons);
          }}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-transform mt-2"
        >
          <span>Book Kickoff With This Configuration</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
