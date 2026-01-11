import type { CalendarEvent, StorageData } from '@/types';

const STORAGE_KEYS = {
  ICS_URL: 'busical_ics_url',
  CACHED_EVENTS: 'busical_cached_events',
  LAST_FETCH: 'busical_last_fetch',
  CALENDAR_LAST_UPDATED: 'busical_calendar_last_updated',
} as const;

/**
 * Save ICS URL to localStorage
 */
export function saveIcsUrl(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ICS_URL, url);
  } catch (error) {
    console.error('Failed to save ICS URL to localStorage:', error);
  }
}

/**
 * Get ICS URL from localStorage
 */
export function getIcsUrl(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ICS_URL);
  } catch (error) {
    console.error('Failed to get ICS URL from localStorage:', error);
    return null;
  }
}

/**
 * Save cached events to localStorage
 */
export function saveCachedEvents(events: CalendarEvent[]): void {
  try {
    // Serialize dates to ISO strings for storage
    const serializedEvents = events.map(event => ({
      ...event,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEYS.CACHED_EVENTS, JSON.stringify(serializedEvents));
    localStorage.setItem(STORAGE_KEYS.LAST_FETCH, Date.now().toString());
  } catch (error) {
    console.error('Failed to save cached events to localStorage:', error);
  }
}

/**
 * Get cached events from localStorage
 */
export function getCachedEvents(): CalendarEvent[] | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.CACHED_EVENTS);
    if (!cached) return null;

    const parsedEvents = JSON.parse(cached);
    // Deserialize ISO strings back to Date objects
    return parsedEvents.map((event: any) => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: new Date(event.endDate),
    }));
  } catch (error) {
    console.error('Failed to get cached events from localStorage:', error);
    return null;
  }
}

/**
 * Get last fetch timestamp from localStorage
 */
export function getLastFetch(): number | null {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.LAST_FETCH);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Failed to get last fetch timestamp:', error);
    return null;
  }
}

/**
 * Save calendar last updated timestamp to localStorage
 */
export function saveCalendarLastUpdated(timestamp: number | null): void {
  try {
    if (timestamp === null) {
      localStorage.removeItem(STORAGE_KEYS.CALENDAR_LAST_UPDATED);
    } else {
      localStorage.setItem(STORAGE_KEYS.CALENDAR_LAST_UPDATED, timestamp.toString());
    }
  } catch (error) {
    console.error('Failed to save calendar last updated timestamp:', error);
  }
}

/**
 * Get calendar last updated timestamp from localStorage
 */
export function getCalendarLastUpdated(): number | null {
  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.CALENDAR_LAST_UPDATED);
    return timestamp ? parseInt(timestamp, 10) : null;
  } catch (error) {
    console.error('Failed to get calendar last updated timestamp:', error);
    return null;
  }
}

/**
 * Clear all BusiCal data from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ICS_URL);
    localStorage.removeItem(STORAGE_KEYS.CACHED_EVENTS);
    localStorage.removeItem(STORAGE_KEYS.LAST_FETCH);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR_LAST_UPDATED);
  } catch (error) {
    console.error('Failed to clear storage:', error);
  }
}

/**
 * Get all storage data at once
 */
export function getStorageData(): StorageData | null {
  const icsUrl = getIcsUrl();
  const cachedEvents = getCachedEvents();
  const lastFetch = getLastFetch();
  const calendarLastUpdated = getCalendarLastUpdated();

  if (!icsUrl || !cachedEvents || !lastFetch) {
    return null;
  }

  return {
    icsUrl,
    cachedEvents,
    lastFetch,
    calendarLastUpdated,
  };
}
