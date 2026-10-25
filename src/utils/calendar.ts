import { BookingRecord } from '../types';

export function generateICSContent(booking: BookingRecord): string {
  // Format date and time for ICS
  const dateClean = booking.date.replace(/-/g, '');
  // Extract approximate start time
  const timeMatch = booking.timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  let startHour = 10;
  let startMin = 0;
  
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    startHour = hour;
    startMin = minute;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dtStart = `${dateClean}T${pad(startHour)}${pad(startMin)}00`;
  
  // End time
  const endHour = startHour + Math.floor((startMin + booking.durationMinutes) / 60);
  const endMin = (startMin + booking.durationMinutes) % 60;
  const dtEnd = `${dateClean}T${pad(endHour)}${pad(endMin)}00`;

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Webstudios//Android Booking App//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${booking.id}@webstudios.world`,
    `DTSTAMP:${dateClean}T000000Z`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:Webstudios Booking: ${booking.title}`,
    `DESCRIPTION:Meeting for ${booking.clientName} (${booking.clientCompany || 'Client'}).\\nBooking ID: ${booking.id}\\nMeeting format: ${booking.meetingFormat}\\nJoin: ${booking.meetUrl || 'WhatsApp / Phone Call (+254 728 423 472)'}`,
    `LOCATION:${booking.meetingFormat === 'google-meet' ? (booking.meetUrl || 'Google Meet') : 'Phone / WhatsApp Call'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return icsLines.join('\r\n');
}

export function downloadICS(booking: BookingRecord) {
  const content = generateICSContent(booking);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${booking.id}-webstudios.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(booking: BookingRecord): string {
  const dateClean = booking.date.replace(/-/g, '');
  const timeMatch = booking.timeSlot.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  let startHour = 10;
  let startMin = 0;
  
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    startHour = hour;
    startMin = minute;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');
  const dtStart = `${dateClean}T${pad(startHour)}${pad(startMin)}00Z`;
  const endHour = startHour + Math.floor((startMin + booking.durationMinutes) / 60);
  const endMin = (startMin + booking.durationMinutes) % 60;
  const dtEnd = `${dateClean}T${pad(endHour)}${pad(endMin)}00Z`;

  const details = encodeURIComponent(
    `Webstudios Project Consultation\nID: ${booking.id}\nClient: ${booking.clientName}\nFormat: ${booking.meetingFormat}\nJoin Link: ${booking.meetUrl || 'Phone/WhatsApp +254 728 423 472'}\nNotes: ${booking.notes || 'None'}`
  );
  const title = encodeURIComponent(`Webstudios: ${booking.title}`);
  const location = encodeURIComponent(booking.meetUrl || 'WhatsApp / Phone Call');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
}

export function triggerHaptic() {
  if (typeof window !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate(15);
    } catch {
      // ignore
    }
  }
}
