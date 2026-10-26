import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BookingRecord } from '../types';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  enabled: boolean;
}

const SUPABASE_STORAGE_KEY = 'webstudios_supabase_config_v1';

// SQL statement to create the bookings table in Supabase
export const SUPABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  booking_type TEXT NOT NULL,
  sector_id TEXT,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  client_company TEXT,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  meeting_format TEXT DEFAULT 'google-meet',
  meet_url TEXT,
  estimated_cost_ksh NUMERIC DEFAULT 0,
  estimated_cost_usd NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'KSH',
  addons JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  qr_code_token TEXT
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Allow public read and write access for bookings app
CREATE POLICY "Allow public read bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Allow public insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete bookings" ON public.bookings FOR DELETE USING (true);

-- Enable Realtime for the bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
`;

let clientInstance: SupabaseClient | null = null;
let currentConfigString = '';

// Get config from localStorage or Vite environment variables
export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_URL || '';
  const envKey = (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SUPABASE_ANON_KEY || '';

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(SUPABASE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<SupabaseConfig>;
        return {
          url: parsed.url || envUrl,
          anonKey: parsed.anonKey || envKey,
          enabled: parsed.enabled !== false && Boolean(parsed.url || envUrl)
        };
      }
    } catch {
      // ignore
    }
  }

  return {
    url: envUrl,
    anonKey: envKey,
    enabled: Boolean(envUrl && envKey)
  };
}

// Save config
export function saveSupabaseConfig(config: SupabaseConfig): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SUPABASE_STORAGE_KEY, JSON.stringify(config));
  }
  // Reset cached instance
  clientInstance = null;
  currentConfigString = '';
}

// Get or initialize client
export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  const keyString = `${config.url}::${config.anonKey}`;
  if (clientInstance && currentConfigString === keyString) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    currentConfigString = keyString;
    return clientInstance;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Helper to convert DB snake_case record to BookingRecord
export function mapSupabaseToBooking(row: Record<string, unknown>): BookingRecord {
  return {
    id: String(row.id || ''),
    title: String(row.title || 'Studio Consultation'),
    bookingType: (row.booking_type || 'discovery') as BookingRecord['bookingType'],
    sectorId: row.sector_id ? (row.sector_id as BookingRecord['sectorId']) : undefined,
    clientName: String(row.client_name || ''),
    clientEmail: String(row.client_email || ''),
    clientPhone: String(row.client_phone || ''),
    clientCompany: row.client_company ? String(row.client_company) : undefined,
    date: String(row.date || new Date().toISOString().split('T')[0]),
    timeSlot: String(row.time_slot || '10:00 AM - 10:30 AM'),
    durationMinutes: Number(row.duration_minutes || 30),
    meetingFormat: (row.meeting_format || 'google-meet') as BookingRecord['meetingFormat'],
    meetUrl: row.meet_url ? String(row.meet_url) : undefined,
    estimatedCostKSh: Number(row.estimated_cost_ksh || 0),
    estimatedCostUSD: Number(row.estimated_cost_usd || 0),
    currency: (row.currency || 'KSH') as 'KSH' | 'USD',
    addons: Array.isArray(row.addons) ? (row.addons as string[]) : [],
    notes: row.notes ? String(row.notes) : undefined,
    status: (row.status || 'confirmed') as BookingRecord['status'],
    createdAt: String(row.created_at || new Date().toISOString()),
    qrCodeToken: String(row.qr_code_token || row.id || '')
  };
}

// Helper to convert BookingRecord to DB snake_case payload
export function mapBookingToSupabase(booking: BookingRecord): Record<string, unknown> {
  return {
    id: booking.id,
    title: booking.title,
    booking_type: booking.bookingType,
    sector_id: booking.sectorId || null,
    client_name: booking.clientName,
    client_email: booking.clientEmail,
    client_phone: booking.clientPhone || null,
    client_company: booking.clientCompany || null,
    date: booking.date,
    time_slot: booking.timeSlot,
    duration_minutes: booking.durationMinutes,
    meeting_format: booking.meetingFormat,
    meet_url: booking.meetUrl || null,
    estimated_cost_ksh: booking.estimatedCostKSh,
    estimated_cost_usd: booking.estimatedCostUSD,
    currency: booking.currency,
    addons: booking.addons,
    notes: booking.notes || null,
    status: booking.status,
    created_at: booking.createdAt,
    qr_code_token: booking.qrCodeToken
  };
}

// Test Supabase connection
export async function testSupabaseConnection(overrideUrl?: string, overrideKey?: string): Promise<{ success: boolean; message: string; rowCount?: number }> {
  try {
    const config = getSupabaseConfig();
    const url = overrideUrl || config.url;
    const anonKey = overrideKey || config.anonKey;

    if (!url || !anonKey) {
      return { success: false, message: 'Supabase URL and Anon Key are required.' };
    }

    const client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, count, error } = await client
      .from('bookings')
      .select('id', { count: 'exact' })
      .limit(1);

    if (error) {
      // Check if table does not exist
      if (error.code === '42P01' || error.message.includes('relation "public.bookings" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! (Note: The "bookings" table needs to be created using the SQL script).'
        };
      }
      return { success: false, message: `Supabase Error: ${error.message} (${error.code || 'unknown'})` };
    }

    return {
      success: true,
      message: `Connected successfully! Found ${count ?? data?.length ?? 0} bookings in Supabase.`,
      rowCount: count ?? data?.length ?? 0
    };
  } catch (err) {
    return {
      success: false,
      message: err instanceof Error ? err.message : 'Unknown connection error'
    };
  }
}

// Fetch all bookings from Supabase
export async function fetchSupabaseBookings(): Promise<BookingRecord[]> {
  const client = getSupabaseClient();
  if (!client) return [];

  const { data, error } = await client
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.warn('Error fetching bookings from Supabase:', error);
    throw error;
  }

  return (data || []).map(mapSupabaseToBooking);
}

// Save or update booking in Supabase
export async function saveBookingToSupabase(booking: BookingRecord): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const payload = mapBookingToSupabase(booking);
  const { error } = await client
    .from('bookings')
    .upsert(payload, { onConflict: 'id' });

  if (error) {
    console.error('Failed to save booking to Supabase:', error);
    throw error;
  }
}

// Delete booking from Supabase
export async function deleteBookingFromSupabase(bookingId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  const { error } = await client
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) {
    console.error('Failed to delete booking from Supabase:', error);
    throw error;
  }
}

// Subscribe to Supabase Realtime changes
export function subscribeSupabaseBookings(onChange: () => void): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('public:bookings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Supabase realtime subscription failed:', err);
    return null;
  }
}
