import React, { useState, useEffect, useRef } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { AndroidTopBar } from './components/AndroidTopBar';
import { AndroidBottomNav, DeveloperTabId } from './components/AndroidBottomNav';
import { DeveloperDashboard } from './components/DeveloperDashboard';
import { PipelineAnalyticsView } from './components/PipelineAnalyticsView';
import { SupabaseSettingsView } from './components/SupabaseSettingsView';
import { ManualIntakeModal } from './components/ManualIntakeModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { subscribeBookings, saveBooking, deleteBooking } from './lib/firebase.ts';
import { 
  getSupabaseConfig, 
  getSupabaseClient, 
  saveBookingToSupabase, 
  deleteBookingFromSupabase, 
  fetchSupabaseBookings, 
  subscribeSupabaseBookings,
  sendTestBookingToSupabase,
  RealtimeBookingEvent
} from './lib/supabase';
import { BookingRecord, BookingStatus } from './types';
import { triggerHaptic } from './utils/calendar';
import { postSystemNotification } from './utils/notifications';

const STORAGE_KEY = 'webstudios_mobile_bookings_v2';
const CURRENCY_KEY = 'webstudios_currency_v1';
const SOUND_KEY = 'webstudios_sound_enabled_v1';

// Web Audio API synthesizer for instant booking arrival chime
function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5 note

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Audio context may require prior user interaction
  }
}

