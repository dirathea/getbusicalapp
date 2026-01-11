import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkIcon, EditIcon, ClockIcon, AlertTriangleIcon } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface UrlInfoProps {
  url: string;
  lastFetch: number | null;
  calendarLastUpdated: number | null;
  onEdit: () => void;
}

export function UrlInfo({ url, lastFetch, calendarLastUpdated, onEdit }: UrlInfoProps) {
  // Truncate URL for display
  const truncateUrl = (fullUrl: string, maxLength: number = 50) => {
    try {
      const urlObj = new URL(fullUrl);
      const domain = urlObj.hostname;
      const path = urlObj.pathname;
      
      if (domain.length + path.length <= maxLength) {
        return `${domain}${path}`;
      }
      
      const remainingLength = maxLength - domain.length - 3; // -3 for "..."
      if (remainingLength > 0) {
        return `${domain}...${path.slice(-remainingLength)}`;
      }
      
      return domain;
    } catch {
      return fullUrl.slice(0, maxLength) + (fullUrl.length > maxLength ? '...' : '');
    }
  };

  const lastSyncText = lastFetch 
    ? formatDistanceToNow(lastFetch, { addSuffix: true })
    : 'Never';
    
  const lastSyncAbsolute = lastFetch
    ? format(lastFetch, 'PPpp')
    : 'Never synced';

  const calendarUpdatedText = calendarLastUpdated
    ? formatDistanceToNow(calendarLastUpdated, { addSuffix: true })
    : null;

  const calendarUpdatedAbsolute = calendarLastUpdated
    ? format(calendarLastUpdated, 'PPpp')
    : null;

  // Check if calendar hasn't been updated in 24+ hours
  const isCalendarStale = calendarLastUpdated 
    ? Date.now() - calendarLastUpdated > 24 * 60 * 60 * 1000
    : false;

  const staleWarning = "Calendar hasn't been updated in 24+ hours. Changes may take time to appear.";
  const tooltipText = calendarUpdatedAbsolute
    ? `Calendar last modified: ${calendarUpdatedAbsolute}\nApp last synced: ${lastSyncAbsolute}`
    : `App last synced: ${lastSyncAbsolute}`;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <LinkIcon className="h-4 w-4 text-muted-foreground shrink-0" />
            <h3 className="text-sm font-medium">Calendar Source</h3>
          </div>
          
          <p className="text-sm text-muted-foreground truncate mb-2" title={url}>
            {truncateUrl(url)}
          </p>
          
          {/* Desktop: Single line with bullet separator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <ClockIcon className="h-3 w-3 shrink-0" />
            {calendarUpdatedText ? (
              <div className="flex items-center gap-2" title={tooltipText}>
                {isCalendarStale && (
                  <span title={staleWarning}>
                    <AlertTriangleIcon className="h-3 w-3 text-amber-500" />
                  </span>
                )}
                <span>Calendar updated {calendarUpdatedText}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>Synced {lastSyncText}</span>
              </div>
            ) : (
              <span title={tooltipText}>
                Synced {lastSyncText}
              </span>
            )}
          </div>
          
          {/* Mobile: Two lines stacked */}
          <div className="flex flex-col gap-1 sm:hidden text-xs text-muted-foreground">
            {calendarUpdatedText && (
              <div className="flex items-center gap-2" title={calendarUpdatedAbsolute || undefined}>
                <ClockIcon className="h-3 w-3 shrink-0" />
                {isCalendarStale && (
                  <span title={staleWarning}>
                    <AlertTriangleIcon className="h-3 w-3 text-amber-500 shrink-0" />
                  </span>
                )}
                <span>Calendar updated {calendarUpdatedText}</span>
              </div>
            )}
            <div className="flex items-center gap-2" title={lastSyncAbsolute}>
              {!calendarUpdatedText && <ClockIcon className="h-3 w-3 shrink-0" />}
              {calendarUpdatedText && <span className="w-3" />}
              <span>Synced {lastSyncText}</span>
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          className="shrink-0"
        >
          <EditIcon className="h-4 w-4 mr-2" />
          Change
        </Button>
      </div>
    </Card>
  );
}
