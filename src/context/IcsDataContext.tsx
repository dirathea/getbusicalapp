import { createContext, useContext } from 'react';
import type { CalendarEvent } from '@/types';
import { useIcsData } from '@/hooks/useIcsData';

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

const IcsDataContext = createContext<UseIcsDataReturn | null>(null);

export function useIcsDataContext(): UseIcsDataReturn {
  const context = useContext(IcsDataContext);
  if (!context) {
    throw new Error('useIcsDataContext must be used within an IcsDataProvider');
  }
  return context;
}

export function IcsDataProvider({ children }: { children: React.ReactNode }) {
  const icsData = useIcsData();

  return (
    <IcsDataContext.Provider value={icsData}>
      {children}
    </IcsDataContext.Provider>
  );
}
