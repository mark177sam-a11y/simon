import { SectorItem, AddonOption, BookingRecord } from '../types';

export const SECTORS: SectorItem[] = [
  {
    id: 'restaurants',
    name: 'Restaurants & Hospitality',
    tagline: 'Table reservations, QR menus & food ordering',
    badge: 'High Conversion',
    description: 'Custom-coded digital dining experiences featuring instant table reservation booking, live QR interactive menus, dietary filters, and direct WhatsApp / M-Pesa order dispatch.',
    basePriceKSh: 14500,
    basePriceUSD: 110,
    deliveryDays: 5,
    features: [
      'Interactive Table Reservation Calendar',
      'Digital Mobile Menu with category filtering',
      'Direct M-Pesa & Card Checkout for takeaway',
      'Google Maps & Open Graph location schema',
      'Instant SMS / WhatsApp booking alerts',
      'Sub-second 99+ mobile Lighthouse score'
    ],
    bookingSystemType: 'Table & Private Dining Scheduler',
    iconName: 'UtensilsCrossed',
    accentColor: '#F97316',
    previewUrl: 'https://webstudios.world/sectors/restaurants'
  },
  {
    id: 'clinics',
    name: 'Medical & Dental Clinics',
    tagline: 'Patient intake, doctor slots & telehealth',
    badge: 'HIPAA & Compliance',
    description: 'Clean medical and dental clinic websites with appointment scheduling by doctor, consultation type (in-clinic vs video), intake questionnaires, and automated reminder alerts.',
    basePriceKSh: 18900,
    basePriceUSD: 145,
    deliveryDays: 7,
    features: [
      'Specialist & Practitioner Slot Booking',
      'Digital Patient Intake & Medical History forms',
      'Insurance provider badges & coverage guide',
      'Automated SMS / Email appointment reminders',
      'Emergency WhatsApp hotline direct dial',
      'Encrypted SSL & medical schema markup'
    ],
    bookingSystemType: 'Patient Appointment Engine',
    iconName: 'Stethoscope',
    accentColor: '#0EA5E9',
    previewUrl: 'https://webstudios.world/sectors/clinics'
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Properties',
    tagline: 'Property listings, tour bookings & lead capture',
    badge: 'Lead Accelerator',
    description: 'High-impact real estate showcase with verified property catalogs, filterable neighborhood search, interactive virtual tour bookings, and direct broker contact forms.',
    basePriceKSh: 22500,
    basePriceUSD: 170,
    deliveryDays: 8,
    features: [
      'Property Viewing Tour Booking Calendar',
      'Floor plan viewer & high-res image galleries',
      'Neighborhood amenity & price filter system',
      'Mortgage & installment calculator tool',
      'Direct WhatsApp agent inquiry buttons',
      'Automated PDF property brochure download'
    ],
    bookingSystemType: 'Site Inspection & Viewing Scheduler',
    iconName: 'Building2',
    accentColor: '#10B981',
    previewUrl: 'https://webstudios.world/sectors/real-estate'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce & Retail Stores',
    tagline: 'M-Pesa STK push, card payments & product catalog',
    badge: 'Sub-second Checkout',
    description: 'Lightning-fast headless e-commerce store with seamless Daraja M-Pesa STK Push, credit card checkout, inventory tracking, order management, and customer accounts.',
    basePriceKSh: 26000,
    basePriceUSD: 195,
    deliveryDays: 10,
    features: [
      'Instant Daraja M-Pesa STK Push Express checkout',
      'Visa / Mastercard / Flutterwave integration',
      'Real-time inventory & stock tracking',
      'Automated order confirmation receipts via SMS',
      'Delivery fee calculator by area/county',
      'Admin order management dashboard'
    ],
    bookingSystemType: 'Order & Delivery Checkout System',
    iconName: 'ShoppingBag',
    accentColor: '#8B5CF6',
    previewUrl: 'https://webstudios.world/sectors/ecommerce'
  },
  {
    id: 'legal',
    name: 'Law Firms & Accounting',
    tagline: 'Confidential case evaluation & retainer bookings',
    badge: 'Institutional Trust',
    description: 'Dignified, credible corporate presence for advocates, law firms, and certified accountants with confidential case intake, fee estimates, and consultation scheduling.',
    basePriceKSh: 19500,
    basePriceUSD: 150,
    deliveryDays: 6,
    features: [
      'Confidential Case Evaluation Booking',
      'Practice area directory & attorney profiles',
      'Client document upload portal',
      'Retainer fee enquiry & estimate generator',
      'Secure encrypted contact forms',
      'Professional legal schema and Google ranking'
    ],
    bookingSystemType: 'Legal Consultation Booking',
    iconName: 'Scale',
    accentColor: '#6366F1',
    previewUrl: 'https://webstudios.world/sectors/legal'
  },
  {
    id: 'wellness',
    name: 'Salons, Spas & Fitness',
    tagline: 'Stylist/trainer selection & appointment calendar',
    badge: 'Popular',
    description: 'Modern, vibrant aesthetic for barbers, luxury hair studios, day spas, and personal trainers with live stylist chair bookings, service duration slots, and prepay options.',
    basePriceKSh: 15200,
    basePriceUSD: 115,
    deliveryDays: 5,
    features: [
      'Live Stylist / Coach Availability Grid',
      'Service bundle picker with dynamic pricing',
      'Deposit payment via M-Pesa or Card',
      'Instagram feed synchronization',
      'Google Reviews live verified showcase',
      'Client SMS appointment confirmations'
    ],
    bookingSystemType: 'Salon Chair & Fitness Slot Scheduler',
    iconName: 'Sparkles',
    accentColor: '#EC4899',
    previewUrl: 'https://webstudios.world/sectors/wellness'
  },
  {
    id: 'schools',
    name: 'Schools & Academies',
    tagline: 'Online admissions, fee payments & campus tour slots',
    badge: 'EdTech Ready',
    description: 'Comprehensive portal for private schools, kindergartens, and training institutes featuring admission applications, term fee payment integration, and academic calendars.',
    basePriceKSh: 21000,
    basePriceUSD: 160,
    deliveryDays: 8,
    features: [
      'Campus Tour & Open Day Booking',
      'Online Student Admission Application Forms',
      'Term fee structure & payment tracking',
      'Curriculum guide & term calendar downloads',
      'Parent communication noticeboard',
      'Staff & department directory'
    ],
    bookingSystemType: 'School Tour & Admission Booking',
    iconName: 'GraduationCap',
    accentColor: '#14B8A6',
    previewUrl: 'https://webstudios.world/sectors/schools'
  },
  {
    id: 'corporate',
    name: 'Corporate & Tech Startups',
    tagline: 'High-growth lead generation & investor pitch showcases',
    badge: 'Enterprise Performance',
    description: 'Sleek, high-converting digital presence for corporate enterprises, SaaS products, and fintech startups designed to drive demo bookings, investor interest, and corporate RFPs.',
    basePriceKSh: 24000,
    basePriceUSD: 180,
    deliveryDays: 7,
    features: [
      'Executive Product Demo Scheduler',
      'Interactive ROI / Cost Benefit Calculator',
      'Multi-currency pricing tiers',
      'Investor pitch deck and whitepaper lead gate',
      'HubSpot / CRM webhook integrations',
      'Sub-second enterprise global CDN hosting'
    ],
    bookingSystemType: 'Executive Demo & Discovery Booking',
    iconName: 'Briefcase',
    accentColor: '#3B82F6',
    previewUrl: 'https://webstudios.world/sectors/corporate'
  }
];

