import type { SyncEventData, ExtractedEvent } from './types';

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
 * Format date for Outlook Calendar (YYYY-MM-DDTHH:mm:ss±HH:mm)
 * Uses local timezone to preserve time as displayed to user
 */
function formatOutlookDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Get timezone offset (in minutes) and format as ±HH:MM
  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const offsetSign = offset >= 0 ? '+' : '-';
  const offsetString = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetString}`;
}

/**
 * Build URL with proper encoding
 */
function buildUrl(
  baseUrl: string,
  params: Record<string, string | undefined>
): string {
  const url = new URL(baseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.append(key, value);
    }
  });

  return url.toString();
}

/**
 * Convert ExtractedEvent to privacy-protected SyncEventData
 */
export function createSyncEventData(event: ExtractedEvent): SyncEventData {
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
    const accountChooserUrl = new URL(
      'https://accounts.google.com/AccountChooser'
    );
    accountChooserUrl.searchParams.append('Email', email);
    accountChooserUrl.searchParams.append('continue', googleCalendarUrl);
    return accountChooserUrl.toString();
  }

  return googleCalendarUrl;
}

/**
 * Generate Outlook Calendar deeplink
 * @param event - Event data to sync
 * @param email - Optional email to pre-select account via login_hint parameter
 * @returns Outlook calendar deeplink URL with login_hint for account switching
 */
export function generateOutlookCalendarLink(
  event: SyncEventData,
  email?: string
): string {
  const baseUrl = 'https://outlook.live.com/calendar/0/deeplink/compose';

  const params: Record<string, string | undefined> = {
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description || undefined,
    location: event.location || undefined,
    startdt: formatOutlookDate(event.startDate),
    enddt: formatOutlookDate(event.endDate),
    allday: 'false', // Not an all-day event
  };

  // Add login_hint for account pre-selection
  if (email) {
    params.login_hint = email;
  }

  return buildUrl(baseUrl, params);
}

/**
 * Open calendar link in new window/tab
 */
export function openCalendarLink(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