export default function App() {
  // Navigation: Feed (Bookings), Analytics (Pipeline), Supabase (Database)
  const [activeTab, setActiveTab] = useState<DeveloperTabId>('feed');
  const [currency, setCurrency] = useState<'KSH' | 'USD'>('KSH');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(SOUND_KEY);
      return saved !== 'false';
    }
    return true;
  });

  // Supabase connection state
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => {
    const cfg = getSupabaseConfig();
    return Boolean(cfg.url && cfg.anonKey && cfg.enabled !== false);
  });
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Latest incoming booking for top push alert
  const [latestIncomingBooking, setLatestIncomingBooking] = useState<BookingRecord | null>(null);

  // Bookings list state - purely user & client data, no mock clutter
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            // Strip any legacy dummy IDs
            return parsed.filter((b: BookingRecord) => b.id !== 'WS-BKG-84920' && b.id !== 'WS-BKG-91204');
          }
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  // Load preferences
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem(CURRENCY_KEY) as 'KSH' | 'USD';
      if (savedCurrency) setCurrency(savedCurrency);
    } catch {
      // ignore
    }
  }, []);

  const handleCurrencyToggle = () => {
    triggerHaptic();
    const next = currency === 'KSH' ? 'USD' : 'KSH';
    setCurrency(next);
    localStorage.setItem(CURRENCY_KEY, next);
  };

  const handleToggleSound = () => {
    triggerHaptic();
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem(SOUND_KEY, String(next));
  };

  // Save to localStorage as cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // Real-time Firestore Sync
  useEffect(() => {
    const unsubscribeFirestore = subscribeBookings(
      (cloudBookings) => {
        setBookings((prev) => {
          const map = new Map<string, BookingRecord>();
          prev.forEach((b) => map.set(b.id, b));
          cloudBookings.forEach((b) => map.set(b.id, b));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
          );
          return merged;
        });
      },
      (error) => {
        console.warn('Real-time Firestore offline, using local storage:', error);
      }
    );

    return () => unsubscribeFirestore();
  }, []);

  // Real-time Supabase Sync & Push Notification Listener
  useEffect(() => {
    const config = getSupabaseConfig();
    const hasConfig = Boolean(config.url && config.anonKey && config.enabled !== false);
    setIsSupabaseConnected(hasConfig);

    if (!hasConfig) return;

    // Initial load from Supabase
    fetchSupabaseBookings()
      .then((supaBookings) => {
        if (supaBookings.length > 0) {
          setBookings((prev) => {
            const map = new Map<string, BookingRecord>();
            prev.forEach((b) => map.set(b.id, b));
            supaBookings.forEach((b) => map.set(b.id, b));
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
            );
          });
        }
      })
      .catch((err) => {
        console.warn('Initial Supabase fetch deferred:', err);
      });

    // Realtime channel listener for push events
    const unsubscribeSupabase = subscribeSupabaseBookings((event: RealtimeBookingEvent) => {
      if (event.eventType === 'INSERT' && event.record) {
        const incoming = event.record;
        // Trigger notification
        if (soundEnabled) {
          playNotificationChime();
        }
        triggerHaptic();
        postSystemNotification({
          title: "🎉 New Client: " + (incoming.clientName || "Inquiry Received"),
          body: (incoming.sectorName || incoming.planName || "General Inquiry") + " • " + (incoming.title || incoming.notes || "Tap to view details"),
          tag: "booking-" + incoming.id,
          data: { url: "/simon/", id: incoming.id }
        });
        setLatestIncomingBooking(incoming);

        // Add to state
        setBookings((prev) => {
          const exists = prev.some((b) => b.id === incoming.id);
          if (exists) return prev;
          return [incoming, ...prev];
        });
      } else if (event.eventType === 'DELETE' && event.oldRecordId) {
        setBookings((prev) => prev.filter((b) => b.id !== event.oldRecordId));
      } else {
        // Full refresh on update
        fetchSupabaseBookings()
          .then((fresh) => {
            if (fresh.length > 0) {
              setBookings(fresh);
            }
          })
          .catch(() => {});
      }
    });

    return () => {
      if (unsubscribeSupabase) unsubscribeSupabase();
    };
  }, [isSupabaseConnected, soundEnabled]);

  // Status updates
  const handleUpdateStatus = async (bookingId: string, status: BookingStatus) => {
    triggerHaptic();
    const updated = bookings.find((b) => b.id === bookingId);
    if (!updated) return;

    const newRecord: BookingRecord = { ...updated, status };
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? newRecord : b)));

    // Sync to Supabase
    if (getSupabaseClient()) {
      saveBookingToSupabase(newRecord).catch((err) => {
        console.warn('Supabase status update error:', err);
      });
    }

    // Sync to Firestore
    try {
      await saveBooking(newRecord);
    } catch (e) {
      console.warn('Firestore status update error:', e);
    }
  };

  // Delete booking
  const handleDeleteBooking = async (bookingId: string) => {
    triggerHaptic();
    setBookings((prev) => prev.filter((b) => b.id !== bookingId));

    if (getSupabaseClient()) {
      deleteBookingFromSupabase(bookingId).catch((err) => {
        console.warn('Supabase delete error:', err);
      });
    }

    try {
      await deleteBooking(bookingId);
    } catch (e) {
      console.warn('Firestore delete error:', e);
    }
  };

  // Manual entry save
  const handleSaveManualBooking = async (booking: BookingRecord) => {
    setBookings((prev) => [booking, ...prev]);

    if (getSupabaseClient()) {
      saveBookingToSupabase(booking).catch((err) => {
        console.warn('Supabase save error:', err);
      });
    }

    try {
      await saveBooking(booking);
    } catch (e) {
      console.warn('Firestore save error:', e);
    }
  };

  // Send sample test booking via Supabase
  const handleSendTestBooking = async () => {
    try {
      const testRecord = await sendTestBookingToSupabase();
      if (soundEnabled) {
        playNotificationChime();
      }
      setLatestIncomingBooking(testRecord);
      setBookings((prev) => {
        const exists = prev.some((b) => b.id === testRecord.id);
        if (exists) return prev;
        return [testRecord, ...prev];
      });
    } catch (err) {
      console.error('Failed to send test booking to Supabase:', err);
      alert('Could not push to Supabase. Please verify your Supabase URL & Anon Key in the Supabase tab.');
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <AndroidFrame
      activeTheme="cyan"
      onThemeChange={() => {}}
      onNavigateHome={() => setActiveTab('feed')}
      onNavigateBack={() => setActiveTab('feed')}
    >
      <OfflineIndicator />

      {/* Top Header App Bar tailored for Developer */}
      <AndroidTopBar
        currency={currency}
        onCurrencyToggle={handleCurrencyToggle}
        bookingCount={bookings.length}
        pendingCount={pendingCount}
        isSupabaseConnected={isSupabaseConnected}
        onOpenSupabase={() => setActiveTab('supabase')}
        onOpenManualEntry={() => setIsManualModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'feed' && (
          <DeveloperDashboard
            bookings={bookings}
            onUpdateStatus={handleUpdateStatus}
            onDeleteBooking={handleDeleteBooking}
            onOpenSupabase={() => setActiveTab('supabase')}
            onOpenManualEntry={() => setIsManualModalOpen(true)}
            onSendTestBooking={handleSendTestBooking}
            isSupabaseConnected={isSupabaseConnected}
            currency={currency}
            latestIncomingBooking={latestIncomingBooking}
            onDismissIncomingAlert={() => setLatestIncomingBooking(null)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        )}

        {activeTab === 'analytics' && (
          <PipelineAnalyticsView
            bookings={bookings}
            currency={currency}
          />
        )}

        {activeTab === 'supabase' && (
          <SupabaseSettingsView
            bookings={bookings}
            onBookingsSynced={(synced) => setBookings(synced)}
            onSendTestBooking={handleSendTestBooking}
          />
        )}
      </main>

      {/* Developer Bottom Navigation Bar */}
      <AndroidBottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingCount={pendingCount}
        totalCount={bookings.length}
      />

      {/* Manual Intake Modal */}
      <ManualIntakeModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleSaveManualBooking}
        currency={currency}
      />

      {/* Supabase Config Modal (if triggered from top bar when on other tabs) */}
      {isSupabaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <SupabaseSettingsView
              bookings={bookings}
              onBookingsSynced={(synced) => setBookings(synced)}
              onSendTestBooking={handleSendTestBooking}
              isModal={true}
              onClose={() => {
                setIsSupabaseModalOpen(false);
                const cfg = getSupabaseConfig();
                setIsSupabaseConnected(Boolean(cfg.url && cfg.anonKey && cfg.enabled !== false));
              }}
            />
          </div>
        </div>
      )}
    </AndroidFrame>
  );
}
