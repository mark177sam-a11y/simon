import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Sliders, 
  Calendar,
  UtensilsCrossed,
  Stethoscope,
  Building2,
  ShoppingBag,
  Scale,
  GraduationCap,
  Briefcase
} from 'lucide-react';
import { SectorItem, SectorId } from '../types';
import { SECTORS } from '../data/mockData';
import { triggerHaptic } from '../utils/calendar';
import { AndroidTheme } from './AndroidFrame';

import { Play } from 'lucide-react';

interface SectorCatalogViewProps {
  onSelectSector: (sector: SectorItem) => void;
  onBookSector: (sector: SectorItem) => void;
  onOpenDemo: (sector: SectorItem) => void;
  currency: 'KSH' | 'USD';
  searchQuery: string;
  activeTheme: AndroidTheme;
}

export const SectorCatalogView: React.FC<SectorCatalogViewProps> = ({
  onSelectSector,
  onBookSector,
  onOpenDemo,
  currency,
  searchQuery,
  activeTheme
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

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

  const filteredSectors = SECTORS.filter((s) => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (activeCategory === 'all') return true;
    if (activeCategory === 'websites' && (s.id === 'restaurants' || s.id === 'clinics')) return true;
    if (activeCategory === 'ecommerce' && s.id === 'ecommerce') return true;
    if (activeCategory === 'custom' && (s.id === 'corporate' || s.id === 'legal' || s.id === 'wellness')) return true;
    return true;
  });

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-20">
      {/* Hero Studio Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-4 border border-slate-800 relative overflow-hidden shadow-xl">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono tracking-wider uppercase text-cyan-400 font-bold">
            Sub-Second Web Architecture
          </span>
        </div>
        <h2 className="text-lg font-black text-white tracking-tight leading-tight">
          Hand-Coded Websites by Webstudios.world
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Zero bloated WordPress or Wix plugins. Clean Next.js/React code with integrated booking engines, Daraja M-Pesa STK push, and global SSL hosting.
        </p>

        {/* Studio KPI Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center">
          <div>
            <span className="text-xs font-black font-mono text-cyan-400">99+</span>
            <span className="block text-[9px] text-slate-400 font-medium">Lighthouse</span>
          </div>
          <div>
            <span className="text-xs font-black font-mono text-emerald-400">5-8 Days</span>
            <span className="block text-[9px] text-slate-400 font-medium">Delivery</span>
          </div>
          <div>
            <span className="text-xs font-black font-mono text-purple-400">Fixed</span>
            <span className="block text-[9px] text-slate-400 font-medium">Upfront Price</span>
          </div>
        </div>
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'all', label: 'All Packages' },
          { id: 'websites', label: 'Websites' },
          { id: 'ecommerce', label: 'E-Commerce' },
          { id: 'custom', label: 'Custom & Support' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              triggerHaptic();
              setActiveCategory(cat.id);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-slate-800 border border-cyan-400/80 text-cyan-400 font-bold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sectors Grid */}
      <div className="space-y-3">
        {filteredSectors.map((sector) => {
          const Icon = getSectorIcon(sector.id);
          return (
            <div
              key={sector.id}
              className="rounded-3xl bg-slate-900 border border-slate-800/90 p-4 space-y-3 relative overflow-hidden shadow-lg hover:border-slate-700 transition-all"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner mt-0.5"
                    style={{ backgroundColor: `${sector.accentColor}20`, color: sector.accentColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-cyan-400">
                      {sector.badge}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate">{sector.name}</h3>
                    <p className="text-[11px] text-slate-400 truncate">{sector.tagline}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-black font-mono text-cyan-400 block">
                    {currency === 'KSH' ? `KSh ${sector.basePriceKSh.toLocaleString()}` : `$${sector.basePriceUSD}`}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 block">
                    {sector.deliveryDays}d turnaround
                  </span>
                </div>
              </div>

              {/* Booking System badge */}
              <div className="p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-[11px] text-slate-300 font-medium truncate">
                    {sector.bookingSystemType}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold shrink-0">
                  Ready
                </span>
              </div>

              {/* Key Features Pill list */}
              <div className="space-y-1.5 text-xs text-slate-300">
                {sector.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    onOpenDemo(sector);
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-cyan-400 border border-slate-800 flex items-center gap-1"
                  title="Interactive System Preview"
                >
                  <Play className="w-3 h-3 fill-cyan-400" />
                  <span>Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    onSelectSector(sector);
                  }}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                >
                  Specs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    onBookSector(sector);
                  }}
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 shadow-md shadow-cyan-950/40 active:scale-95 transition-transform"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
