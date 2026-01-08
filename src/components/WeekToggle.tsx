import type { WeekView } from '@/types';
import { Button } from '@/components/ui/button';

interface WeekToggleProps {
  value: WeekView;
  onChange: (value: WeekView) => void;
}

export function WeekToggle({ value, onChange }: WeekToggleProps) {
  return (
    <div className="flex gap-1 rounded-lg border bg-muted p-1">
      <Button
        variant={value === 'this-week' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('this-week')}
        className="flex-1"
      >
        This Week
      </Button>
      <Button
        variant={value === 'next-week' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onChange('next-week')}
        className="flex-1"
      >
        Next Week
      </Button>
    </div>
  );
}
