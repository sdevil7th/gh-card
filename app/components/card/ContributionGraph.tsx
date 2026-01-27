import { ProcessedUserData } from "@/lib/github/types";
import { cn } from "@/lib/utils";
import { Theme } from "@/lib/themes";

export function ContributionGraph({
  days,
  type,
  theme,
}: {
  days: ProcessedUserData["contributions"]["calendar"];
  type: "small" | "large";
  theme: Theme;
}) {
  // We only show the last 10 weeks or so to fit
  const weeks = days;

  const isSmall = type === "small";

  return (
    <div
      className={cn(
        "flex flex-col",
        isSmall ? "gap-[2px]" : "gap-[4px]",
        isSmall ? "mt-[2px]" : "mt-2",
      )}
    >
      <div className="flex justify-between items-end">
        <span
          className={cn(
            "font-bold text-slate-400 uppercase tracking-wider",
            isSmall ? "text-[9px] mr-[14px]" : "text-xs mr-9",
          )}
        >
          Contributions
        </span>
        <span
          className={cn(
            "text-slate-500",
            isSmall ? "text-[8px]" : "text-[10px]",
          )}
        >
          Last 10 Weeks
        </span>
      </div>

      <div
        className={cn(
          "flex justify-between",
          isSmall ? "gap-[3px]" : "gap-[5px]",
        )}
      >
        {weeks.map((week, i) => (
          <div
            key={i}
            className={cn("flex flex-col", isSmall ? "gap-[3px]" : "gap-[5px]")}
          >
            {week.contributionDays.map((day, j) => {
              // Determine intensity or just use primary color for active days
              const isActive = day.contributionCount > 0;

              // Simple intensity mapping based on count is unreliable without max reference,
              // so we'll just use the theme primary color with varying opacity if possible,
              // or just a solid theme color for visual consistency.
              // For a "neon" feel, varying opacity works well.
              let opacity = 0.4;
              if (day.contributionCount > 0) opacity = 0.5;
              if (day.contributionCount > 2) opacity = 0.7;
              if (day.contributionCount > 5) opacity = 0.9;

              return (
                <div
                  key={day.date}
                  className={cn(
                    isSmall ? "h-[5px] w-[5px]" : "h-2 w-2",
                    isSmall ? "rounded-full" : "rounded-[2px]",
                    !isActive ? "bg-white/5" : undefined,
                  )}
                  style={{
                    backgroundColor: isActive ? theme.primary : undefined,
                    opacity: isActive ? opacity : 1,
                    boxShadow: isActive
                      ? `0 0 ${isSmall ? "2px" : "4px"} ${theme.primary}`
                      : "none",
                  }}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
