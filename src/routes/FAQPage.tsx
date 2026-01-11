import { FAQ } from '@/components/FAQ';
import { ShieldCheck, Lock, Code, HelpCircle } from 'lucide-react';

export function FAQPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Frequently Asked Questions</h1>
        </div>
        <p className="text-muted-foreground">
          Learn about BusiCal's privacy, security, and how the CORS proxy works.
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 space-y-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Privacy First</h3>
          <p className="text-xs text-muted-foreground">
            No data stored or logged on servers. Everything stays in your browser.
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-2">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Secure by Design</h3>
          <p className="text-xs text-muted-foreground">
            URL validation, SSRF prevention, and security headers protect your data.
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-2">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Open Source</h3>
          <p className="text-xs text-muted-foreground">
            Fully transparent code. Verify our privacy claims or self-host.
          </p>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Common Questions</h2>
        <FAQ />
      </div>

      {/* Additional Resources */}
      <div className="border-t pt-6 space-y-4">
        <h2 className="text-lg font-semibold">Additional Resources</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a
            href="https://github.com/dirathea/getbusicalapp/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <h3 className="font-medium text-sm mb-1">Documentation</h3>
            <p className="text-xs text-muted-foreground">
              Full technical documentation and setup guide
            </p>
          </a>

          <a
            href="https://github.com/dirathea/getbusicalapp/blob/main/PRIVACY.md"
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <h3 className="font-medium text-sm mb-1">Privacy Policy</h3>
            <p className="text-xs text-muted-foreground">
              Detailed privacy and data handling policy
            </p>
          </a>

          <a
            href="https://github.com/dirathea/getbusicalapp/blob/main/DEPLOYMENT.md"
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <h3 className="font-medium text-sm mb-1">Self-Hosting Guide</h3>
            <p className="text-xs text-muted-foreground">
              Deploy your own instance with complete control
            </p>
          </a>

          <a
            href="https://github.com/dirathea/getbusicalapp"
            target="_blank"
            rel="noopener noreferrer"
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <h3 className="font-medium text-sm mb-1">Source Code</h3>
            <p className="text-xs text-muted-foreground">
              Review the code on GitHub
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
