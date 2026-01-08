import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { HelpCircleIcon } from 'lucide-react';
import { isValidIcsUrl } from '@/lib/icsParser';

interface IcsInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
}

export function IcsInput({ onSubmit, loading = false }: IcsInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter an ICS URL');
      return;
    }

    if (!isValidIcsUrl(url)) {
      setError('Invalid ICS URL format');
      return;
    }

    setError('');
    onSubmit(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Enter Your Calendar ICS URL</CardTitle>
        <CardDescription>
          Add your source calendar to start syncing events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ics-url">ICS URL</Label>
            <Input
              id="ics-url"
              type="url"
              placeholder="https://calendar.google.com/calendar/ical/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={loading || !url.trim()}>
              {loading ? 'Loading...' : 'Load Events'}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <HelpCircleIcon className="mr-2 h-4 w-4" />
                  How to get ICS URL
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <AlertDialogHeader>
                  <AlertDialogTitle>How to Get Your ICS URL</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-6 text-left">
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">📧 Google Calendar</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Open Google Calendar on the web</li>
                          <li>Click Settings (gear icon) → Settings</li>
                          <li>Select your calendar from the left sidebar</li>
                          <li>Scroll to "Integrate calendar" section</li>
                          <li>Copy the "Secret address in iCalendar format" URL</li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground mb-2">📧 Outlook.com</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Open Outlook Calendar on the web</li>
                          <li>Click Settings → View all Outlook settings</li>
                          <li>Go to Calendar → Shared calendars</li>
                          <li>Under "Publish a calendar", select your calendar</li>
                          <li>Click "Publish" and copy the ICS link</li>
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground mb-2">🍎 Apple Calendar (iCloud)</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm">
                          <li>Open iCloud.com and go to Calendar</li>
                          <li>Click the share icon next to your calendar</li>
                          <li>Enable "Public Calendar"</li>
                          <li>Copy the URL</li>
                          <li>Replace "webcal://" with "https://" in the URL</li>
                        </ol>
                      </div>

                      <div className="rounded-md bg-muted p-4">
                        <p className="text-sm text-muted-foreground">
                          <strong>Note:</strong> Your calendar data stays on your device.
                          We only fetch events when you refresh.
                        </p>
                      </div>
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
