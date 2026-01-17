/**
 * Calendar platform options for sharing
 */
export type CalendarPlatform = 'google' | 'outlook';

/**
 * Event data extracted from Google Calendar DOM
 */
export interface ExtractedEvent {
  /** Event title from the calendar */
  title: string;
  /** Event start date/time */
  startDate: Date;
  /** Event end date/time */
  endDate: Date;
  /** Optional location */
  location?: string;
  /** Google Calendar event ID (from data attribute or URL) */
  eventId?: string;
  /** Whether this is an all-day event */
  isAllDay?: boolean;
}

/**
 * Privacy-protected event data for syncing
 * All sensitive info is stripped, only time block is preserved
 */
export interface SyncEventData {
  /** Always "Synced Event" for privacy */
  title: string;
  /** Event start date/time */
  startDate: Date;
  /** Event end date/time */
  endDate: Date;
  /** Always "busy" for privacy */
  busyStatus: 'busy';
  /** Empty for privacy */
  description: string;
  /** Empty for privacy */
  location: string;
}

/**
 * Callback for when user initiates sync
 */
export type SyncCallback = (
  event: ExtractedEvent,
  platform: CalendarPlatform,
  email?: string
) => void;
