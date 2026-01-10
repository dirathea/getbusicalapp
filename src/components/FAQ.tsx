import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

const faqItems: FAQItem[] = [
  {
    id: 'what-is-cors-proxy',
    question: 'Why do I need to use a CORS proxy?',
    answer: (
      <p>
        Browsers block direct requests to calendar URLs due to CORS (Cross-Origin Resource Sharing) 
        security restrictions. The CORS proxy acts as a secure bridge, fetching your calendar data 
        on your behalf so the app can display your events.
      </p>
    ),
  },
  {
    id: 'data-storage',
    question: 'Is my calendar data stored on the server?',
    answer: (
      <div className="space-y-2">
        <p>
          <strong>No, absolutely not.</strong> The proxy only passes your calendar data through 
          to your browser. Nothing is stored, logged, or saved on the server.
        </p>
        <p>
          The data flow is: Calendar Provider → Proxy (pass-through) → Your Browser. 
          The proxy immediately returns the data without any persistence.
        </p>
      </div>
    ),
  },
  {
    id: 'event-sync-privacy',
    question: 'How does event syncing protect my privacy?',
    answer: (
      <div className="space-y-2">
        <p>
          When you sync an event from a calendar to the destination calendar, 
          SnapCal protects your privacy by <strong>not revealing the original event details</strong>.
        </p>
        <p>
          <strong>What gets synced:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Event title: "Synced Event" (generic title)</li>
          <li>Time slot: Same start and end time as your personal event</li>
          <li>Status: Marked as "Busy" to block the time</li>
        </ul>
        <p>
          <strong>What does NOT get synced:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>Original event title (e.g., "Doctor's appointment")</li>
          <li>Description or notes</li>
          <li>Location details</li>
          <li>Attendees or participants</li>
        </ul>
        <p>
          This way, your destination calendar shows you're busy during that time, but 
          can't see what you're actually doing. Your event stays private!
        </p>
      </div>
    ),
  },
  {
    id: 'what-data-proxy-sees',
    question: 'What data does the proxy see?',
    answer: (
      <p>
        The proxy temporarily processes your calendar URL and ICS file content while fetching it. 
        However, it immediately returns this data to your browser without storing, logging, or 
        retaining any information. Think of it as a transparent tunnel.
      </p>
    ),
  },
  {
    id: 'security',
    question: 'Is this secure?',
    answer: (
      <div className="space-y-2">
        <p>Yes. The proxy includes multiple security measures:</p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>URL validation to prevent malicious requests</li>
          <li>Protocol restriction (only http/https allowed)</li>
          <li>SSRF attack prevention</li>
          <li>File size limits (max 5MB)</li>
          <li>Content validation (must be valid ICS format)</li>
          <li>Security headers (X-Frame-Options, CSP, etc.)</li>
          <li>No logging policy (zero data retention)</li>
        </ul>
        <p>
          Additionally, all calendar data stays in your browser after fetching - nothing is sent 
          to external servers.
        </p>
      </div>
    ),
  },
  {
    id: 'self-host',
    question: 'Can I self-host the proxy?',
    answer: (
      <div className="space-y-2">
        <p>
          <strong>Yes!</strong> SnapCal is fully open source. You can deploy your own Cloudflare 
          Worker to have complete control over the proxy.
        </p>
        <p>
          Check the{' '}
          <a 
            href="https://github.com/dirathea/snapcal/blob/main/DEPLOYMENT.md" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            deployment documentation
          </a>{' '}
          for step-by-step instructions.
        </p>
      </div>
    ),
  },
  {
    id: 'calendar-url-safety',
    question: 'Is my calendar URL safe?',
    answer: (
      <div className="space-y-2">
        <p>
          Your calendar URL typically contains a secret token that grants read-only access to your 
          calendar. Keep this URL private, just like a password.
        </p>
        <p>
          <strong>SnapCal stores your URL only in your browser's localStorage</strong> - it never 
          leaves your device except when fetching calendar updates through the proxy.
        </p>
        <p>
          You can regenerate your calendar URL at any time from your calendar provider's settings 
          if you're concerned it was exposed.
        </p>
      </div>
    ),
  },
  {
    id: 'rate-limiting',
    question: 'Are there rate limits?',
    answer: (
      <p>
        Rate limiting is configured via Cloudflare's dashboard to prevent abuse. For self-hosted 
        deployments, we recommend setting up rate limiting rules appropriate for your usage. 
        Check the deployment documentation for guidance.
      </p>
    ),
  },
  {
    id: 'trust-verification',
    question: 'How can I verify these privacy claims?',
    answer: (
      <div className="space-y-2">
        <p>
          SnapCal is fully open source! You can inspect the code yourself:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-4">
          <li>
            <a 
              href="https://github.com/dirathea/snapcal/blob/main/worker/app.ts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Proxy implementation
            </a>{' '}
            - See exactly what the proxy does
          </li>
          <li>
            <a 
              href="https://github.com/dirathea/snapcal/blob/main/src/lib/icsParser.ts" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Client-side parsing
            </a>{' '}
            - See how data is processed in your browser
          </li>
          <li>
            <a 
              href="https://github.com/dirathea/snapcal/blob/main/PRIVACY.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Privacy policy
            </a>{' '}
            - Full transparency about data handling
          </li>
        </ul>
        <p>
          Or, self-host the entire application to have complete control!
        </p>
      </div>
    ),
  },
];

interface FAQProps {
  className?: string;
}

export function FAQ({ className }: FAQProps) {
  return (
    <Accordion type="single" collapsible className={className}>
      {faqItems.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger className="text-left">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
