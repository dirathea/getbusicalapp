import { useState } from 'react';
import { useNavigate } from 'react-router';
import { UrlInfo } from '@/components/UrlInfo';
import { WeekNavigation } from '@/components/WeekNavigation';
import { EventList } from '@/components/EventList';
import { EventDetailsDialog } from '@/components/EventDetailsDialog';
import { SyncDialog } from '@/components/SyncDialog';
import { useIcsData } from '@/hooks/useIcsData';
import type { CalendarEvent } from '@/types';

export function EventsPage() {
  const navigate = useNavigate();
  const {
    filteredEvents,
    loading,
    error,
    icsUrl,
    lastFetch,
    weekView,
    setWeekView,
    editUrl,
  } = useIcsData();

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showSyncDialog, setShowSyncDialog] = useState(false);

  const handleEditUrl = () => {
    editUrl();
    navigate('/setup');
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const handleSync = () => {
    setShowEventDetails(false);
    setShowSyncDialog(true);
  };

  const handleEventDetailsClose = (open: boolean) => {
    setShowEventDetails(open);
    if (!open) {
      setSelectedEvent(null);
    }
  };

  const handleSyncDialogClose = (open: boolean) => {
    setShowSyncDialog(open);
    if (!open) {
      setSelectedEvent(null);
    }
  };

  return (
    <div className="space-y-6">
      <UrlInfo 
        url={icsUrl} 
        lastFetch={lastFetch} 
        onEdit={handleEditUrl}
      />

      <WeekNavigation value={weekView} onChange={setWeekView} />

      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-destructive">
          <p className="text-sm font-medium">{error}</p>
          <p className="text-xs mt-1">
            Check your ICS URL or try refreshing. If the issue persists, 
            try changing your calendar URL.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      )}

      {!loading && !error && (
        <EventList events={filteredEvents} onEventClick={handleEventClick} />
      )}

      <EventDetailsDialog
        event={selectedEvent}
        open={showEventDetails}
        onOpenChange={handleEventDetailsClose}
        onSync={handleSync}
      />

      <SyncDialog
        event={selectedEvent}
        open={showSyncDialog}
        onOpenChange={handleSyncDialogClose}
      />
    </div>
  );
}
