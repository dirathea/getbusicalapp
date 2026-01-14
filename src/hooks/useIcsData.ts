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
  getCalendarLastUpdated,
  saveCalendarLastUpdated,
} from '@/lib/storage';

interface UseIcsDataReturn {
  events: CalendarEvent[];
  filteredEvents: CalendarEvent[];
  loading: boolean;
  error: string | null;
  icsUrl: string;
  lastFetch: number | null;
  calendarLastUpdated: number | null;
  weekView: number;
  isEditingUrl: boolean;
  isInitialized: boolean;
  setWeekView: (view: number) => void;
  setIcsUrl: (url: string) => Promise<void>;
  refresh: () => Promise<void>;
  clearData: () => void;
  editUrl: () => void;
  editUrlWithPreservation: () => void;
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
  const [calendarLastUpdated, setCalendarLastUpdated] = useState<number | null>(null);
  const [weekView, setWeekView] = useState<number>(0);
  const [isEditingUrl, setIsEditingUrl] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedUrl = await getIcsUrl(); // Now async
        const cachedEvents = getCachedEvents();
        const storedLastFetch = getLastFetch();
        const storedCalendarLastUpdated = getCalendarLastUpdated();

        if (storedUrl) {
          setIcsUrlState(storedUrl);
        }

        if (cachedEvents && cachedEvents.length > 0) {
          setEvents(cachedEvents);
        }

        if (storedLastFetch) {
          setLastFetch(storedLastFetch);
        }

        if (storedCalendarLastUpdated) {
          setCalendarLastUpdated(storedCalendarLastUpdated);
        }
      } catch (error) {
        console.error('Failed to load stored data:', error);
        // If Web Crypto not supported, show error
        if (error instanceof Error && error.message.includes('encryption features')) {
          setError(error.message);
        }
      } finally {
        setIsInitialized(true);
      }
    };

    loadStoredData();
  }, []);

  /**
   * Fetch and parse ICS data
   */
  const fetchEvents = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetchAndParseICS(url);
      setEvents(result.events);
      setCalendarLastUpdated(result.calendarLastUpdated);
      saveCachedEvents(result.events);
      saveCalendarLastUpdated(result.calendarLastUpdated);
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
      try {
        setIcsUrlState(url);
        await saveIcsUrl(url); // Now async, encrypts URL
        setIsEditingUrl(false);
        await fetchEvents(url);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save URL';
        setError(errorMessage);
        console.error('Error saving ICS URL:', error);
      }
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
    setCalendarLastUpdated(null);
  }, []);

  /**
   * Edit URL - clears current URL to show input form
   */
  const editUrl = useCallback(() => {
    setIcsUrlState('');
    setIsEditingUrl(false);
  }, []);

  /**
   * Edit URL with preservation - keeps current URL for editing
   */
  const editUrlWithPreservation = useCallback(() => {
    setIsEditingUrl(true);
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
    calendarLastUpdated,
    weekView,
    isEditingUrl,
    isInitialized,
    setWeekView,
    setIcsUrl,
    refresh,
    clearData,
    editUrl,
    editUrlWithPreservation,
  };
}
