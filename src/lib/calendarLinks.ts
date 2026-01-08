import type { SyncEventData, CalendarEvent } from '@/types';

/**
 * Format date for Google Calendar (YYYYMMDDTHHmmSSZ)
 */
function formatGoogleDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Format date for Outlook Calendar (YYYY-MM-DDTHH:mm:SSZ)
 */
function formatOutlookDate(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

/**
 * Build URL with proper encoding
 */
function buildUrl(baseUrl: string, params: Record<string, string | undefined>): string {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
}

/**
 * Convert CalendarEvent to privacy-protected SyncEventData
 */
export function createSyncEventData(event: CalendarEvent): SyncEventData {
  return {
    title: 'Synced Event',
    startDate: event.startDate,
    endDate: event.endDate,
    busyStatus: 'busy',
    description: '',
    location: '',
  };
}

/**
 * Generate Google Calendar deeplink
 */
export function generateGoogleCalendarLink(
  event: SyncEventData,
  email?: string
): string {
  const baseUrl = 'https://calendar.google.com/calendar/render';
  
  const startDate = formatGoogleDate(event.startDate);
  const endDate = formatGoogleDate(event.endDate);
  const dates = `${startDate}/${endDate}`;

  const params: Record<string, string | undefined> = {
    action: 'TEMPLATE',
    text: event.title,
    dates: dates,
    details: event.description || undefined,
    location: event.location || undefined,
    crm: 'BUSY', // Show as busy
    trp: 'true', // Transparency: busy
  };

  const googleCalendarUrl = buildUrl(baseUrl, params);

  // If email is provided, wrap the URL with AccountChooser for proper profile switching
  if (email) {
    const accountChooserUrl = new URL('https://accounts.google.com/AccountChooser');
    accountChooserUrl.searchParams.append('Email', email);
    accountChooserUrl.searchParams.append('continue', googleCalendarUrl);
    return accountChooserUrl.toString();
  }

  return googleCalendarUrl;
}

/**
 * Generate Outlook Calendar deeplink
 */
export function generateOutlookCalendarLink(
  event: SyncEventData,
  email?: string
): string {
  const baseUrl = 'https://outlook.live.com/calendar/deeplink/compose';

  const params: Record<string, string | undefined> = {
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description || undefined,
    location: event.location || undefined,
    startdt: formatOutlookDate(event.startDate),
    enddt: formatOutlookDate(event.endDate),
    freebusy: 'busy', // Show as busy
  };

  // Add email if provided (as required attendee)
  if (email) {
    params.to = email;
  }

  return buildUrl(baseUrl, params);
}

/**
 * Open calendar link in new window/tab
 * Recommended for PWA to avoid popup blockers
 */
export function openCalendarLink(url: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  
  // Trigger click
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy calendar link to clipboard
 * Useful fallback for mobile devices
 */
export async function copyCalendarLinkToClipboard(url: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
