import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWeekRangeLabel } from '@/lib/dateUtils';

interface WeekNavigationProps {
  value: number;
  onChange: (value: number) => void;
}

export function WeekNavigation({ value, onChange }: WeekNavigationProps) {
  const isCurrentWeek = value === 0;
  const weekLabel = getWeekRangeLabel(value);
  
  return (
    <div className="space-y-2">
      {/* Desktop layout */}
      <div className="hidden md:flex items-center gap-3">
        {/* Left group: Today + Previous buttons */}
        <div className="flex gap-1 shrink-0">
          {!isCurrentWeek && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange(0)}
              className="flex items-center gap-1.5"
              aria-label="Jump to current week"
            >
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Today</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(value - 1)}
            disabled={isCurrentWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Centered date range */}
        <div className="flex-1 text-center text-sm font-medium px-4">
          {weekLabel}
        </div>
        
        {/* Right: Next week button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onChange(value + 1)}
          aria-label="Next week"
          className="shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Mobile layout */}
      <div className="md:hidden space-y-2">
        <div className="flex gap-1 rounded-lg border bg-muted p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(value - 1)}
            disabled={isCurrentWeek}
            aria-label="Previous week"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 flex items-center justify-center px-2 text-sm font-medium">
            {weekLabel}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange(value + 1)}
            aria-label="Next week"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        {!isCurrentWeek && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(0)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Today</span>
          </Button>
        )}
      </div>
    </div>
  );
}
