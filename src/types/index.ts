export type SectorId = 
  | 'restaurants'
  | 'clinics'
  | 'real-estate'
  | 'ecommerce'
  | 'legal'
  | 'wellness'
  | 'schools'
  | 'corporate';

export interface SectorItem {
  id: SectorId;
  name: string;
  tagline: string;
  badge: string;
  description: string;
  basePriceKSh: number;
  basePriceUSD: number;
  deliveryDays: number;
  features: string[];
  bookingSystemType: string;
  iconName: string;
  accentColor: string;
  previewUrl: string;
}

export type BookingType = 
  | 'discovery'
  | 'scoping'
  | 'kickoff'
  | 'audit';

export interface BookingSlot {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  available: boolean;
}

export interface BookingRecord {
  id: string;
  title: string;
  bookingType: BookingType;
  sectorId?: SectorId;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany?: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  durationMinutes: number;
  meetingFormat: 'google-meet' | 'whatsapp-call' | 'phone-call';
  meetUrl?: string;
  estimatedCostKSh: number;
  estimatedCostUSD: number;
  currency: 'KSH' | 'USD';
  addons: string[];
  notes?: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: string;
  qrCodeToken: string;
}

export interface AddonOption {
  id: string;
  name: string;
  description: string;
  priceKSh: number;
  priceUSD: number;
}
