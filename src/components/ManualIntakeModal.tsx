import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, Phone, Mail, User, Building2, Tag, DollarSign, CheckCircle2 } from 'lucide-react';
import { BookingRecord, BookingStatus } from '../types';
import { triggerHaptic } from '../utils/calendar';

interface ManualIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (booking: BookingRecord) => Promise<void>;
  currency: 'KSH' | 'USD';
}

const AVAILABLE_PLANS = [
  { name: 'Starter Website Package (1-5 Pages)', ksh: 13700, usd: 105 },
  { name: 'Business & Lead Generation Platform', ksh: 22000, usd: 170 },
  { name: 'E-Commerce Store + M-Pesa STK Push', ksh: 28500, usd: 220 },
  { name: 'Custom Web Application & Client Portal', ksh: 38000, usd: 295 },
  { name: 'WordPress to React Sub-Second Redesign', ksh: 15000, usd: 115 },
  { name: 'Managed Hosting & Technical Care Plan', ksh: 4500, usd: 35 },
  { name: 'Custom Technical Scoping / Consultation', ksh: 0, usd: 0 }
];

export const ManualIntakeModal: React.FC<ManualIntakeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currency
}) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(AVAILABLE_PLANS[0].name);
  const [customPriceKSh, setCustomPriceKSh] = useState(AVAILABLE_PLANS[0].ksh);
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 10:45 AM');
  const [meetingFormat, setMeetingFormat] = useState<'google-meet' | 'whatsapp-call' | 'phone-call'>('phone-call');
  const [status, setStatus] = useState<BookingStatus>('confirmed');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handlePlanChange = (planName: string) => {
    setSelectedPlan(planName);
    const matched = AVAILABLE_PLANS.find((p) => p.name === planName);
    if (matched) {
      setCustomPriceKSh(matched.ksh);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    triggerHaptic();
    setIsSaving(true);
    try {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const bookingId = `WS-INTAKE-${randomNum}`;

      const newBooking: BookingRecord = {
        id: bookingId,
        title: selectedPlan,
        bookingType: 'package-booking',
        planName: selectedPlan,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim() || 'inquiry@webstudios.world',
        clientPhone: clientPhone.trim(),
        clientCompany: clientCompany.trim() || undefined,
        date,
        timeSlot,
        durationMinutes: 45,
        meetingFormat,
        meetUrl: meetingFormat === 'google-meet' ? `https://meet.google.com/ws-${randomNum}` : undefined,
        estimatedCostKSh: customPriceKSh,
        estimatedCostUSD: Math.round(customPriceKSh / 130),
        currency,
        addons: [],
        notes: notes.trim() || 'Direct manual intake logged by developer.',
        status,
        createdAt: new Date().toISOString(),
        qrCodeToken: bookingId
      };

      await onSave(newBooking);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar space-y-4 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Record Client Inquiry / Intake</h3>
              <p className="text-[11px] text-slate-400">Directly syncs to Supabase & Firestore</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Client Details */}
          <div className="space-y-2">
            <label className="block text-slate-400 font-semibold">Client Name *</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. John Gitonga"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">Phone Number</label>
              <div className="relative flex items-center">
                <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="0712 345 678"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-2 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold">Company / Brand (Optional)</label>
            <div className="relative flex items-center">
              <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                placeholder="e.g. Gitonga Coffee Exporters"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Plan Selected */}
          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold">Selected Plan / Package</label>
            <select
              value={selectedPlan}
              onChange={(e) => handlePlanChange(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            >
              {AVAILABLE_PLANS.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name} — KSh {p.ksh.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing Quote & Format */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">Agreed Quote (KSh)</label>
              <input
                type="number"
                value={customPriceKSh}
                onChange={(e) => setCustomPriceKSh(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">Meeting Format</label>
              <select
                value={meetingFormat}
                onChange={(e) => setMeetingFormat(e.target.value as typeof meetingFormat)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="phone-call">Phone Call</option>
                <option value="whatsapp-call">WhatsApp Call</option>
                <option value="google-meet">Google Meet</option>
              </select>
            </div>
          </div>

          {/* Date & Status */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">Target Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-slate-400 font-semibold">Initial Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BookingStatus)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="block text-slate-400 font-semibold">Project Notes / Requirements</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Needs M-Pesa STK push for 30 shop items, requires delivery within 6 days."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-medium hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold shadow-md disabled:opacity-50"
            >
              {isSaving ? 'Syncing...' : 'Save & Sync to Supabase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
