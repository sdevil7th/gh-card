import { ProcessedUserData } from "@/lib/github/types";
import { cn } from "@/lib/utils";

export function ContributionGraph({
  days,
  type,
}: {
  days: ProcessedUserData["contributions"]["calendar"];
  type: "small" | "large";
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
            {week.contributionDays.map((day, j) => (
              <div
                key={day.date}
                className={cn(
                  isSmall ? "h-[5px] w-[5px]" : "h-2 w-2", // 12px is h-3 w-3
                  isSmall ? "rounded-full" : "rounded-[2px]", // Satori 20px -> full
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
