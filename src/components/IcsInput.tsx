import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircleIcon, Eye as EyeIcon } from 'lucide-react';
import { isValidIcsUrl } from '@/lib/icsParser';

interface IcsInputProps {
  onSubmit: (url: string) => void;
  loading?: boolean;
  initialUrl?: string;
}

export function IcsInput({ onSubmit, loading = false, initialUrl }: IcsInputProps) {
  const [url, setUrl] = useState(''); // Always start empty (don't pre-fill)
  const [showUrl, setShowUrl] = useState(false);
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
        <CardTitle>
          {initialUrl ? 'Edit Your Calendar ICS URL' : 'Enter Your Calendar ICS URL'}
        </CardTitle>
        <CardDescription>
          {initialUrl 
            ? 'Enter a new calendar URL, or reveal your current URL to view it'
            : 'Add your source calendar to start syncing events'
          }
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
            {initialUrl && !showUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setUrl(initialUrl);
                  setShowUrl(true);
                }}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                Reveal Current URL
              </Button>
            )}
            
            <Button type="submit" disabled={loading || !url.trim()}>
              {loading ? 'Loading...' : (initialUrl ? 'Update Events' : 'Load Events')}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button type="button" variant="outline" size="sm">
                  <HelpCircleIcon className="mr-2 h-4 w-4" />
                  How to get ICS URL
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>How to Get Your ICS URL</DialogTitle>
                </DialogHeader>

                <div className="rounded-md bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Your calendar data stays on your device.
                    We only fetch events when you refresh.
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="google">
                    <AccordionTrigger>📧 Google Calendar</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open Google Calendar on the web</li>
                        <li>Click Settings (gear icon) → Settings</li>
                        <li>Select your calendar from the left sidebar</li>
                        <li>Scroll to "Integrate calendar" section</li>
                        <li>Copy the "Secret address in iCalendar format" URL</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="outlook">
                    <AccordionTrigger>📧 Outlook.com</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open Outlook Calendar on the web</li>
                        <li>Click Settings → View all Outlook settings</li>
                        <li>Go to Calendar → Shared calendars</li>
                        <li>Under "Publish a calendar", select your calendar</li>
                        <li>Click "Publish" and copy the ICS link</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="apple">
                    <AccordionTrigger>🍎 Apple Calendar (iCloud)</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal list-inside space-y-1 text-sm">
                        <li>Open iCloud.com and go to Calendar</li>
                        <li>Click the share icon next to your calendar</li>
                        <li>Enable "Public Calendar"</li>
                        <li>Copy the URL</li>
                        <li>Replace "webcal://" with "https://" in the URL</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
