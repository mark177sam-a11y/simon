import React, { useState } from 'react';
import { 
  X, 
  UtensilsCrossed, 
  Stethoscope, 
  ShoppingBag, 
  Building2, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard,
  Smartphone,
  ArrowRight
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

  // Demo interactive state
  const [guests, setGuests] = useState(2);
  const [slot, setSlot] = useState('7:30 PM');
  const [demoComplete, setDemoComplete] = useState(false);

  const handleTestBooking = () => {
    triggerHaptic();
    setDemoComplete(true);
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
              Interactive Architecture Demo
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
              Live Simulation: {sector.bookingSystemType}
            </span>
            <p className="text-slate-400 text-[11px]">
              This is a functional preview of the custom booking engine that Webstudios will hand-code for your website.
            </p>
          </div>

          {!demoComplete ? (
            <div className="space-y-4 text-xs">
              {sector.id === 'restaurants' && (
                <>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1.5">
                      Select Party Size:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 4, 6, 8].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => {
                            triggerHaptic();
                            setGuests(num);
                          }}
                          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                            guests === num
                              ? 'bg-cyan-500 text-slate-950 shadow-md'
                              : 'bg-slate-950 border border-slate-800 text-slate-400'
                          }`}
                        >
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-semibold block mb-1.5">
                      Available Dinner Slots:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['6:00 PM', '7:30 PM', '8:45 PM'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            triggerHaptic();
                            setSlot(s);
                          }}
                          className={`py-2 rounded-xl font-mono text-center font-semibold transition-all ${
                            slot === s
                              ? 'bg-slate-800 border-cyan-400 border text-cyan-400'
                              : 'bg-slate-950 border border-slate-800 text-slate-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {sector.id === 'clinics' && (
                <>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1.5">
                      Consultation Type:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['In-Clinic Dental Check', 'Video Telehealth Consult'].map((type, i) => (
                        <div
                          key={type}
                          className={`p-2.5 rounded-xl border text-left cursor-pointer ${
                            i === 0 ? 'bg-slate-800 border-cyan-400 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <p className="font-bold text-xs">{type}</p>
                          <span className="text-[10px] text-slate-400">Dr. Sarah Kamau</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {sector.id === 'ecommerce' && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Sample Cart: 1x Handcrafted Roast (500g)</span>
                    <span className="font-mono font-bold text-cyan-400">KSh 1,200</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    <span>Instant Daraja M-Pesa STK Push Integration</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleTestBooking}
                className="w-full h-11 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
              >
                <span>Simulate Booking Confirmation</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="p-4 text-center space-y-3 bg-slate-950 rounded-2xl border border-slate-800 animate-fade-in">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Engine Workflow Verified!</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Table reserved for {guests} guests at {slot}. The live website features instant SMS & WhatsApp notifications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setDemoComplete(false)}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Test Again
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
