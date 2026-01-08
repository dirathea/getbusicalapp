import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LinkIcon, EditIcon, ClockIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UrlInfoProps {
  url: string;
  lastFetch: number | null;
  onEdit: () => void;
}

export function UrlInfo({ url, lastFetch, onEdit }: UrlInfoProps) {
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
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            <span>Last synced {lastSyncText}</span>
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
