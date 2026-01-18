import { Github, ExternalLink, Shield, Lock, EyeOff, Code } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AboutPage() {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">About BusiCal</h1>
        <p className="text-lg text-muted-foreground">
          Sync your personal calendar events to your work calendar — with privacy.
        </p>
      </div>

      {/* Featured: Why I Built This */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Why I Built This</CardTitle>
          <CardDescription>A personal story about privacy, complexity, and finding a better way</CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none [&>p]:mb-5">
          <p>
            I tried to build a proper calendar sync app, but it became prohibitively complex. Providers like
            Google Calendar and Outlook require extensive user agreements because once authorized,
            an app has access to ALL calendar events. This creates significant privacy risk — you're
            trusting the app with your most personal information.
          </p>
          <p>
            The breakthrough came when I realized the solution was simpler: don't store
            any data, period. Through brainstorming with AI, I discovered a safer and even better
            alternative: utilizing PWA features to generate and trigger native calendar events using
            ICS files. This approach avoids the OAuth complexity entirely while delivering the same
            functionality with better privacy.
          </p>
          <p>
            The only remaining challenge was CORS — a technical limitation that prevents browsers
            from fetching calendar URLs directly. I designed the CORS proxy with complete transparency,
            with clear documentation that users can verify themselves or self-host if they want
            complete control.
          </p>
          <p>
            This project was inspired by the PWA calendar capabilities demo at{' '}
            <a
              href="https://progressier.com/pwa-capabilities/calendar-events-pwa-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              progressier.com
            </a>
            .
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            — dirathea
          </p>
        </CardContent>
      </Card>

      {/* The OAuth Challenge */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">The OAuth Challenge</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            When you authorize a calendar app through OAuth, you're granting it access to read and
            sometimes write events on your calendar. This permission is all-or-nothing — the app
            can see every event, including sensitive ones like medical appointments, personal
            meetings, or family events.
          </p>
          <p>
            Calendar providers require extensive agreements because they understand the sensitivity
            of this access. It's a legitimate concern: once an app has your calendar data, there's
            no way to limit what it can see or track.
          </p>
        </div>
      </section>

      {/* The Data-Less Solution */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">The Data-Less Solution</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <Lock className="h-5 w-5 text-primary mb-2" />
              <CardTitle className="text-base">No Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                BusiCal stores nothing on any server. Your calendar data stays on your device.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <EyeOff className="h-5 w-5 text-primary mb-2" />
              <CardTitle className="text-base">Privacy Sync</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Events sync as "Synced Event" marked as busy — no sensitive details exposed.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Shield className="h-5 w-5 text-primary mb-2" />
              <CardTitle className="text-base">Local Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All calendar parsing and processing happens in your browser's localStorage.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Transparency on CORS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Transparency on CORS</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p>
            BusiCal uses a Cloudflare Worker as a CORS proxy to fetch your calendar data. This is
            necessary because browsers block direct requests to calendar URLs due to Cross-Origin
            Resource Sharing (CORS) security restrictions.
          </p>
          <p>
            <strong>What this means:</strong> The proxy receives your calendar URL, fetches the ICS
            file, and returns it directly to your browser. It does not store, log, or retain any
            data. Think of it as a transparent tunnel — data flows through but nothing sticks.
          </p>
          <p>
            You can verify this yourself by reading the proxy code on GitHub, or deploy your own
            instance for complete control. The proxy includes security measures like URL validation,
            SSRF prevention, and content validation to ensure safe operation.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Core Values</h2>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Privacy-first</strong> — Your calendar data should never leave your device
              unless necessary for syncing
            </li>
            <li>
              <strong>Minimal trust</strong> — Verify the code yourself or self-host for complete
              control
            </li>
            <li>
              <strong>Transparency</strong> — Clear documentation on how everything works, including
              the CORS proxy
            </li>
            <li>
              <strong>User control</strong> — Regenerate your ICS URL anytime to revoke access
            </li>
          </ul>
        </div>
      </section>

      {/* Chrome Extension */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Chrome Extension Available</h2>
        <div className="border-2 border-primary/20 rounded-lg p-6 bg-primary/5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.182c.855 0 1.682.11 2.473.315L9.745 9.09a4.364 4.364 0 1 0 4.47 6.204l4.778 2.759A9.818 9.818 0 0 1 2.182 12c0-5.423 4.395-9.818 9.818-9.818zm6.982 4.437c1.516 1.694 2.445 3.925 2.445 6.381a9.757 9.757 0 0 1-.315 2.473l-6.857-3.96a4.363 4.363 0 0 0-2.164-5.894l2.891-5.007z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">One-Click Sharing from Google Calendar</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Install our Chrome extension to add share buttons directly to Google Calendar. 
                Share events with one click without leaving your calendar.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://chrome.google.com/webstore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                >
                  Coming Soon to Chrome Web Store
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/dirathea/getbusicalapp/tree/main/extension"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted/50 transition-colors text-sm"
                >
                  <Github className="h-4 w-4" />
                  View Extension Code
                </a>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Zero Network Requests</strong>
                <span className="text-muted-foreground text-xs">All processing happens locally</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Lock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Minimal Permissions</strong>
                <span className="text-muted-foreground text-xs">Only calendar.google.com access</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Code className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block">Open Source</strong>
                <span className="text-muted-foreground text-xs">Verify the code yourself</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Learn More</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <a
            href="/faq"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium">FAQ</h3>
              <p className="text-sm text-muted-foreground">
                Common questions about privacy, security, and how BusiCal works
              </p>
            </div>
          </a>
          <a
            href="/privacy"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">
                Detailed information on data handling and privacy guarantees
              </p>
            </div>
          </a>
          <a
            href="https://github.com/dirathea/getbusicalapp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium">Source Code</h3>
              <p className="text-sm text-muted-foreground">
                Review the code on GitHub and verify the privacy claims
              </p>
            </div>
            <Github className="h-4 w-4 text-muted-foreground" />
          </a>
          <a
            href="https://github.com/dirathea/getbusicalapp/blob/main/DEPLOYMENT.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium">Self-Hosting</h3>
              <p className="text-sm text-muted-foreground">
                Deploy your own instance for complete control over the proxy
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
