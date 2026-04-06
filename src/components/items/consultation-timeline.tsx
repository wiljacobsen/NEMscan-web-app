import type { ConsultationTimeline as TimelineEntry } from "@prisma/client";
import { formatDate, daysUntil } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Clock, AlertTriangle } from "lucide-react";

export function ConsultationTimeline({ entries }: { entries: TimelineEntry[] }) {
  if (!entries.length) return null;

  return (
    <div className="space-y-3">
      <h4 className="flex items-center gap-2 font-heading text-sm font-semibold">
        <Clock className="h-4 w-4 text-nem-accent" />
        Consultation Timeline
      </h4>
      <div className="relative ml-2 border-l border-nem-border pl-4">
        {entries.map((entry) => {
          const days = daysUntil(entry.milestoneDate);
          const isPast = days < 0;
          const isUpcoming = days >= 0 && days <= 14;

          return (
            <div key={entry.id} className="relative mb-4 last:mb-0">
              <div
                className={cn(
                  "absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2",
                  entry.isDeadline && !isPast
                    ? "border-nem-high bg-nem-high"
                    : isPast
                      ? "border-muted-foreground/30 bg-muted-foreground/30"
                      : "border-nem-accent bg-nem-accent"
                )}
              />
              <div className={cn("text-sm", isPast && "opacity-50")}>
                <div className="flex items-center gap-2">
                  <span className={cn("font-medium", entry.isDeadline && !isPast && "text-nem-high")}>
                    {entry.milestoneName}
                  </span>
                  {entry.isDeadline && isUpcoming && (
                    <span className="flex items-center gap-1 rounded-full bg-nem-high/10 px-2 py-0.5 text-[10px] text-nem-high">
                      <AlertTriangle className="h-3 w-3" />
                      {days === 0 ? "Today" : `${days}d left`}
                    </span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(entry.milestoneDate)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
