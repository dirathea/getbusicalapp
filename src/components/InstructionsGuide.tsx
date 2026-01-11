import { LinkIcon, CalendarIcon, MailIcon } from 'lucide-react';

export function InstructionsGuide() {
  return (
    <div className="space-y-3 py-4 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-base">📖</span>
        <h3 className="text-sm font-medium">How BusiCal Works</h3>
      </div>

      {/* 3-Step Visual Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Step 1: Add URL */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Add URL</p>
            <p className="text-xs text-muted-foreground">
              Paste your personal calendar URL
            </p>
          </div>
        </div>

        {/* Step 2: Select Events */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Select Events</p>
            <p className="text-xs text-muted-foreground">
              Browse & pick events to sync
            </p>
          </div>
        </div>

        {/* Step 3: Sync */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <MailIcon className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Sync</p>
            <p className="text-xs text-muted-foreground">
              Export to work calendar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
