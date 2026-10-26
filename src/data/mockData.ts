import { SectorItem, AddonOption, BookingRecord } from '../types';

export const WEBSTUDIOS_PACKAGES: SectorItem[] = [
  {
    id: 'restaurants', // keeping id compatible with SectorId
    name: 'Starter Website Package',
    tagline: '1–5 Pages · Sub-second mobile load · Fast delivery',
    badge: 'Best for Small Businesses',
    description: 'Hand-coded, ultra-fast website designed to establish a credible online presence. Includes mobile-first layout, contact forms, Google Maps, and search engine optimization.',
    basePriceKSh: 13700,
    basePriceUSD: 105,
    deliveryDays: 5,
    features: [
      'Up to 5 custom hand-coded pages',
      'Sub-second load times on mobile 4G',
      'Free .co.ke or .com domain for 1 year',
      'Free SSL certificate & global CDN hosting',
      '3 professional business emails included',
      'Google Maps & WhatsApp click-to-chat'
    ],
    bookingSystemType: 'Website Project Kickoff',
    iconName: 'Globe',
    accentColor: '#0EA5E9',
    previewUrl: 'https://webstudios.world'
  },
  {
    id: 'clinics',
    name: 'Business & Lead Generation',
    tagline: 'Custom CMS · Service catalogs · SEO suite',
    badge: 'Most Popular',
    description: 'Comprehensive business platform built for clinics, corporate firms, schools, and professional service companies seeking high conversion and Google rankings.',
    basePriceKSh: 22000,
    basePriceUSD: 170,
    deliveryDays: 7,
    features: [
      'Up to 10 hand-coded responsive sections',
      'Interactive client inquiry & booking intake',
      'Comprehensive Technical SEO & Schema markup',
      'Free 1-year domain + 5 business mailboxes',
      'Automated email lead notifications',
      'Google Search Console indexing'
    ],
    bookingSystemType: 'Business Website Scoping',
    iconName: 'Briefcase',
    accentColor: '#10B981',
    previewUrl: 'https://webstudios.world'
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Store + M-Pesa STK',
    tagline: 'Daraja M-Pesa STK Push · Cards · Order Dashboard',
    badge: 'High Conversion Checkout',
    description: 'Complete online retail store with instant Safaricom M-Pesa STK push prompt, card payments, product catalog, inventory tracking, and order receipts.',
    basePriceKSh: 28500,
    basePriceUSD: 220,
    deliveryDays: 8,
    features: [
      'Daraja M-Pesa STK push express checkout',
      'Credit card & mobile money processing',
      'Product catalog with search & category filters',
      'Order management admin dashboard',
      'Automated SMS / WhatsApp order confirmations',
      'High-speed headless architecture (99+ score)'
    ],
    bookingSystemType: 'E-Commerce Project Kickoff',
    iconName: 'ShoppingBag',
    accentColor: '#8B5CF6',
    previewUrl: 'https://webstudios.world'
  },
  {
    id: 'corporate',
    name: 'Custom Web Application & Portals',
    tagline: 'Client portals · Custom booking engines · APIs',
    badge: 'Full-Stack Architecture',
    description: 'Tailored full-stack web applications featuring custom scheduling workflows, patient/client portals, multi-role user authentication, and backend database integrations.',
    basePriceKSh: 38000,
    basePriceUSD: 295,
    deliveryDays: 12,
    features: [
      'Tailored custom booking or scheduling workflow',
      'User authentication & client dashboards',
      'PostgreSQL / Cloud database persistence',
      'Third-party API and payment integrations',
      'Dedicated staging server for client testing',
      'Complete source code delivery'
    ],
    bookingSystemType: 'Custom App Architecture Review',
    iconName: 'Cpu',
    accentColor: '#F59E0B',
    previewUrl: 'https://webstudios.world'
  },
  {
    id: 'legal',
    name: 'Website Redesign & Speed Fix',
    tagline: 'Replace slow WordPress/Wix · 99+ Lighthouse guarantee',
    badge: 'Performance Upgrade',
    description: 'Transform your existing bloated, slow WordPress or Wix website into a modern, lightning-fast React application that loads under 1 second.',
    basePriceKSh: 15000,
    basePriceUSD: 115,
    deliveryDays: 5,
    features: [
      'Zero plugin bloat (clean hand-coded code)',
      'Sub-second mobile loading speed guarantee',
      'Preserve existing SEO URLs and backlinks',
      'Modern responsive UI redesign',
      'Security hardening with zero vulnerability plugins',
      'Lighthouse 95+ performance certificate'
    ],
    bookingSystemType: 'Website Speed Audit',
    iconName: 'Zap',
    accentColor: '#EC4899',
    previewUrl: 'https://webstudios.world'
  },
  {
    id: 'wellness',
    name: 'Managed Hosting & Care Plan',
    tagline: 'Daily cloud backups · Uptime SLA · Monthly edits',
    badge: 'Ongoing Support',
    description: 'Hands-off peace of mind. We manage your domain, SSL renewals, high-speed hosting, security patches, and monthly content updates.',
    basePriceKSh: 4500,
    basePriceUSD: 35,
    deliveryDays: 1,
    features: [
      'Ultra-fast global cloud hosting & SSL',
      'Daily automated cloud backups',
      '24/7 uptime monitoring & instant alerts',
      'Up to 3 hours of monthly content edits',
      'Monthly performance and traffic reports',
      'Priority WhatsApp technical assistance'
    ],
    bookingSystemType: 'Care Plan Consultation',
    iconName: 'ShieldCheck',
    accentColor: '#06B6D4',
    previewUrl: 'https://webstudios.world'
  }
];

export const SECTORS = WEBSTUDIOS_PACKAGES;

export const ADDONS: AddonOption[] = [
  {
    id: 'mpesa-stk',
    name: 'Daraja M-Pesa STK Push Express',
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
  }
];

// Clean seed bookings: Starts empty so user only sees real bookings!
export const INITIAL_BOOKINGS: BookingRecord[] = [];
