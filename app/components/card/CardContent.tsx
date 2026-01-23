import { CardData } from "@/lib/github/types";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { StatBlock } from "./StatBlock";
import { LanguageBar } from "./LanguageBar";
import { ContributionGraph } from "./ContributionGraph";
import { ThemeId, themes } from "@/lib/themes";

interface CardContentProps {
  data: CardData;
  theme: ThemeId;
}

export function CardContent({ data, theme }: CardContentProps) {
  const isRepo = data.type === "repo";
  const isOrg = data.type === "organization";
  const themeConfig = themes[theme];

  return (
    <GlassPanel
      intensity="high"
      className="relative overflow-hidden p-6 w-[550px]"
      style={{
        borderColor: themeConfig.borderTop,
        boxShadow: `0 0 40px ${themeConfig.glow}`,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              className="absolute -inset-1 rounded-full blur opacity-75"
              style={{
                background: `linear-gradient(to right, ${themeConfig.primary}, ${themeConfig.accent})`,
              }}
            />
            <img
              src={data.avatarUrl}
              alt={data.name}
              className="relative h-24 w-24 rounded-full border-2 border-white/20"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-white">
              {isRepo ? data.name : data.name || data.username}
            </h1>
            <p style={{ color: themeConfig.accent }}>
              {isRepo ? `${data.owner}/${data.name}` : `@${data.username}`}
            </p>
            {"description" in data && data.description && (
              <p className="mt-2 text-sm text-slate-300 max-w-[300px] line-clamp-2">
                {data.description}
              </p>
            )}
            {!isRepo && "bio" in data && data.bio && (
              <p className="mt-2 text-sm text-slate-300 max-w-[300px] line-clamp-2">
                {data.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6 flex gap-3">
        {isRepo ? (
          <>
            <StatBlock label="Stars" value={data.stars} icon="⭐" />
            <StatBlock label="Forks" value={data.forks} icon="🍴" />
            <StatBlock label="Watchers" value={data.watchers} icon="👀" />
          </>
        ) : isOrg ? (
          <>
            <StatBlock label="Stars" value={data.totalStars} icon="⭐" />
            <StatBlock label="Repos" value={data.totalRepos} icon="📦" />
            <StatBlock label="Forks" value={data.totalForks} icon="🍴" />
          </>
        ) : (
          "totalStars" in data && (
            <>
              <StatBlock label="Stars" value={data.totalStars} icon="⭐" />
              <StatBlock label="Commits" value={data.totalCommits} icon="🔥" />
              <StatBlock label="Repos" value={data.totalRepos} icon="📦" />
              <StatBlock label="Followers" value={data.followers} icon="👥" />
            </>
          )
        )}
      </div>

      {/* Additional Info */}
      <LanguageBar languages={data.languages} />

      {!isRepo && "contributions" in data && (
        <ContributionGraph days={data.contributions.calendar} />
      )}
    </GlassPanel>
  );
}
