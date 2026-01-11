import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCwIcon, XIcon } from 'lucide-react';

export function UpdatePrompt() {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    const handleUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ registration: ServiceWorkerRegistration }>;
      setRegistration(customEvent.detail.registration);
      setShowUpdate(true);
    };

    window.addEventListener('swUpdate', handleUpdate);
    
    return () => {
      window.removeEventListener('swUpdate', handleUpdate);
    };
  }, []);

  const handleUpdate = () => {
    if (registration && registration.waiting) {
      // Tell the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      // Page will reload automatically via controllerchange event
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="p-4 shadow-lg border-2">
        <div className="flex items-start gap-3">
          <RefreshCwIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">Update Available</h3>
            <p className="text-xs text-muted-foreground mb-3">
              A new version of BusiCal is available. Refresh to get the latest features and fixes.
            </p>
            
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdate} className="flex-1">
                <RefreshCwIcon className="h-3 w-3 mr-1" />
                Update Now
              </Button>
              <Button size="sm" variant="outline" onClick={handleDismiss}>
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
