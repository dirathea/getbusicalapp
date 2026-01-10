import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  isWithinInterval,
  format,
  isToday,
  isTomorrow,
  differenceInMinutes,
} from 'date-fns';
import type { CalendarEvent } from '@/types';

/**
 * Get the start and end dates for a given week offset
 * Week starts on Sunday
 * @param weekOffset - 0 = current week, 1 = next week, 2+ = future weeks
 */
export function getWeekRange(weekOffset: number): { start: Date; end: Date } {
  const now = new Date();
  const targetWeek = addWeeks(now, weekOffset);
  
  return {
    start: startOfWeek(targetWeek, { weekStartsOn: 0 }), // Sunday
    end: endOfWeek(targetWeek, { weekStartsOn: 0 }),     // Saturday
  };
}

/**
 * Format week range for display
 * Returns "Jan 12 - Jan 18" or "Jan 29 - Feb 4" (abbreviated month)
 */
export function getWeekRangeLabel(weekOffset: number): string {
  const { start, end } = getWeekRange(weekOffset);
  
  // If same month, show "Jan 12 - 18"
  if (start.getMonth() === end.getMonth()) {
    return `${format(start, 'MMM d')} - ${format(end, 'd')}`;
  }
  
  // Different months: "Jan 29 - Feb 4"
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
}

/**
 * Filter events by week offset
 */
export function filterEventsByWeek(
  events: CalendarEvent[],
  weekOffset: number
): CalendarEvent[] {
  const { start, end } = getWeekRange(weekOffset);
  
  return events.filter((event) => {
    // Check if event starts within the week range
    return isWithinInterval(event.startDate, { start, end });
  });
}

/**
 * Format event date for display
 * Returns "Today", "Tomorrow", or full date like "Monday, Jan 8"
 */
export function formatEventDate(date: Date): string {
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  return format(date, 'EEEE, MMM d');
}

/**
 * Format event time for display
 * Returns "2:00 PM - 3:00 PM" or "All Day"
 */
export function formatEventTime(start: Date, end: Date, isAllDay: boolean): string {
  if (isAllDay) {
    return 'All Day';
  }
  
  const startTime = format(start, 'h:mm a');
  const endTime = format(end, 'h:mm a');
  
  return `${startTime} - ${endTime}`;
}

/**
 * Format full date with day of week
 * Returns "Thursday, January 8, 2026"
 */
export function formatFullDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

/**
 * Calculate event duration in human-readable format
 * Returns "1 hour", "30 minutes", "2 hours 30 minutes"
 */
export function formatEventDuration(start: Date, end: Date): string {
  const minutes = differenceInMinutes(end, start);
  
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

/**
 * Group events by date
 * Returns a map of date string to events array
 */
export function groupEventsByDate(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const grouped = new Map<string, CalendarEvent[]>();
  
  events.forEach((event) => {
    const dateKey = format(event.startDate, 'yyyy-MM-dd');
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, event]);
  });
  
  // Sort events within each date by start time
  grouped.forEach((dateEvents, key) => {
    grouped.set(
      key,
      dateEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    );
  });
  
  return grouped;
}

/**
 * Check if date is in the past (before today)
 */
export function isPastDate(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

/**
 * Get relative date label for grouping
 * Returns "Today", "Tomorrow", or formatted date
 */
export function getDateGroupLabel(date: Date): string {
  if (isToday(date)) {
    return `Today - ${format(date, 'EEEE, MMM d')}`;
  }
  
  if (isTomorrow(date)) {
    return `Tomorrow - ${format(date, 'EEEE, MMM d')}`;
  }
  
  return format(date, 'EEEE, MMM d');
}
