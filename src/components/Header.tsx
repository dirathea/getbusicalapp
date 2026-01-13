import { RefreshCwIcon, DownloadIcon, HelpCircle } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { ModeToggle } from '@/components/ModeToggle';

interface HeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function Header({ onRefresh, loading = false }: HeaderProps) {
  const { isInstallable, isInstalled, handleInstall } = useInstallPrompt();

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <span className="text-2xl">📅</span>
          <h1 className="text-xl font-bold">BusiCal</h1>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="gap-1.5">
            <Link to="/faq">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">FAQ</span>
            </Link>
          </Button>
          
          {isInstallable && !isInstalled && (
            <Button
              variant="default"
              size="sm"
              onClick={handleInstall}
              title="Install BusiCal as an app"
              className="gap-2"
            >
              <DownloadIcon className="h-4 w-4" />
              Install
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh events"
          >
            <RefreshCwIcon className={loading ? 'animate-spin' : ''} />
          </Button>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
