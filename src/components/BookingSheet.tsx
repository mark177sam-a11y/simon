import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ChevronLeft, 
  Video, 
  Phone, 
  MessageSquare,
  Building,
  Mail,
  User,
  Download,
  Share2
} from 'lucide-react';
import { SectorItem, SectorId, BookingType, BookingRecord } from '../types';
import { SECTORS, ADDONS } from '../data/mockData';
import { QRCodeDisplay } from './QRCodeDisplay';
import { downloadICS, getGoogleCalendarUrl, triggerHaptic } from '../utils/calendar';
import { AndroidTheme } from './AndroidFrame';

interface BookingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedSectorId?: SectorId;
  currency: 'KSH' | 'USD';
  onBookingCreated: (booking: BookingRecord) => void;
  activeTheme: AndroidTheme;
}

export const BookingSheet: React.FC<BookingSheetProps> = ({
  isOpen,
  onClose,
  preselectedSectorId,
  currency,
  onBookingCreated,
  activeTheme
}) => {
  if (!isOpen) return null;

  // Multi-step booking state
  const [step, setStep] = useState<number>(1);
  const [bookingType, setBookingType] = useState<BookingType>('discovery');
  const [selectedSectorId, setSelectedSectorId] = useState<SectorId>(preselectedSectorId || 'restaurants');
  
  // Date selection (generate next 14 days)
  const getUpcomingDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      days.push({ iso, dayName, dayNum, monthName, isWeekend: d.getDay() === 0 });
    }
    return days;
  };

  const upcomingDays = getUpcomingDays();
  const [selectedDate, setSelectedDate] = useState<string>(upcomingDays[1]?.iso || upcomingDays[0].iso);
  
  const timeSlots = [
    { time: '09:30 AM', period: 'Morning', label: '09:30 AM - 10:00 AM' },
    { time: '11:00 AM', period: 'Morning', label: '11:00 AM - 11:30 AM' },
    { time: '02:00 PM', period: 'Afternoon', label: '02:00 PM - 02:30 PM' },
    { time: '03:30 PM', period: 'Afternoon', label: '03:30 PM - 04:00 PM' },
    { time: '05:00 PM', period: 'Evening', label: '05:00 PM - 05:30 PM' },
    { time: '06:30 PM', period: 'Evening', label: '06:30 PM - 07:00 PM' }
  ];
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(timeSlots[1].label);

  // Addons selected
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['mpesa-stk', 'custom-booking']);

  // Client Details
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('+254 ');
  const [clientCompany, setClientCompany] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [meetingFormat, setMeetingFormat] = useState<'google-meet' | 'whatsapp-call' | 'phone-call'>('google-meet');

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  const selectedSector = SECTORS.find((s) => s.id === selectedSectorId) || SECTORS[0];

  // Calculate total estimated budget
  const calculateTotal = () => {
    let base = currency === 'KSH' ? selectedSector.basePriceKSh : selectedSector.basePriceUSD;
    if (bookingType === 'discovery') {
      base = 0; // Free consultation
    }
    const addonSum = selectedAddons.reduce((acc, addonId) => {
      const addon = ADDONS.find((a) => a.id === addonId);
      if (!addon) return acc;
      return acc + (currency === 'KSH' ? addon.priceKSh : addon.priceUSD);
    }, 0);
    return base + (bookingType === 'discovery' ? 0 : addonSum);
  };

  const toggleAddon = (id: string) => {
    triggerHaptic();
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic();

    if (!clientName.trim() || !clientEmail.trim()) {
      alert('Please provide your name and email so we can send your booking pass.');
      return;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newBookingId = `WS-BKG-${randomSuffix}`;

    const newBooking: BookingRecord = {
      id: newBookingId,
      title: `${selectedSector.name} ${bookingType === 'discovery' ? 'Discovery Call' : 'Project Kickoff'}`,
      bookingType,
      sectorId: selectedSectorId,
      clientName,
      clientEmail,
      clientPhone,
      clientCompany: clientCompany || selectedSector.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      durationMinutes: bookingType === 'scoping' ? 60 : 30,
      meetingFormat,
      meetUrl: meetingFormat === 'google-meet' ? `https://meet.google.com/ws-${randomSuffix}` : undefined,
      estimatedCostKSh: currency === 'KSH' ? calculateTotal() : calculateTotal() * 130,
      estimatedCostUSD: currency === 'USD' ? calculateTotal() : Math.round(calculateTotal() / 130),
      currency,
      addons: selectedAddons,
      notes,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      qrCodeToken: `${newBookingId}-VERIFIED`
    };

    setConfirmedBooking(newBooking);
    onBookingCreated(newBooking);
    setStep(5); // Show confirmation
  };

  const themeAccentHex: Record<AndroidTheme, string> = {
    cyan: '#06b6d4',
    emerald: '#10b981',
    violet: '#a855f7',
    amber: '#f59e0b',
    slate: '#38bdf8'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Grab Handle */}
        <div className="w-full pt-3 pb-2 flex justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-700/80 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            {step > 1 && step < 5 && (
              <button
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h2 className="text-sm font-bold text-white">
                {step === 5
                  ? 'Booking Confirmed!'
                  : step === 1
                  ? 'Step 1: Session & Sector'
                  : step === 2
                  ? 'Step 2: Date & Slot'
                  : step === 3
                  ? 'Step 3: Add-on Features'
                  : 'Step 4: Contact & Details'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {step === 5 ? 'Digital Pass Ready' : `Step ${step} of 4 · Webstudios Studio`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto no-scrollbar space-y-5 flex-1">
          {/* STEP 1: Choose Booking Type & Sector */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select Booking Objective:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    {
                      id: 'discovery' as BookingType,
                      title: 'Discovery Call',
                      badge: '100% Free · 30m',
                      desc: 'Discuss project, scope & get fixed quote'
                    },
                    {
                      id: 'kickoff' as BookingType,
                      title: 'Project Kickoff',
                      badge: 'Build Slot',
                      desc: 'Lock in 5-8 day fast-track development'
                    },
                    {
                      id: 'scoping' as BookingType,
                      title: 'Tech Architecture',
                      badge: '60m Deep Dive',
                      desc: 'M-Pesa API, Database & Custom Engines'
                    },
                    {
                      id: 'audit' as BookingType,
                      title: 'Speed & SEO Audit',
                      badge: 'Sub-second',
                      desc: 'Review slow WordPress/Wix site'
                    }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setBookingType(item.id);
                      }}
                      className={`p-3 rounded-2xl text-left border transition-all ${
                        bookingType === item.id
                          ? 'bg-slate-800/90 border-cyan-400 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-400 font-semibold block w-fit mb-1">
                        {item.badge}
                      </span>
                      <p className="text-xs font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2 leading-tight">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Target Business Sector:
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                  {SECTORS.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic();
                        setSelectedSectorId(sec.id);
                      }}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        selectedSectorId === sec.id
                          ? 'bg-slate-800/90 border-cyan-400 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-200 truncate">{sec.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{sec.tagline}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] font-mono font-semibold text-cyan-400">
                          {currency === 'KSH' ? `KSh ${sec.basePriceKSh.toLocaleString()}` : `$${sec.basePriceUSD}`}
                        </span>
                        <span className="block text-[9px] text-slate-400 font-mono">
                          {sec.deliveryDays}d build
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  triggerHaptic();
                  setStep(2);
                }}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-transform"
              >
                <span>Select Date & Time</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Date & Slot Picker */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300">
                    Choose Consultation Date:
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400">
                    Real-Time Availability
                  </span>
                </div>

                {/* Horizontal Date Scroller */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {upcomingDays.map((day) => {
                    const isSelected = selectedDate === day.iso;
                    return (
                      <button
                        key={day.iso}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setSelectedDate(day.iso);
                        }}
                        className={`flex flex-col items-center justify-center min-w-[56px] py-2.5 rounded-2xl border transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-md shadow-cyan-950/50 scale-105'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-medium">{day.dayName}</span>
                        <span className="text-base font-bold my-0.5">{day.dayNum}</span>
                        <span className="text-[9px] opacity-80">{day.monthName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Available Slots (Nairobi / GMT+3):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.label;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setSelectedTimeSlot(slot.label);
                        }}
                        className={`p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-cyan-400 text-white shadow-sm'
                            : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                          <span className="text-xs font-semibold font-mono">{slot.time}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 font-mono">Open</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Selected: <strong className="text-slate-200">{selectedDate}</strong> at <strong className="text-slate-200">{selectedTimeSlot}</strong></span>
              </div>

              <button
                onClick={() => {
                  triggerHaptic();
                  setStep(3);
                }}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-transform"
              >
                <span>Configure Features & Addons</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 3: Add-on Features */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Select Custom Enhancements:
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedAddons.length} included
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-1">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-slate-800/90 border-cyan-400 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by wrapper div
                            className="mt-0.5 rounded text-cyan-500 focus:ring-0 bg-slate-900 border-slate-700"
                          />
                          <div>
                            <p className="text-xs font-bold text-white">{addon.name}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                              {addon.description}
                            </p>
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

              {/* Running total pill */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Est. Quote</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {bookingType === 'discovery' ? 'FREE Discovery Session' : (currency === 'KSH' ? `KSh ${calculateTotal().toLocaleString()}` : `$${calculateTotal()}`)}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Fixed pricing guarantee
                </span>
              </div>

              <button
                onClick={() => {
                  triggerHaptic();
                  setStep(4);
                }}
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-transform"
              >
                <span>Enter Contact Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 4: Contact & Meeting details */}
          {step === 4 && (
            <form onSubmit={handleConfirmBooking} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Meeting Connection Preference:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'google-meet', label: 'Google Meet', icon: Video },
                    { id: 'whatsapp-call', label: 'WhatsApp', icon: MessageSquare },
                    { id: 'phone-call', label: 'Phone Call', icon: Phone }
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSelected = meetingFormat === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          triggerHaptic();
                          setMeetingFormat(item.id as typeof meetingFormat);
                        }}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-slate-800 border-cyan-400 text-cyan-400 font-bold'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Your Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. David Ochieng"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Business Email *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="david@company.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">
                      Phone / WhatsApp *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="+254 7..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Company / Brand Name
                  </label>
                  <div className="relative">
                    <Building className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="e.g. Nairobi Specialty Roasters"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-300 block mb-1">
                    Project Notes / Key Needs (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Need Daraja M-Pesa STK push and online booking for 30 daily clients"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 active:scale-[0.98] transition-transform"
              >
                <span>Confirm & Issue Booking Pass</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 5: Instant Confirmation & Digital Boarding Pass */}
          {step === 5 && confirmedBooking && (
            <div className="space-y-4 animate-fade-in text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Booking Locked & Confirmed!</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assigned Lead Engineer: <strong className="text-slate-200">Webstudios Direct</strong>
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 text-left relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold">
                      PASS REF: {confirmedBooking.id}
                    </span>
                    <h4 className="text-xs font-bold text-white">{confirmedBooking.title}</h4>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                    VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">DATE & TIME</span>
                    <span className="font-semibold text-slate-200">{confirmedBooking.date}</span>
                    <span className="block text-[11px] text-slate-400">{confirmedBooking.timeSlot}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">FORMAT</span>
                    <span className="font-semibold text-slate-200 uppercase">{confirmedBooking.meetingFormat}</span>
                    <span className="block text-[11px] text-cyan-400 truncate">
                      {confirmedBooking.meetUrl || '+254 728 423 472'}
                    </span>
                  </div>
                </div>

                {/* QR Code in center */}
                <div className="my-3 flex justify-center">
                  <QRCodeDisplay token={confirmedBooking.qrCodeToken} size={130} />
                </div>

                <div className="pt-2 border-t border-dashed border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Client: {confirmedBooking.clientName}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {confirmedBooking.bookingType === 'discovery' ? 'FREE' : (currency === 'KSH' ? `KSh ${confirmedBooking.estimatedCostKSh.toLocaleString()}` : `$${confirmedBooking.estimatedCostUSD}`)}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Calendar & WhatsApp */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getGoogleCalendarUrl(confirmedBooking)}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Google Calendar</span>
                </a>
                <button
                  type="button"
                  onClick={() => downloadICS(confirmedBooking)}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Save .ICS File</span>
                </button>
              </div>

              <a
                href={`https://wa.me/254728423472?text=${encodeURIComponent(
                  `Hello Webstudios! I just booked my session: ${confirmedBooking.id} for ${confirmedBooking.title} on ${confirmedBooking.date} at ${confirmedBooking.timeSlot}. Looking forward to discussing our website!`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Confirmation (+254 728 423 472)</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
