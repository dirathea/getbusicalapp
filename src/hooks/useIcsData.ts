import { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent, WeekView } from '@/types';
import { fetchAndParseICS } from '@/lib/icsParser';
import { filterEventsByWeek } from '@/lib/dateUtils';
import {
  getIcsUrl,
  saveIcsUrl,
  getCachedEvents,
  saveCachedEvents,
} from '@/lib/storage';

interface UseIcsDataReturn {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  loading: boolean;
  error: string | null;
  icsUrl: string;
  weekView: WeekView;
  setWeekView: (view: WeekView) => void;
  setIcsUrl: (url: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearData: () => void;
}

/**
 * Main hook for managing ICS calendar data
 * Handles fetching, parsing, caching, and filtering events
 */
export function useIcsData(): UseIcsDataReturn {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [icsUrl, setIcsUrlState] = useState<string>('');
  const [weekView, setWeekView] = useState<WeekView>('this-week');

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUrl = getIcsUrl();
    const cachedEvents = getCachedEvents();

    if (storedUrl) {
      setIcsUrlState(storedUrl);
    }

    if (cachedEvents && cachedEvents.length > 0) {
      setEvents(cachedEvents);
    }
  }, []);

  /**
   * Fetch and parse ICS data
   */
  const fetchEvents = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const parsedEvents = await fetchAndParseICS(url);
      setEvents(parsedEvents);
      saveCachedEvents(parsedEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load calendar';
      setError(errorMessage);
      console.error('Error fetching ICS:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Set ICS URL and fetch events
   */
  const setIcsUrl = useCallback(
    async (url: string) => {
      setIcsUrlState(url);
      saveIcsUrl(url);
      await fetchEvents(url);
    },
    [fetchEvents]
  );

  /**
   * Refresh events from current ICS URL
   */
  const refresh = useCallback(async () => {
    if (!icsUrl) {
      setError('No ICS URL configured');
      return;
    }

    await fetchEvents(icsUrl);
  }, [icsUrl, fetchEvents]);

  /**
   * Clear all data (URL, events, cache)
   */
  const clearData = useCallback(() => {
    setIcsUrlState('');
    setEvents([]);
    setError(null);
    // Note: We don't call clearStorage() from lib/storage.ts here
    // because the component may want to handle that separately
  }, []);

  /**
   * Filter events based on current week view
   */
  const filteredEvents = filterEventsByWeek(events, weekView);

  return {
    events,
    filteredEvents,
    loading,
    error,
    icsUrl,
    weekView,
    setWeekView,
    setIcsUrl,
    refresh,
    clearData,
  };
}
