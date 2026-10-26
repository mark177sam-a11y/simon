import React, { useState, useEffect } from 'react';
import { AndroidFrame, AndroidTheme } from './components/AndroidFrame';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav, NavTabId } from './components/AndroidBottomNav';
import { SectorCatalogView } from './components/SectorCatalogView';
import { QuoteBuilder } from './components/QuoteBuilder';
import { MyBookingsView } from './components/MyBookingsView';
import { DirectContactView } from './components/DirectContactView';
import { BookingSheet } from './components/BookingSheet';
import { DigitalPassModal } from './components/DigitalPassModal';
import { SectorDetailModal } from './components/SectorDetailModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { subscribeBookings, saveBooking, deleteBooking } from './lib/firebase.ts';
import { 
  getSupabaseConfig, 
  getSupabaseClient, 
  saveBookingToSupabase, 
  deleteBookingFromSupabase, 
  fetchSupabaseBookings, 
  subscribeSupabaseBookings 
} from './lib/supabase';
import { SupabaseModal } from './components/SupabaseModal';
import { BookingRecord, SectorItem, SectorId } from './types';
import { CalendarPlus } from 'lucide-react';
import { triggerHaptic } from './utils/calendar';

import { BookingManagerModal } from './components/BookingManagerModal';
import { SectorDemoModal } from './components/SectorDemoModal';
import { MpesaModal } from './components/MpesaModal';

