import { ClockIcon, MapPinIcon, MoreVerticalIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { CalendarEvent } from '@/types';
import { formatEventTime } from '@/lib/dateUtils';

interface EventCardProps {
  event: CalendarEvent;
  onClick: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const timeText = formatEventTime(event.startDate, event.endDate, event.isAllDay);

  return (
    <Card 
      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>{timeText}</span>
          </div>
          
          <h3 className="font-medium leading-snug">
            {event.title || 'Untitled Event'}
          </h3>
          
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
