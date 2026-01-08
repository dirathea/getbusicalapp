import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MailIcon, CalendarIcon, DownloadIcon, InfoIcon } from 'lucide-react';
import type { CalendarEvent, CalendarPlatform } from '@/types';
import {
  createSyncEventData,
  generateGoogleCalendarLink,
  generateOutlookCalendarLink,
  openCalendarLink,
} from '@/lib/calendarLinks';
import { downloadEventAsICS } from '@/lib/icsGenerator';

interface SyncDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SyncDialog({ event, open, onOpenChange }: SyncDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<CalendarPlatform | null>(null);
  const [email, setEmail] = useState('');

  const handlePlatformSelect = (platform: CalendarPlatform) => {
    if (platform === 'system') {
      // For system calendar, download ICS file immediately
      if (event) {
        const syncData = createSyncEventData(event);
        downloadEventAsICS(syncData);
        onOpenChange(false);
        setSelectedPlatform(null);
      }
    } else {
      setSelectedPlatform(platform);
    }
  };

  const handleSync = () => {
    if (!event || !selectedPlatform) return;

    const syncData = createSyncEventData(event);
    let url = '';

    if (selectedPlatform === 'google') {
      url = generateGoogleCalendarLink(syncData, email || undefined);
    } else if (selectedPlatform === 'outlook') {
      url = generateOutlookCalendarLink(syncData, email || undefined);
    }

    if (url) {
      openCalendarLink(url);
      onOpenChange(false);
      setSelectedPlatform(null);
      setEmail('');
    }
  };

  const handleBack = () => {
    setSelectedPlatform(null);
    setEmail('');
  };

  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        {selectedPlatform === null ? (
          <>
            <DialogHeader>
              <DialogTitle>Sync to Calendar</DialogTitle>
              <DialogDescription>Choose your calendar platform</DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <Card
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handlePlatformSelect('google')}
              >
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Google Calendar</h3>
                    <p className="text-sm text-muted-foreground">Sync to your Google Calendar</p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handlePlatformSelect('outlook')}
              >
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Outlook Calendar</h3>
                    <p className="text-sm text-muted-foreground">Sync to Outlook.com or Office 365</p>
                  </div>
                </div>
              </Card>

              <Card
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handlePlatformSelect('system')}
              >
                <div className="flex items-center gap-3">
                  <DownloadIcon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">System Calendar (.ics)</h3>
                    <p className="text-sm text-muted-foreground">Download ICS file for any calendar app</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="rounded-md bg-muted p-3 flex gap-2">
              <InfoIcon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Event will sync as "Synced Event" marked as busy to protect your privacy
              </p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>
                {selectedPlatform === 'google' ? 'Google Calendar' : 'Outlook Calendar'}
              </DialogTitle>
              <DialogDescription>Enter your email (optional)</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={
                    selectedPlatform === 'google'
                      ? 'user@gmail.com'
                      : 'user@outlook.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Optional: Add your email to open the specific calendar
                </p>
              </div>

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm text-muted-foreground">
                  You'll be redirected to {selectedPlatform === 'google' ? 'Google' : 'Outlook'} Calendar 
                  to save the event. Make sure you're signed in to your account.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleSync} className="flex-1">
                  Open Calendar
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
