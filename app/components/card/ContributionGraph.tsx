import { ProcessedUserData } from "@/lib/github/types";
import { cn } from "@/lib/utils";

export function ContributionGraph({
  days,
}: {
  days: ProcessedUserData["contributions"]["calendar"];
}) {
  // We only show the last 10 weeks or so to fit
  const weeks = days;

  return (
    <div className="mt-6 flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Contributions
        </span>
        <span className="text-xs text-slate-500">Last 10 Weeks</span>
      </div>

      <div className="flex justify-between gap-1">
        {weeks.map((week, i) => (
          <div key={i} className="flex flex-col gap-1">
            {week.contributionDays.map((day, j) => (
              <div
                key={day.date}
                className={cn(
                  "h-2 w-2 rounded-sm",
                  day.color === "#ebedf0" || day.contributionCount === 0
                    ? "bg-white/5"
                    : undefined,
                )}
                style={{
                  backgroundColor:
                    day.contributionCount > 0 ? day.color : undefined,
                  opacity: day.contributionCount > 0 ? 0.8 : 1, // Adjust github colors for dark theme
                }}
                title={`${day.date}: ${day.contributionCount} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
