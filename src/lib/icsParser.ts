import ICAL from 'ical.js';
import type { CalendarEvent } from '@/types';

/**
 * Fetch ICS file from URL
 */
export async function fetchICS(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ICS file: ${response.statusText}`);
    }
    
    const text = await response.text();
    return text;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ICS: ${error.message}`);
    }
    throw new Error('Failed to fetch ICS file');
  }
}

/**
 * Parse ICS data and extract calendar events
 */
export function parseICS(icsData: string): CalendarEvent[] {
  try {
    // Parse the ICS string
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    
    // Get all VEVENT components
    const vevents = comp.getAllSubcomponents('vevent');
    
    // Convert to CalendarEvent format
    const events: CalendarEvent[] = vevents.map((vevent) => {
      const event = new ICAL.Event(vevent);
      
      // Extract event properties
      const summary = event.summary || 'Untitled Event';
      const description = event.description || '';
      const location = event.location || '';
      
      // Get start and end dates
      const startDate = event.startDate.toJSDate();
      const endDate = event.endDate.toJSDate();
      
      // Check if it's an all-day event
      // In ICAL.js, all-day events have isDate property set to true
      const isAllDay = event.startDate.isDate || false;
      
      // Generate unique ID
      const id = event.uid || `${startDate.getTime()}-${summary}`;
      
      return {
        id,
        title: summary,
        description,
        location,
        startDate,
        endDate,
        isAllDay,
      };
    });
    
    // Sort events by start date
    events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
    
    return events;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ICS: ${error.message}`);
    }
    throw new Error('Failed to parse ICS data');
  }
}

/**
 * Validate ICS URL format
 */
export function isValidIcsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Must be http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }
    
    // Should have .ics extension or contain ical/calendar in path
    const path = urlObj.pathname.toLowerCase();
    const isIcsFile = path.endsWith('.ics');
    const hasCalendarKeyword = path.includes('ical') || path.includes('calendar');
    
    return isIcsFile || hasCalendarKeyword;
  } catch {
    return false;
  }
}

/**
 * Convert webcal:// URL to https://
 */
export function normalizeIcsUrl(url: string): string {
  if (url.startsWith('webcal://')) {
    return url.replace('webcal://', 'https://');
  }
  return url;
}

/**
 * Fetch and parse ICS file in one step
 */
export async function fetchAndParseICS(url: string): Promise<CalendarEvent[]> {
  const normalizedUrl = normalizeIcsUrl(url);
  
  if (!isValidIcsUrl(normalizedUrl)) {
    throw new Error('Invalid ICS URL format');
  }
  
  const icsData = await fetchICS(normalizedUrl);
  const events = parseICS(icsData);
  
  return events;
}
