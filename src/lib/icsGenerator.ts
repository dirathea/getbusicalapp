import type { SyncEventData } from '@/types';

/**
 * Format date for ICS file (YYYYMMDDTHHmmSSZ)
 */
function formatICSDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Generate current timestamp for ICS file
 */
function getICSTimestamp(): string {
  return formatICSDate(new Date());
}

/**
 * Generate unique ID for ICS event
 */
function generateUID(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}@snapcal.app`;
}

/**
 * Fold long lines according to RFC 5545
 * Lines should be no longer than 75 octets, excluding line break
 */
function foldLine(line: string): string {
  if (line.length <= 75) {
    return line;
  }

  const lines: string[] = [];
  let remaining = line;

  // First line can be 75 characters
  lines.push(remaining.substring(0, 75));
  remaining = remaining.substring(75);

  // Subsequent lines should be 74 characters (1 space + 74 chars)
  while (remaining.length > 74) {
    lines.push(' ' + remaining.substring(0, 74));
    remaining = remaining.substring(74);
  }

  if (remaining.length > 0) {
    lines.push(' ' + remaining);
  }

  return lines.join('\r\n');
}

/**
 * Escape special characters in ICS text fields
 */
function escapeICSText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')   // Backslash
    .replace(/;/g, '\\;')     // Semicolon
    .replace(/,/g, '\\,')     // Comma
    .replace(/\n/g, '\\n');   // Newline
}

/**
 * Generate ICS file content for a single event
 */
export function generateICSContent(event: SyncEventData): string {
  const uid = generateUID();
  const timestamp = getICSTimestamp();
  const startDate = formatICSDate(event.startDate);
  const endDate = formatICSDate(event.endDate);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SnapCal//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    foldLine(`SUMMARY:${escapeICSText(event.title)}`),
    'TRANSP:OPAQUE', // Show as busy
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
  ];

  // Add description if present
  if (event.description) {
    lines.push(foldLine(`DESCRIPTION:${escapeICSText(event.description)}`));
  }

  // Add location if present
  if (event.location) {
    lines.push(foldLine(`LOCATION:${escapeICSText(event.location)}`));
  }

  lines.push('END:VEVENT');
  lines.push('END:VCALENDAR');

  // Join with CRLF as per RFC 5545
  return lines.join('\r\n');
}

/**
 * Generate ICS file as Blob
 */
export function generateICSFile(event: SyncEventData): Blob {
  const content = generateICSContent(event);
  return new Blob([content], { type: 'text/calendar;charset=utf-8' });
}

/**
 * Download ICS file
 * Triggers browser download or opens system calendar picker on mobile
 */
export function downloadICSFile(blob: Blob, filename: string = 'event.ics'): void {
  // Ensure filename has .ics extension
  if (!filename.endsWith('.ics')) {
    filename += '.ics';
  }

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Generate and download ICS file for an event
 */
export function downloadEventAsICS(event: SyncEventData, filename?: string): void {
  const blob = generateICSFile(event);
  const defaultFilename = `synced-event-${Date.now()}.ics`;
  downloadICSFile(blob, filename || defaultFilename);
}
