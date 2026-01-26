import ICAL from 'ical.js';
import type { CalendarEvent } from '@/types';

/**
 * Get the proxy URL based on environment
 */
function getProxyUrl(): string {
  // In production with Cloudflare Workers, use relative path
  // The worker serves both static assets and API endpoints
  return '/proxy';
}

/**
 * Fetch ICS file from URL using Cloudflare Worker proxy
 */
export async function fetchICS(url: string): Promise<string> {
  try {
    const proxyUrl = getProxyUrl();
    
    // Use query parameter for GET request
    // Decode first to avoid double-encoding already encoded URLs
    const decodedUrl = decodeURIComponent(url);
    const proxyEndpoint = `${proxyUrl}?url=${encodeURIComponent(decodedUrl)}`;
    
    const response = await fetch(proxyEndpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Proxy returned status ${response.status}`);
    }
    
    // Parse JSON response from proxy
    const jsonResponse = await response.json() as {
      success: boolean;
      data?: string;
      error?: string;
      details?: string;
      upstreamStatus?: number;
      upstreamStatusText?: string;
    };
    
    // Check if proxy request was successful
    if (!jsonResponse.success) {
      const errorMsg = jsonResponse.error || 'Failed to fetch ICS data';
      const details = jsonResponse.details ? ` (${jsonResponse.details})` : '';
      const upstream = jsonResponse.upstreamStatus 
        ? ` [Upstream: ${jsonResponse.upstreamStatus} ${jsonResponse.upstreamStatusText}]`
        : '';
      throw new Error(`${errorMsg}${details}${upstream}`);
    }
    
    // Validate we got data
    if (!jsonResponse.data) {
      throw new Error('Proxy returned success but no data');
    }
    
    return jsonResponse.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch ICS: ${error.message}`);
    }
    throw new Error('Failed to fetch ICS file');
  }
}

/**
 * Parse ICS data and extract calendar events
 * Returns both events and the calendar's last updated timestamp (from DTSTAMP)
 */
export function parseICS(icsData: string): { 
  events: CalendarEvent[]; 
  calendarLastUpdated: number | null;
} {
  try {
    // Parse the ICS string
    const jcalData = ICAL.parse(icsData);
    const comp = new ICAL.Component(jcalData);
    
    // Get all VEVENT components
    const vevents = comp.getAllSubcomponents('vevent');
    
    // Track the most recent DTSTAMP across all events
    let latestDtstamp: number | null = null;
    
    // Convert to CalendarEvent format
    const events: CalendarEvent[] = vevents.map((vevent) => {
      const event = new ICAL.Event(vevent);
      
      // Extract DTSTAMP (when this event was last modified in the calendar)
      try {
        const dtstampProp = vevent.getFirstProperty('dtstamp');
        if (dtstampProp) {
          const dtstampValue = dtstampProp.getFirstValue();
          // DTSTAMP value should be an ICAL.Time object
          if (dtstampValue && dtstampValue instanceof ICAL.Time) {
            const dtstampTime = dtstampValue.toJSDate().getTime();
            if (!latestDtstamp || dtstampTime > latestDtstamp) {
              latestDtstamp = dtstampTime;
            }
          }
        }
      } catch (error) {
        // If DTSTAMP extraction fails for this event, continue without it
        console.warn('Failed to extract DTSTAMP from event:', error);
      }
      
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
    
    return {
      events,
      calendarLastUpdated: latestDtstamp,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse ICS: ${error.message}`);
    }
    throw new Error('Failed to parse ICS data');
  }
}

/**
 * Validate ICS URL format
 * Only checks protocol - content validation (BEGIN:VCALENDAR) handles the rest
 */
export function isValidIcsUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    // Only validate protocol - let content validation catch non-calendar responses
    return ['http:', 'https:', 'webcal:'].includes(urlObj.protocol);
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
 * Returns both events and the calendar's last updated timestamp
 */
export async function fetchAndParseICS(url: string): Promise<{
  events: CalendarEvent[];
  calendarLastUpdated: number | null;
}> {
  const normalizedUrl = normalizeIcsUrl(url);
  
  if (!isValidIcsUrl(normalizedUrl)) {
    throw new Error('Invalid ICS URL format');
  }
  
  const icsData = await fetchICS(normalizedUrl);
  const result = parseICS(icsData);
  
  return result;
}