export const ADDONS: AddonOption[] = [
  {
    id: 'mpesa-stk',
    name: 'Daraja M-Pesa STK Push Checkout',
    description: 'Direct prompt on customer phones for instant payment confirmation with zero manual ledger entry.',
    priceKSh: 4500,
    priceUSD: 35
  },
  {
    id: 'custom-booking',
    name: 'Custom Interactive Booking Engine',
    description: 'Calendar slot reservation, customer reminders, staff selection, and automated Google Calendar sync.',
    priceKSh: 4000,
    priceUSD: 30
  },
  {
    id: 'seo-boost',
    name: 'Advanced Technical SEO & Schema Suite',
    description: 'Rich snippets, local business JSON-LD markup, sitemap index, and Google Search Console indexing.',
    priceKSh: 3000,
    priceUSD: 25
  },
  {
    id: 'domain-emails',
    name: 'Domain (.co.ke / .com) + 5 Business Emails',
    description: '1 year domain registration with Google Workspace or high-speed encrypted business mailboxes.',
    priceKSh: 3500,
    priceUSD: 28
  },
  {
    id: 'priority-delivery',
    name: 'Priority Fast-Track (4-Day Delivery)',
    description: 'Dedicated senior lead developer allocated for rapid turn-around and priority revision cycles.',
    priceKSh: 5000,
    priceUSD: 40
  },
  {
    id: 'care-plan',
    name: '1-Year Maintenance & Uptime SLA',
    description: 'Daily automated cloud backups, 24/7 uptime monitoring, security patching, and monthly content edits.',
    priceKSh: 6000,
    priceUSD: 45
  }
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'WS-BKG-84920',
    title: 'Restaurant Website & Table Booking System Kickoff',
    bookingType: 'kickoff',
    sectorId: 'restaurants',
    clientName: 'Alex Mwangi',
    clientEmail: 'alex@savannahgrill.co.ke',
    clientPhone: '+254 712 345 678',
    clientCompany: 'Savannah Flame Grill & Lounge',
    date: '2026-10-27',
    timeSlot: '10:00 AM - 10:45 AM',
    durationMinutes: 45,
    meetingFormat: 'google-meet',
    meetUrl: 'https://meet.google.com/ws-bkg-84920',
    estimatedCostKSh: 23000,
    estimatedCostUSD: 175,
    currency: 'KSH',
    addons: ['mpesa-stk', 'custom-booking'],
    notes: 'Require online table booking for 120-seat dining area and digital QR menu with M-Pesa takeaway ordering.',
    status: 'confirmed',
    createdAt: '2026-10-24T14:30:00Z',
    qrCodeToken: 'WS-BKG-84920-VERIFIED'
  },
  {
    id: 'WS-BKG-91204',
    title: 'Dental Clinic Appointment Platform Discovery',
    bookingType: 'discovery',
    sectorId: 'clinics',
    clientName: 'Dr. Sarah Kamau',
    clientEmail: 'sarah@smilecare.africa',
    clientPhone: '+254 722 890 123',
    clientCompany: 'SmileCare Dental Clinic Nairobi',
    date: '2026-10-29',
    timeSlot: '02:30 PM - 03:00 PM',
    durationMinutes: 30,
    meetingFormat: 'whatsapp-call',
    estimatedCostKSh: 18900,
    estimatedCostUSD: 145,
    currency: 'KSH',
    addons: ['custom-booking', 'seo-boost'],
    notes: 'Scoping two dental chairs, insurance options display, and patient intake forms.',
    status: 'confirmed',
    createdAt: '2026-10-25T08:15:00Z',
    qrCodeToken: 'WS-BKG-91204-VERIFIED'
  }
];
