import type { ExtractedEvent } from '../lib/types';

/**
 * Parse time string like "10:00am" or "2:30pm" to hours and minutes
 */
function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(am|pm)?/i);
  if (!match) return null;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3]?.toLowerCase();

  if (period === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }

  return { hours, minutes };
}

/**
 * Parse date from Google Calendar's aria-label or text
 * Examples:
 * - "Monday, January 20"
 * - "January 20, 2025"
 * - "Mon Jan 20"
 */
function parseDateFromText(text: string, referenceDate: Date = new Date()): Date | null {
  // Try various date patterns
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const shortMonths = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

  const lowerText = text.toLowerCase();

  // Try to find month and day
  let monthIndex = -1;
  let day = -1;
  let year = referenceDate.getFullYear();

  // Check for full month names
  for (let i = 0; i < months.length; i++) {
    if (lowerText.includes(months[i])) {
      monthIndex = i;
      break;
    }
  }

  // Check for short month names if full not found
  if (monthIndex === -1) {
    for (let i = 0; i < shortMonths.length; i++) {
      if (lowerText.includes(shortMonths[i])) {
        monthIndex = i;
        break;
      }
    }
  }

  // Find day number
  const dayMatch = text.match(/\b(\d{1,2})\b/);
  if (dayMatch) {
    day = parseInt(dayMatch[1], 10);
  }

  // Find year if present
  const yearMatch = text.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }

  if (monthIndex !== -1 && day !== -1) {
    return new Date(year, monthIndex, day);
  }

  return null;
}

/**
 * Extract event data from a Google Calendar event popup/bubble
 */
export function extractEventFromPopup(popup: Element): ExtractedEvent | null {
  try {
    // Strategy 1: Look for event details in the popup structure
    // Google Calendar popups typically have structured content

    // Try to find the title
    let title = '';
    const titleElement = popup.querySelector('[data-eventid]') ||
      popup.querySelector('[role="heading"]') ||
      popup.querySelector('span[data-text="true"]');
    
    if (titleElement) {
      title = titleElement.textContent?.trim() || '';
    }

    // If no title found in common places, try the first significant text
    if (!title) {
      const allText = popup.querySelectorAll('span, div');
      for (const el of allText) {
        const text = el.textContent?.trim();
        if (text && text.length > 2 && text.length < 100 && !text.includes(':')) {
          title = text;
          break;
        }
      }
    }

    // Try to find time information
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Look for time elements - Google Calendar often has specific patterns
    const timeElements = popup.querySelectorAll('[data-daterange], [aria-label*=":"], time');
    
    for (const el of timeElements) {
      const ariaLabel = el.getAttribute('aria-label') || '';
      const text = el.textContent || '';
      
      // Try to parse time range like "10:00am - 11:00am"
      const timeRangeMatch = (ariaLabel + ' ' + text).match(
        /(\d{1,2}:\d{2}\s*(?:am|pm)?)\s*[-–to]+\s*(\d{1,2}:\d{2}\s*(?:am|pm)?)/i
      );
      
      if (timeRangeMatch) {
        const startTime = parseTimeString(timeRangeMatch[1]);
        const endTime = parseTimeString(timeRangeMatch[2]);
        
        if (startTime && endTime) {
          // Use today's date as base
          const baseDate = new Date();
          
          startDate = new Date(baseDate);
          startDate.setHours(startTime.hours, startTime.minutes, 0, 0);
          
          endDate = new Date(baseDate);
          endDate.setHours(endTime.hours, endTime.minutes, 0, 0);
          
          // If end time is before start time, it might be next day
          if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
          }
          
          break;
        }
      }
    }

    // Try to find date from aria-label on the popup itself
    if (!startDate) {
      const ariaLabel = popup.getAttribute('aria-label') || '';
      const dateFromLabel = parseDateFromText(ariaLabel);
      if (dateFromLabel) {
        startDate = dateFromLabel;
        // Default to 1 hour event if no end time found
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      }
    }

    // Fallback: look for any date-like text in the popup
    if (!startDate) {
      const allText = popup.textContent || '';
      const dateFromText = parseDateFromText(allText);
      if (dateFromText) {
        startDate = dateFromText;
        startDate.setHours(9, 0, 0, 0); // Default to 9 AM
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      }
    }

    // If still no dates, use current time
    if (!startDate) {
      startDate = new Date();
      startDate.setMinutes(0, 0, 0);
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }

    if (!endDate) {
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }

    // Try to extract event ID from data attribute or URL
    let eventId: string | undefined;
    const eventIdElement = popup.querySelector('[data-eventid]');
    if (eventIdElement) {
      eventId = eventIdElement.getAttribute('data-eventid') || undefined;
    }

    // Look for location
    let location: string | undefined;
    const locationElement = popup.querySelector('[data-location], [aria-label*="location"]');
    if (locationElement) {
      location = locationElement.textContent?.trim();
    }

    return {
      title: title || 'Event',
      startDate,
      endDate,
      location,
      eventId,
    };
  } catch (error) {
    console.error('BusiCal: Error extracting event from popup:', error);
    return null;
  }
}

/**
 * Extract event from an event element on the calendar grid
 */
export function extractEventFromGridElement(element: Element): ExtractedEvent | null {
  try {
    const eventId = element.getAttribute('data-eventid');
    const ariaLabel = element.getAttribute('aria-label') || '';
    
    // Parse the aria-label which usually contains event details
    // Example: "Meeting, January 20, 2025, 10:00 AM to 11:00 AM"
    const title = element.textContent?.trim() || ariaLabel.split(',')[0]?.trim() || 'Event';
    
    // Try to parse date and time from aria-label
    let startDate: Date | null = null;
    let endDate: Date | null = null;

    const dateFromLabel = parseDateFromText(ariaLabel);
    if (dateFromLabel) {
      startDate = dateFromLabel;
    }

    // Try to find time in aria-label
    const timeRangeMatch = ariaLabel.match(
      /(\d{1,2}:\d{2}\s*(?:AM|PM)?)\s*(?:to|-)\s*(\d{1,2}:\d{2}\s*(?:AM|PM)?)/i
    );
    
    if (timeRangeMatch && startDate) {
      const startTime = parseTimeString(timeRangeMatch[1]);
      const endTime = parseTimeString(timeRangeMatch[2]);
      
      if (startTime) {
        startDate.setHours(startTime.hours, startTime.minutes, 0, 0);
      }
      if (endTime) {
        endDate = new Date(startDate);
        endDate.setHours(endTime.hours, endTime.minutes, 0, 0);
      }
    }

    // Fallbacks
    if (!startDate) {
      startDate = new Date();
      startDate.setMinutes(0, 0, 0);
    }
    if (!endDate) {
      endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    }

    return {
      title,
      startDate,
      endDate,
      eventId: eventId || undefined,
    };
  } catch (error) {
    console.error('BusiCal: Error extracting event from grid:', error);
    return null;
  }
}
