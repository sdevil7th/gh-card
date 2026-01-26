import { CardData, ProcessedUserData } from "@/lib/github/types";
import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { StatBlock } from "./StatBlock";
import { LanguageBar } from "./LanguageBar";
import { ContributionGraph } from "./ContributionGraph";
import { ThemeId, themes, getThemePalette } from "@/lib/themes";
import { Star, GitFork, Eye, Box, Flame, Users } from "lucide-react";

interface CardContentProps {
  data: CardData;
  theme: ThemeId;
  size: "small" | "large";
}

export function CardContent({ data, theme, size }: CardContentProps) {
  const isRepo = data.type === "repo";
  const isOrg = data.type === "organization";
  const themeConfig = themes[theme];
  const isLarge = size === "large";

  // Override language colors with theme palette
  const palette = getThemePalette(themeConfig);
  const coloredLanguages = data.languages.map((lang, index) => ({
    ...lang,
    color: palette[index % palette.length],
  }));

  return (
    <GlassPanel
      intensity="high"
      className="relative overflow-hidden w-full h-full flex flex-col"
      style={{
        borderColor: themeConfig.borderTop,
        boxShadow: `0 0 40px ${themeConfig.glow}`,
        padding: isLarge ? "40px" : "24px",
      }}
    >
      {/* Header */}
      <div
        className={`flex items-start justify-between ${isLarge ? "mb-12" : "mb-4"}`}
      >
        <div className={`flex items-center ${isLarge ? "gap-6" : "gap-3"}`}>
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
              className={`relative rounded-full border-2 border-white/20 ${
                isLarge ? "h-24 w-24" : "h-12 w-12"
              }`}
            />
          </div>

          <div className="flex flex-col justify-center">
            <h1
              className={`font-bold text-white leading-tight truncate ${
                isLarge ? "text-4xl max-w-[600px]" : "text-xl max-w-[260px]"
              }`}
            >
              {isRepo ? data.name : data.name || data.username}
            </h1>
            <p
              className={`${isLarge ? "text-xl mt-1" : "text-xs mt-0.5"}`}
              style={{ color: themeConfig.accent }}
            >
              {isRepo ? `${data.owner}/${data.name}` : `@${data.username}`}
            </p>
            {isLarge && "description" in data && data.description && (
              <p className="mt-3 text-base text-slate-300 max-w-[600px] line-clamp-2 leading-relaxed">
                {data.description}
              </p>
            )}
            {isLarge && !isRepo && "bio" in data && data.bio && (
              <p className="mt-3 text-base text-slate-300 max-w-[600px] line-clamp-2 leading-relaxed">
                {data.bio}
              </p>
            )}
          </div>
        </div>
        {!isRepo && "contributions" in data && (
          // Show contributions on both Small and Large, just scaled/containerized differently if needed
          <ContributionGraph
            days={(data as ProcessedUserData).contributions.calendar}
            type={size}
          />
        )}
      </div>

      {/* Stats Grid */}
      <div className={`flex w-full ${isLarge ? "gap-4 mb-6" : "gap-2 mb-2"}`}>
        {isRepo ? (
          <>
            <StatBlock
              label="Stars"
              value={data.stars}
              icon={
                <Star size={isLarge ? 28 : 16} color={themeConfig.accent} />
              }
              size={size}
            />
            <StatBlock
              label="Forks"
              value={data.forks}
              icon={
                <GitFork size={isLarge ? 28 : 16} color={themeConfig.accent} />
              }
              size={size}
            />
            <StatBlock
              label="Watchers"
              value={data.watchers}
              icon={<Eye size={isLarge ? 28 : 16} color={themeConfig.accent} />}
              size={size}
            />
          </>
        ) : isOrg ? (
          <>
            <StatBlock
              label="Stars"
              value={data.totalStars}
              icon={
                <Star size={isLarge ? 28 : 16} color={themeConfig.accent} />
              }
              size={size}
            />
            <StatBlock
              label="Repos"
              value={data.totalRepos}
              icon={<Box size={isLarge ? 28 : 16} color={themeConfig.accent} />}
              size={size}
            />
            {isLarge && (
              <StatBlock
                label="Forks"
                value={data.totalForks}
                icon={
                  <GitFork
                    size={isLarge ? 28 : 16}
                    color={themeConfig.accent}
                  />
                }
                size={size}
              />
            )}
          </>
        ) : (
          "totalStars" in data && (
            <>
              <StatBlock
                label="Stars"
                value={(data as ProcessedUserData).totalStars}
                icon={
                  <Star size={isLarge ? 28 : 16} color={themeConfig.accent} />
                }
                size={size}
              />
              {isLarge && (
                <StatBlock
                  label="Commits"
                  value={(data as ProcessedUserData).totalCommits}
                  icon={
                    <Flame
                      size={isLarge ? 28 : 16}
                      color={themeConfig.accent}
                    />
                  }
                  size={size}
                />
              )}
              <StatBlock
                label="Repos"
                value={(data as ProcessedUserData).totalRepos}
                icon={
                  <Box size={isLarge ? 28 : 16} color={themeConfig.accent} />
                }
                size={size}
              />
              <StatBlock
                label="Followers"
                value={(data as ProcessedUserData).followers}
                icon={
                  <Users size={isLarge ? 28 : 16} color={themeConfig.accent} />
                }
                size={size}
              />
            </>
          )
        )}
      </div>

      {/* Language Bar & Contributions */}
      <div className="mt-auto w-full">
        <LanguageBar
          languages={coloredLanguages}
          height={isLarge ? "12px" : "8px"}
          type={size}
        />
      </div>
    </GlassPanel>
  );
}
