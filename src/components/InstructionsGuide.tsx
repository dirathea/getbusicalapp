import { LinkIcon, CalendarIcon, MailIcon, ShieldIcon, Info } from 'lucide-react';
import { Link } from 'react-router';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export function InstructionsGuide() {
  return (
    <div className="space-y-3 py-4 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-base">📖</span>
        <h3 className="text-sm font-medium">How SnapCal Works</h3>
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

      {/* Privacy Note */}
      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
        <ShieldIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          <strong>Privacy:</strong> Events sync as "Synced Event" - no personal details shared
        </p>
      </div>

      {/* Technical Note - Collapsible */}
      <Collapsible className="pt-2">
        <CollapsibleTrigger className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <Info className="h-3 w-3" />
          <span>How does the CORS proxy work?</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            SnapCal uses a secure proxy to fetch your calendar because browsers block 
            direct calendar access (CORS restrictions). The proxy acts as a pass-through - 
            it fetches your calendar data and immediately returns it to your browser 
            <strong> without storing, logging, or saving anything</strong>. Think of it as 
            a transparent tunnel. <Link to="/faq" className="text-primary hover:underline">
            Learn more in our FAQ →</Link>
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
