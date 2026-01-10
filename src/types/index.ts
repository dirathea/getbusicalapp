export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
}

export interface SyncEventData {
  title: string;
  startDate: Date;
  endDate: Date;
  busyStatus: 'busy';
  description: string;
  location: string;
}

export interface StorageData {
  icsUrl: string;
  lastFetch: number;
  cachedEvents: CalendarEvent[];
}

export type CalendarPlatform = 'google' | 'outlook' | 'system';

export interface IcsInstructions {
  platform: 'google' | 'outlook' | 'apple' | 'other';
  steps: string[];
}
