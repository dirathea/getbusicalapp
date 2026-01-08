import type { CalendarEvent } from '@/types';
import { EventCard } from './EventCard';
import { groupEventsByDate, getDateGroupLabel } from '@/lib/dateUtils';

interface EventListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function EventList({ events, onEventClick }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No events found for this week</p>
      </div>
    );
  }

  const groupedEvents = groupEventsByDate(events);
  const sortedDates = Array.from(groupedEvents.keys()).sort();

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey) => {
        const dateEvents = groupedEvents.get(dateKey) || [];
        const firstEvent = dateEvents[0];
        const label = getDateGroupLabel(firstEvent.startDate);

        return (
          <div key={dateKey}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              {label}
            </h2>
            <div className="space-y-2">
              {dateEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={() => onEventClick(event)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
