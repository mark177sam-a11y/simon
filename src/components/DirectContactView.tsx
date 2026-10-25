import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Globe, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Zap
} from 'lucide-react';
import { triggerHaptic } from '../utils/calendar';

export const DirectContactView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How fast can our sector website go live?',
      a: 'Most standard sector websites (restaurants, clinics, real estate, salons) are hand-coded and delivered within 5 to 8 business days. Priority rush deliveries can be expedited to 3 to 4 days.'
    },
    {
      q: 'Does Webstudios integrate Daraja M-Pesa STK Push?',
      a: 'Yes! We configure instant Daraja M-Pesa Express STK Push prompts directly to customer Safaricom phones for order checkouts, booking deposits, and ticket purchases.'
    },
    {
      q: 'Are domains, SSL, and business emails included in the quote?',
      a: 'Yes, every Webstudios build includes 1 year of domain registration (.co.ke, .com, or .africa), global SSL certificates, and 5 encrypted business mailboxes (e.g. info@yourbrand.com).'
    },
    {
      q: 'Why hand-coded Next.js/React instead of WordPress or Wix?',
      a: 'WordPress and Wix sites load 30+ plugins and weigh 4-10MB, taking 6+ seconds on mobile networks. Hand-coded Webstudios applications score 99+ on Google Lighthouse, load in under 1 second, and rank significantly higher on Google Search.'
    }
  ];

  return (
    <div className="p-4 space-y-5 animate-fade-in pb-20">
      {/* Studio Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 p-5 border border-slate-800 text-center relative overflow-hidden shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center font-bold text-lg mb-2">
          W
        </div>
        <h2 className="text-base font-bold text-white">Webstudios Direct Contact</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Connect directly with our engineering team in Nairobi for immediate consultation, project scoping, or emergency support.
        </p>
      </div>

      {/* Immediate Contact Actions */}
      <div className="space-y-2.5">
        <a
          href="https://wa.me/254728423472?text=Hello%20Webstudios!%20I%20am%20interested%20in%20booking%20a%20website%20project%20for%20my%20business."
          target="_blank"
          rel="noreferrer"
          className="w-full p-4 rounded-2xl bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-500/50 flex items-center justify-between text-white transition-all shadow-lg shadow-emerald-950/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">Chat on WhatsApp</p>
              <p className="text-[11px] opacity-90 font-mono">+254 728 423 472 · Immediate Reply</p>
            </div>
          </div>
          <span className="text-[10px] bg-white/20 px-2.5 py-1 rounded-full font-bold">
            Chat Now
          </span>
        </a>

        <a
          href="tel:+254728423472"
          className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Direct Phone Call</p>
              <p className="text-[11px] text-slate-400 font-mono">+254 728 423 472</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Mon-Fri 8am-6pm
          </span>
        </a>

        <a
          href="mailto:mark177sam@gmail.com?subject=Webstudios%20Project%20Booking"
          className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-purple-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Email Studio</p>
              <p className="text-[11px] text-slate-400">Official Project Desk</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            2hr Response
          </span>
        </a>

        <a
          href="https://webstudios.world"
          target="_blank"
          rel="noreferrer"
          className="w-full p-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 flex items-center justify-between text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Official Website</p>
              <p className="text-[11px] text-slate-400 font-mono">webstudios.world</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-slate-400" />
        </a>
      </div>

      {/* Engineering Credentials */}
      <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white">Webstudios Performance SLA</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Mobile Score</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">99+ Lighthouse</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Page Load</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">&lt; 0.8s on 4G</span>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-300">
          Booking & Build FAQ:
        </h3>
        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950/70 border border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setOpenFaq(isOpen ? null : idx);
                  }}
                  className="w-full p-3 text-left flex items-center justify-between text-xs font-bold text-slate-200"
                >
                  <span className="pr-2">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-3 pb-3 pt-0 text-[11px] text-slate-400 leading-relaxed border-t border-slate-900">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
