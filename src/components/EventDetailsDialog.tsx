import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarIcon, ClockIcon, MapPinIcon, FileTextIcon } from 'lucide-react';
import type { CalendarEvent } from '@/types';
import { formatFullDate, formatEventTime, formatEventDuration } from '@/lib/dateUtils';

interface EventDetailsDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSync: () => void;
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onSync,
}: EventDetailsDialogProps) {
  if (!event) return null;

  const timeText = formatEventTime(event.startDate, event.endDate, event.isAllDay);
  const duration = formatEventDuration(event.startDate, event.endDate);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title || 'Untitled Event'}</DialogTitle>
          <DialogDescription>Event details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{formatFullDate(event.startDate)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ClockIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">{timeText}</p>
                {!event.isAllDay && (
                  <p className="text-sm text-muted-foreground">({duration})</p>
                )}
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <p className="font-medium">{event.location}</p>
              </div>
            )}

            {event.description && (
              <div className="flex items-start gap-3">
                <FileTextIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <Button onClick={onSync} className="w-full">
              Sync to Calendar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
