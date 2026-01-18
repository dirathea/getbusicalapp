import { Users, Handshake, Briefcase } from 'lucide-react';

export function WhoShouldUse() {
  return (
    <div className="space-y-3 py-4 border-t border-border">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-base">🎯</span>
        <h3 className="text-sm font-medium">
          Whether you're a recruiter, in sales, or juggling multiple calendars
        </h3>
      </div>

      {/* 3 Persona Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Recruiters */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Recruiters</p>
            <p className="text-xs text-muted-foreground">
              Juggling candidate interviews without exposing your full schedule
            </p>
          </div>
        </div>

        {/* Sales Teams */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Sales Teams</p>
            <p className="text-xs text-muted-foreground">
              Syncing client meetings while keeping personal events private
            </p>
          </div>
        </div>

        {/* Busy Professionals */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Busy Professionals</p>
            <p className="text-xs text-muted-foreground">
              Managing work, personal, and side projects seamlessly
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}