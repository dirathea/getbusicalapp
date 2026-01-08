import { RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function Header({ onRefresh, loading = false }: HeaderProps) {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h1 className="text-xl font-bold">SnapCal</h1>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh events"
        >
          <RefreshCwIcon className={loading ? 'animate-spin' : ''} />
        </Button>
      </div>
    </header>
  );
}
