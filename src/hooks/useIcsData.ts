import { useState, useEffect, useCallback } from 'react';
import type { CalendarEvent } from '@/types';
import { fetchAndParseICS } from '@/lib/icsParser';
import { filterEventsByWeek } from '@/lib/dateUtils';
import {
  getIcsUrl,
  saveIcsUrl,
  getCachedEvents,
  saveCachedEvents,
  getLastFetch,
} from '@/lib/storage';

interface UseIcsDataReturn {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  loading: boolean;
  error: string | null;
  icsUrl: string;
  lastFetch: number | null;
  weekView: number;
  setWeekView: (view: number) => void;
  setIcsUrl: (url: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearData: () => void;
  editUrl: () => void;
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
  const [lastFetch, setLastFetch] = useState<number | null>(null);
  const [weekView, setWeekView] = useState<number>(0);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUrl = getIcsUrl();
    const cachedEvents = getCachedEvents();
    const storedLastFetch = getLastFetch();

    if (storedUrl) {
      setIcsUrlState(storedUrl);
    }

    if (cachedEvents && cachedEvents.length > 0) {
      setEvents(cachedEvents);
    }

    if (storedLastFetch) {
      setLastFetch(storedLastFetch);
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
      const now = Date.now();
      setLastFetch(now);
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
    setLastFetch(null);
  }, []);

  /**
   * Edit URL - clears current URL to show input form
   */
  const editUrl = useCallback(() => {
    setIcsUrlState('');
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
    lastFetch,
    weekView,
    setWeekView,
    setIcsUrl,
    refresh,
    clearData,
    editUrl,
  };
}
