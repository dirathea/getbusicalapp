import { ShieldCheck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router';

export function PrivacyBanner() {
  return (
    <Alert variant="default" className="border-primary/50 bg-primary/5">
      <ShieldCheck className="h-4 w-4 text-primary" />
      <AlertTitle className="text-sm font-semibold">
        Your Privacy is Protected
      </AlertTitle>
      <AlertDescription className="text-xs space-y-2">
        <p>
          BusiCal uses a CORS proxy to fetch your calendar data.
          <strong> No data is stored, logged, or saved on our servers</strong> –
          everything stays in your browser.
        </p>
        <p>
          <Link 
            to="/faq" 
            className="text-primary hover:underline font-medium"
          >
            Learn more about how it works →
          </Link>
        </p>
      </AlertDescription>
    </Alert>
  );
}