const STORAGE_KEY = 'webstudios_mobile_bookings_v1';
const THEME_KEY = 'webstudios_android_theme_v1';
const CURRENCY_KEY = 'webstudios_currency_v1';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTabId>('sectors');
  
  // Theme & Currency
  const [activeTheme, setActiveTheme] = useState<AndroidTheme>('cyan');
  const [currency, setCurrency] = useState<'KSH' | 'USD'>('KSH');
  
  // Search query in TopBar
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Supabase state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => {
    const cfg = getSupabaseConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.enabled !== false);
  });

  // Bookings list state - Clean and connected directly to Firestore & Supabase
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Strip out any legacy test dummy bookings
            return parsed.filter((b: BookingRecord) => b.id !== 'WS-BKG-84920' && b.id !== 'WS-BKG-91204');
          }
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Real-time Firestore sync
  useEffect(() => {
    const unsubscribeFirestore = subscribeBookings(
      (cloudBookings) => {
        setBookings((prev) => {
          // Merge avoiding duplicates
          const map = new Map<string, BookingRecord>();
          prev.forEach((b) => map.set(b.id, b));
          cloudBookings.forEach((b) => map.set(b.id, b));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
          );
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });
      },
      (error) => {
        console.warn('Real-time Firestore offline, using local storage:', error);
      }
    );

    return () => unsubscribeFirestore();
  }, []);

  // Real-time Supabase sync (if configured)
  useEffect(() => {
    const config = getSupabaseConfig();
    const hasConfig = Boolean(config.url && config.anonKey && config.enabled !== false);
    setIsSupabaseConnected(hasConfig);

    if (!hasConfig) return;

    // Initial fetch from Supabase
    fetchSupabaseBookings()
      .then((supaBookings) => {
        if (supaBookings.length > 0) {
          setBookings((prev) => {
            const map = new Map<string, BookingRecord>();
            prev.forEach((b) => map.set(b.id, b));
            supaBookings.forEach((b) => map.set(b.id, b));
            const merged = Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
            );
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore
            }
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn('Initial Supabase fetch deferred:', err);
      });

    // Realtime channel listener
    const unsubscribeSupabase = subscribeSupabaseBookings(() => {
      fetchSupabaseBookings()
        .then((fresh) => {
          setBookings(fresh);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          } catch {
            // ignore
          }
        })
        .catch(() => {});
    });

    return () => {
      if (unsubscribeSupabase) unsubscribeSupabase();
    };
  }, [isSupabaseConnected]);

  // Save bookings to localStorage as local cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // Load saved theme and currency
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY) as AndroidTheme;
      if (savedTheme) setActiveTheme(savedTheme);
      const savedCurrency = localStorage.getItem(CURRENCY_KEY) as 'KSH' | 'USD';
      if (savedCurrency) setCurrency(savedCurrency);
    } catch {
      // ignore
    }
  }, []);

  const handleThemeChange = (theme: AndroidTheme) => {
    triggerHaptic();
    setActiveTheme(theme);
    localStorage.setItem(THEME_KEY, theme);
  };

  const handleCurrencyToggle = () => {
    triggerHaptic();
    const next = currency === 'KSH' ? 'USD' : 'KSH';
    setCurrency(next);
    localStorage.setItem(CURRENCY_KEY, next);
  };

  // Modals state
  const [isBookingSheetOpen, setIsBookingSheetOpen] = useState<boolean>(false);
  const [isManagerOpen, setIsManagerOpen] = useState<boolean>(false);
  const [preselectedSectorId, setPreselectedSectorId] = useState<SectorId | undefined>(undefined);
  const [viewingPass, setViewingPass] = useState<BookingRecord | null>(null);
  const [viewingSector, setViewingSector] = useState<SectorItem | null>(null);
  const [demoSector, setDemoSector] = useState<SectorItem | null>(null);
  const [mpesaPayment, setMpesaPayment] = useState<{ isOpen: boolean; phone: string; amountKSh: number; bookingRef: string }>({
    isOpen: false,
    phone: '',
    amountKSh: 0,
    bookingRef: ''
  });

  // Booking handlers with persistent dual-sync (Supabase & Firestore)
  const handleBookingCreated = async (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Persist to Supabase if configured
    if (getSupabaseClient()) {
      saveBookingToSupabase(newBooking).catch((err) => {
        console.warn('Supabase save deferred:', err);
      });
    }

    // Persist to Firestore
    try {
      await saveBooking(newBooking);
    } catch (e) {
      console.warn('Firestore save deferred to local storage:', e);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    triggerHaptic();
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));

    // Delete from Supabase if configured
    if (getSupabaseClient()) {
      deleteBookingFromSupabase(bookingId).catch((err) => {
        console.warn('Supabase delete deferred:', err);
      });
    }

    // Delete from Firestore
    try {
      await deleteBooking(bookingId);
    } catch (e) {
      console.warn('Firestore delete deferred to local storage:', e);
    }
  };

  const handleRescheduleBooking = async (bookingId: string, newDate: string, newTime: string) => {
    triggerHaptic();
    const updated = bookings.find((b) => b.id === bookingId);
    if (updated) {
      const newRecord = { ...updated, date: newDate, timeSlot: newTime };
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? newRecord : b))
      );

      if (getSupabaseClient()) {
        saveBookingToSupabase(newRecord).catch((err) => {
          console.warn('Supabase update deferred:', err);
        });
      }

      try {
        await saveBooking(newRecord);
      } catch (e) {
        console.warn('Firestore update deferred to local storage:', e);
      }
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: BookingRecord['status']) => {
    triggerHaptic();
    const updated = bookings.find((b) => b.id === bookingId);
    if (updated) {
      const newRecord = { ...updated, status };
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? newRecord : b))
      );

      if (getSupabaseClient()) {
        saveBookingToSupabase(newRecord).catch((err) => {
          console.warn('Supabase status update deferred:', err);
        });
      }

      try {
        await saveBooking(newRecord);
      } catch (e) {
        console.warn('Firestore status update deferred to local storage:', e);
      }
    }
  };

  // Open booking sheet for a specific sector
  const handleBookSector = (sector: SectorItem) => {
    triggerHaptic();
    setPreselectedSectorId(sector.id);
    setIsBookingSheetOpen(true);
  };

  // From QuoteBuilder
  const handleBookConfiguredProject = (sectorId: SectorId) => {
    triggerHaptic();
    setPreselectedSectorId(sectorId);
    setIsBookingSheetOpen(true);
  };

  return (
    <AndroidFrame
      activeTheme={activeTheme}
      onThemeChange={handleThemeChange}
      onNavigateHome={() => setActiveTab('sectors')}
      onNavigateBack={() => setActiveTab('sectors')}
    >
      <OfflineIndicator />

      {/* Top Header App Bar with Supabase indicator */}
      <AndroidTopBar
        currency={currency}
        onCurrencyToggle={handleCurrencyToggle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        bookingCount={bookings.filter((b) => b.status === 'confirmed').length}
        onOpenMyBookings={() => setActiveTab('bookings')}
        activeTheme={activeTheme}
        isSupabaseConnected={isSupabaseConnected}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
      />

      {/* In-App PWA Install Banner */}
      <PWAInstallBanner />

      {/* Main Tab Views */}
      <main className="flex-1">
        {activeTab === 'sectors' && (
          <SectorCatalogView
            onSelectSector={(sector) => {
              triggerHaptic();
              setViewingSector(sector);
            }}
            onBookSector={handleBookSector}
            onOpenDemo={(sector) => {
              triggerHaptic();
              setDemoSector(sector);
            }}
            currency={currency}
            searchQuery={searchQuery}
            activeTheme={activeTheme}
          />
        )}

        {activeTab === 'quote' && (
          <QuoteBuilder
            currency={currency}
            onBookConfiguredProject={handleBookConfiguredProject}
            activeTheme={activeTheme}
          />
        )}

        {activeTab === 'book' && (
          <div className="p-4 space-y-4 animate-fade-in text-center py-8">
            <div className="w-16 h-16 rounded-3xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center shadow-lg">
              <CalendarPlus className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white">Book Webstudios Studio</h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Schedule your free 30-minute discovery call, technical scoping session, or reserve your 5-day build slot.
            </p>
            <button
              onClick={() => {
                triggerHaptic();
                setPreselectedSectorId(undefined);
                setIsBookingSheetOpen(true);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 active:scale-95 transition-transform inline-flex items-center gap-2"
            >
              <span>Launch Booking Wizard</span>
              <CalendarPlus className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === 'bookings' && (
          <MyBookingsView
            bookings={bookings}
            onOpenPass={(booking) => {
              triggerHaptic();
              setViewingPass(booking);
            }}
            onOpenNewBooking={() => {
              triggerHaptic();
              setIsBookingSheetOpen(true);
            }}
            onOpenManager={() => {
              triggerHaptic();
              setIsManagerOpen(true);
            }}
            currency={currency}
            isSupabaseConnected={isSupabaseConnected}
            onOpenSupabase={() => setIsSupabaseModalOpen(true)}
          />
        )}

        {activeTab === 'contact' && <DirectContactView />}
      </main>

      {/* Floating Action Button (FAB) for fast booking trigger */}
      {activeTab !== 'book' && (
        <button
          onClick={() => {
            triggerHaptic();
            setPreselectedSectorId(undefined);
            setIsBookingSheetOpen(true);
          }}
          className="fixed bottom-16 right-4 z-40 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-cyan-950/60 hover:opacity-95 active:scale-95 transition-all"
          aria-label="Quick Book Session"
        >
          <CalendarPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Book Session</span>
        </button>
      )}

      {/* Android Material 3 Bottom Navigation Bar */}
      <AndroidBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        bookingCount={bookings.filter((b) => b.status === 'confirmed').length}
        activeTheme={activeTheme}
      />

      {/* Modals & Bottom Sheets */}
      <BookingSheet
        isOpen={isBookingSheetOpen}
        onClose={() => setIsBookingSheetOpen(false)}
        preselectedSectorId={preselectedSectorId}
        currency={currency}
        onBookingCreated={handleBookingCreated}
        activeTheme={activeTheme}
      />

      <DigitalPassModal
        booking={viewingPass}
        onClose={() => setViewingPass(null)}
        onCancelBooking={handleCancelBooking}
        onRescheduleBooking={handleRescheduleBooking}
        currency={currency}
      />

      <SectorDetailModal
        sector={viewingSector}
        onClose={() => setViewingSector(null)}
        onBookThisSector={handleBookSector}
        currency={currency}
      />

      <BookingManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
        bookings={bookings}
        onUpdateStatus={handleUpdateStatus}
        onDeleteBooking={handleCancelBooking}
        currency={currency}
        isSupabaseConnected={isSupabaseConnected}
        onOpenSupabase={() => setIsSupabaseModalOpen(true)}
      />

      <SectorDemoModal
        sector={demoSector}
        onClose={() => setDemoSector(null)}
        onBookThisSector={handleBookSector}
        currency={currency}
      />

      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => {
          setIsSupabaseModalOpen(false);
          const cfg = getSupabaseConfig();
          setIsSupabaseConnected(Boolean(cfg.url && cfg.anonKey && cfg.enabled !== false));
        }}
        bookings={bookings}
        onBookingsSynced={(syncedBookings) => {
          setBookings(syncedBookings);
        }}
      />

      <MpesaModal
        isOpen={mpesaPayment.isOpen}
        onClose={() => setMpesaPayment((prev) => ({ ...prev, isOpen: false }))}
        phone={mpesaPayment.phone}
        amountKSh={mpesaPayment.amountKSh}
        bookingRef={mpesaPayment.bookingRef}
        onPaymentSuccess={async (receipt) => {
          const matched = bookings.find((b) => b.id === mpesaPayment.bookingRef);
          if (matched) {
            const updated = { ...matched, notes: `${matched.notes || ''} [M-Pesa Paid Ref: ${receipt}]` };
            await saveBooking(updated);
            if (getSupabaseClient()) {
              saveBookingToSupabase(updated).catch(() => {});
            }
          }
        }}
      />
    </AndroidFrame>
  );
}
