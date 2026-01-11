import { Github, ExternalLink, Shield, Lock, EyeOff } from 'lucide-react';
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
        <h1 className="text-3xl font-bold tracking-tight">About SnapCal</h1>
        <p className="text-lg text-muted-foreground">
          Sync your personal calendar events to your work calendar without exposing your privacy.
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
                SnapCal stores nothing on any server. Your calendar data stays on your device.
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
            SnapCal uses a Cloudflare Worker as a CORS proxy to fetch your calendar data. This is
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
                Common questions about privacy, security, and how SnapCal works
              </p>
            </div>
          </a>
          <a
            href="https://github.com/dirathea/snapcal/blob/main/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-medium">Privacy Policy</h3>
              <p className="text-sm text-muted-foreground">
                Detailed information on data handling and privacy guarantees
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </a>
          <a
            href="https://github.com/dirathea/snapcal"
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
            href="https://github.com/dirathea/snapcal/blob/main/DEPLOYMENT.md"
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
