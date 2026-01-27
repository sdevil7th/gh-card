import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { fetchGithubData } from "@/lib/github/client";
import {
  CardData,
  ProcessedUserData,
  ContributionWeek,
} from "@/lib/github/types";
import { ThemeId, themes, defaultTheme } from "@/lib/themes";
import { normalizePercentages } from "@/lib/utils/normalization";
import { Star, GitFork, Eye, Box, Flame, Users } from "lucide-react";

// Runtime configuration:
// For Netlify, the default Node.js runtime is often more stable for environment variables and fetching.
// If you specifically need Edge, uncomment the line below.
// export const runtime = "edge";

// Map font IDs to URLs or keep them hardcoded for now
const fontMap = {
  orbitron: {
    regular:
      "https://cdn.jsdelivr.net/fontsource/fonts/orbitron@latest/latin-400-normal.woff",
    bold: "https://cdn.jsdelivr.net/fontsource/fonts/orbitron@latest/latin-700-normal.woff",
  },
  inter: {
    regular:
      "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
    bold: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
  },
  roboto: {
    regular:
      "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.woff",
    bold: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-700-normal.woff",
  },
  didot: {
    regular:
      "https://cdn.jsdelivr.net/fontsource/fonts/gfs-didot@latest/greek-400-normal.woff", // Using GFS Didot as closest free alternative
    bold: "https://cdn.jsdelivr.net/fontsource/fonts/gfs-didot@latest/greek-400-normal.woff", // GFS Didot might only have 400
  },
  garamond: {
    regular:
      "https://cdn.jsdelivr.net/fontsource/fonts/eb-garamond@latest/latin-400-normal.woff",
    bold: "https://cdn.jsdelivr.net/fontsource/fonts/eb-garamond@latest/latin-700-normal.woff",
  },
};

const loadFonts = async (fontId: string) => {
  const selectedFont =
    fontMap[fontId as keyof typeof fontMap] || fontMap.orbitron;

  try {
    console.log(`Starting font load for ${fontId}...`);
    const [regular, bold] = await Promise.all([
      fetch(selectedFont.regular).then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch Regular font: ${res.statusText}`);
        return res.arrayBuffer();
      }),
      fetch(selectedFont.bold).then((res) => {
        if (!res.ok)
          throw new Error(`Failed to fetch Bold font: ${res.statusText}`);
        return res.arrayBuffer();
      }),
    ]);
    console.log(`Fonts loaded for ${fontId}.`);
    return { regular, bold };
  } catch (e) {
    console.error("Font loading failure:", e);
    throw e;
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const size = searchParams.get("size") === "small" ? "small" : "large";
  const themeParam = searchParams.get("theme") as ThemeId | null;
  const fontParam = searchParams.get("font") || "orbitron";
  const theme =
    themeParam && themes[themeParam] ? themes[themeParam] : defaultTheme;

  // Dimensions - Small: 480x270, Large: 1280x720 (16:9)
  // Dimensions - Small: 480x270, Large: 960x540 (16:9)
  const width = size === "small" ? 480 : 960;
  const height = size === "small" ? 270 : 540;

  console.log(
    `[OG Request] Username: ${username}, Size: ${size}, Theme: ${theme.id}, Font: ${fontParam}`,
  );

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN missing");
    return new Response("GITHUB_TOKEN is missing", { status: 500 });
  }

  try {
    console.log("Fetching GitHub data...");
    const data = await fetchGithubData(username);
    console.log("GitHub data fetched successfully");

    const fontsData = await loadFonts(fontParam);
    const fontFamily =
      fontParam === "didot"
        ? '"GFS Didot"'
        : fontParam === "garamond"
          ? '"EB Garamond"'
          : `"${fontParam}"`;

    const fonts = [
      {
        name: fontFamily.replace(/"/g, ""),
        data: fontsData.regular,
        style: "normal" as const,
        weight: 400 as const,
      },
      {
        name: fontFamily.replace(/"/g, ""),
        data: fontsData.bold,
        style: "normal" as const,
        weight: 700 as const,
      },
    ];

    console.log("Generating ImageResponse...");
    return new ImageResponse(
      <Wrapper
        size={size}
        width={width}
        height={height}
        theme={theme}
        fontFamily={fontFamily}
      >
        {size === "small" ? (
          <SmallCard data={data} theme={theme} fontFamily={fontFamily} />
        ) : (
          <LargeCard data={data} theme={theme} fontFamily={fontFamily} />
        )}
      </Wrapper>,
      {
        width,
        height,
        fonts,
      },
    );
  } catch (e: any) {
    console.error("OG Generation Error:", e);
    // Log stack trace if available
    if (e.stack) console.error(e.stack);

    return new Response(`Failed: ${e.message}`, {
      status: 500,
    });
  }
}

// --- Layouts ---

import { Theme, getThemePalette } from "@/lib/themes";

function Wrapper({
  children,
  size,
  width,
  height,
  theme,
  fontFamily,
}: {
  children: React.ReactNode;
  size: "small" | "large";
  width: number;
  height: number;
  theme: Theme;
  fontFamily: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "white",
        fontFamily: fontFamily,
        position: "relative",
      }}
    >
      {/* Background Glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: size === "small" ? "380px" : "800px",
          height: size === "small" ? "200px" : "500px",
          backgroundImage: `radial-gradient(circle at 50% 50%, ${theme.glow}, transparent 70%)`,
          display: "flex",
        }}
      />
      {children}
    </div>
  );
}

function LargeCard({
  data,
  theme,
  fontFamily,
}: {
  data: CardData;
  theme: Theme;
  fontFamily: string;
}) {
  const isRepo = data.type === "repo";
  const isOrg = data.type === "organization";
  const hasContributions = !isRepo && !isOrg && "contributions" in data;

  // Theme-aware languages
  // Theme-aware languages
  const palette = getThemePalette(theme);

  // Normalize language percentages for display
  const normalizedPercentages = normalizePercentages(
    data.languages.map((l) => ({ percentage: l.percentage })),
  );

  const coloredLanguages = data.languages.map((lang, index) => ({
    ...lang,
    color: palette[index % palette.length],
    textPercentage: normalizedPercentages[index],
  }));

  return (
    <GlassContainer width="100%" height="100%" padding="40px" theme={theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: hasContributions ? "flex-start" : "center",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: data.type === "repo" ? "48px" : "36px",
            flexShrink: 0,
          }}
        >
          <HeaderContent
            data={data}
            size="large"
            theme={theme}
            fontFamily={fontFamily}
          />
          {hasContributions && (
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <ContributionGraph
                days={(data as ProcessedUserData).contributions.calendar}
                type="large"
                themeColor={theme.primary}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "16px",
            marginBottom: "24px",
            flexShrink: 0,
          }}
        >
          <StatsRow data={data} size="large" theme={theme} />
        </div>

        {/* Language Bar - Fixed Height */}
        <div style={{ flexShrink: 0, display: "flex" }}>
          <LanguageBar languages={coloredLanguages} type="large" />
        </div>
      </div>
    </GlassContainer>
  );
}

function SmallCard({
  data,
  theme,
  fontFamily,
}: {
  data: CardData;
  theme: Theme;
  fontFamily: string;
}) {
  const isRepo = data.type === "repo";
  const isOrg = data.type === "organization";
  const hasContributions = !isRepo && !isOrg && "contributions" in data;

  // Theme-aware languages
  // Theme-aware languages
  const palette = getThemePalette(theme);

  // Normalize language percentages for display
  const normalizedPercentages = normalizePercentages(
    data.languages.map((l) => ({ percentage: l.percentage })),
  );

  const coloredLanguages = data.languages.map((lang, index) => ({
    ...lang,
    color: palette[index % palette.length],
    textPercentage: normalizedPercentages[index],
  }));

  return (
    <GlassContainer width="100%" height="100%" padding="20px" theme={theme}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        {/* Top Row: Info + Stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <HeaderContent
            data={data}
            size="small"
            theme={theme}
            fontFamily={fontFamily}
          />
          {hasContributions && (
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <ContributionGraph
                days={(data as ProcessedUserData).contributions.calendar}
                type="small"
                themeColor={theme.primary}
              />
            </div>
          )}
        </div>

        {/* Middle: Stats */}
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "8px",
            marginTop: data.type === "repo" ? "20px" : "16px",
          }}
        >
          <StatsRow data={data} size="small" theme={theme} />
        </div>

        {/* Bottom: Language Bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: "auto",
          }}
        >
          <LanguageBar languages={coloredLanguages} height="8px" type="small" />
        </div>
      </div>
    </GlassContainer>
  );
}

// --- Components ---

function GlassContainer({
  children,
  width,
  height,
  padding = "48px",
  theme,
}: {
  children: React.ReactNode;
  width: string;
  height: string;
  padding?: string;
  theme: Theme;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: width,
        height: height,
        // Match the "intensity=high" look from GlassPanel
        background: `linear-gradient(145deg, rgba(15, 23, 42, 0.95), ${theme.backgroundTint})`,
        borderTop: `2px solid ${theme.borderTop}`,
        borderLeft: `2px solid ${theme.borderLeft}`,
        borderRight: `2px solid rgba(255, 255, 255, 0.05)`,
        borderBottom: `2px solid rgba(255, 255, 255, 0.05)`,
        borderRadius: "24px",
        padding: padding,
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 60px -15px ${theme.glow}, inset 0 0 40px ${theme.glow.replace("0.3", "0.05")}`,
      }}
    >
      {/* Top glow accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "20%",
          right: "20%",
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${theme.borderTop}, transparent)`,
          display: "flex",
        }}
      />
      {/* Corner accent glow - more subtle */}
      <div
        style={{
          position: "absolute",
          top: "-50px",
          left: "-50px",
          width: "200px",
          height: "200px",
          background: `radial-gradient(circle at 50% 50%, ${theme.glow.replace("0.3", "0.15")}, transparent 70%)`,
          display: "flex",
        }}
      />
      {children}
    </div>
  );
}

function HeaderContent({
  data,
  size,
  theme,
  fontFamily,
}: {
  data: CardData;
  size: "small" | "large";
  theme: Theme;
  fontFamily: string;
}) {
  const isRepo = data.type === "repo";
  const name = isRepo ? data.name : data.name || data.username;
  const subtext = isRepo ? `${data.owner}/${data.name}` : `@${data.username}`;
  const desc =
    "description" in data ? data.description : "bio" in data ? data.bio : null;

  const imgSize = size === "small" ? "48" : "96"; // Reduced for 960px width
  const nameSize = size === "small" ? "20px" : "40px"; // Reduced
  const subtextSize = size === "small" ? "12px" : "20px"; // Reduced

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size === "small" ? "12px" : "32px",
      }}
    >
      {/* Avatar */}
      <div style={{ display: "flex", position: "relative" }}>
        {/* Fake Blur Glow using multi-layered box-shadow or gradient div */}
        <div
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            borderRadius: "50%",
            background: `linear-gradient(to right, ${theme.borderLeft}, ${theme.accent})`,
            filter: "blur(8px)", // Satori might ignore this, but worth trying or fallback to shadow
            opacity: 0.6,
            display: "flex",
          }}
        />
        {/* Fallback glow for Satori (shadows) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "50%",
            boxShadow: `0 0 15px 2px ${theme.borderLeft}`,
            opacity: 0.6,
            display: "flex",
          }}
        />

        <img
          src={data.avatarUrl}
          width={imgSize}
          height={imgSize}
          style={{
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.9)", // Brighter border
            position: "relative",
            zIndex: 10,
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: nameSize,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.1,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: size === "small" ? "260px" : "700px",
            fontFamily: '"Orbitron"',
            letterSpacing: "0.05em",
          }}
        >
          {name}
        </span>
        <span
          style={{
            fontSize: subtextSize,
            color: theme.accent,
            marginTop: size === "small" ? "2px" : "8px",
          }}
        >
          {subtext}
        </span>
        {/* Bio/Desc for Large Card */}
        {size === "large" && desc && (
          <span
            style={{
              fontSize: "20px", // Increased from 16
              color: "#cbd5e1",
              marginTop: "16px",
              lineHeight: "1.5",
              maxWidth: "700px",
              display: "-webkit-box",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // lineClamp only works with -webkit-box and vertical orient in satori sometimes
              maxHeight: "60px",
            }}
          >
            {desc.substring(0, 100)}
            {desc.length > 100 ? "..." : ""}
          </span>
        )}
      </div>
    </div>
  );
}

function StatsRow({
  data,
  size,
  theme,
}: {
  data: CardData;
  size: "small" | "large";
  theme: Theme;
}) {
  const isRepo = data.type === "repo";
  const isOrg = data.type === "organization";

  let stats: { label: string; value: number; icon: any }[] = [];

  const iconSize = size === "small" ? 16 : 28;

  // Use raw SVGs for reliability in Satori
  const iconStyle = { color: theme.accent };

  if (isRepo) {
    stats = [
      {
        label: "Stars",
        value: data.stars,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
      {
        label: "Forks",
        value: data.forks,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
        ),
      },
      {
        label: "Watchers",
        value: data.watchers,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
    ];
  } else if (isOrg) {
    stats = [
      {
        label: "Stars",
        value: data.totalStars,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
      {
        label: "Repos",
        value: data.totalRepos,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        ),
      },
    ];
    if (size === "large")
      stats.push({
        label: "Forks",
        value: data.totalForks,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <line x1="6" y1="3" x2="6" y2="15" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M18 9a9 9 0 0 1-9 9" />
          </svg>
        ),
      });
  } else {
    // User
    stats = [
      {
        label: "Stars",
        value: (data as ProcessedUserData).totalStars,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        ),
      },
    ];
    if (size !== "small")
      stats.push({
        label: "Commits",
        value: (data as ProcessedUserData).totalCommits,
        icon: (
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={iconStyle}
          >
            <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
          </svg>
        ),
      });
    stats.push({
      label: "Repos",
      value: (data as ProcessedUserData).totalRepos,
      icon: (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={iconStyle}
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
    });
    stats.push({
      label: "Followers",
      value: (data as ProcessedUserData).followers,
      icon: (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={iconStyle}
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    });
  }

  return (
    <div
      style={{
        display: "flex",
        gap: size === "small" ? "8px" : "16px",
        width: "100%",
      }}
    >
      {stats.map((stat) => (
        <StatBlock
          key={stat.label}
          {...stat}
          size={size}
          count={stats.length}
        />
      ))}
    </div>
  );
}

function StatBlock({
  label,
  value,
  icon,
  size,
  count,
}: {
  label: string;
  value: number;
  icon: string;
  size: "small" | "large";
  count: number; // passed to calc width
}) {
  const formattedValue =
    value >= 1000 ? (value / 1000).toFixed(1) + "k" : value.toString();

  const padding = size === "small" ? "10px 12px" : "32px 24px"; // Increased padding
  const valSize = size === "small" ? "18px" : "36px"; // Increased from 28
  const labelSize = size === "small" ? "10px" : "16px"; // Increased from 14

  // Explicit width calculation for columns
  const widthStr = `${100 / count}%`;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        // Force Strict Equality
        width: widthStr,
        flex: "1 1 0%",
        backgroundColor: "rgba(30, 41, 59, 0.4)", // slate-800/40 approx
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: padding,
      }}
    >
      <div
        style={{
          display: "flex",
          marginBottom: size === "small" ? "8px" : "12px",
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: valSize,
          fontWeight: 700,
          color: "white",
        }}
      >
        {formattedValue}
      </span>
      <span
        style={{
          fontSize: labelSize,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "1px",
          fontWeight: 500,
          marginTop: "4px",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function LanguageBar({
  languages,
  height = "12px",
  showLegend = true,
  type,
}: {
  languages: Array<{
    name: string;
    color: string;
    percentage: number;
    textPercentage?: number;
  }>;
  height?: string;
  showLegend?: boolean;
  type: "small" | "large";
}) {
  if (!languages.length) return null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginTop: showLegend ? "24px" : "0",
      }}
    >
      {/* Bar */}
      <div
        style={{
          display: "flex",
          width: "100%",
          height: height,
          borderRadius: "6px",
          overflow: "hidden",
          backgroundColor: "rgba(30, 41, 59, 0.5)", // slate-800/50
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {languages.map((lang, i) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              height: "100%",
              backgroundColor: lang.color,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      {showLegend && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            marginTop: "12px",
            justifyContent: "center",
          }}
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: type === "small" ? "4px" : "8px",
              }}
            >
              <div
                style={{
                  width: type === "small" ? "4px" : "8px",
                  height: type === "small" ? "4px" : "8px",
                  borderRadius: "50%",
                  backgroundColor: lang.color,
                }}
              />
              <span
                style={{
                  fontSize: type === "small" ? "10px" : "14px",
                  fontWeight: 500,
                  color: "#cbd5e1",
                }}
              >
                {lang.name}
              </span>
              {typeof lang?.textPercentage === "number" &&
              lang.textPercentage <= 0 ? null : (
                <span
                  style={{
                    fontSize: type === "small" ? "10px" : "14px",
                    color: "#64748b",
                  }}
                >
                  {lang.textPercentage ?? Math.round(lang.percentage)}%
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContributionGraph({
  days,
  type,
  themeColor,
}: {
  days: ContributionWeek[];
  type: "small" | "large";
  themeColor?: string;
}) {
  const weeks = days;

  // Simple heuristic for contribution levels if mapped from default colors
  // 0: #ebedf0 (Light) / #161b22 (Dark)
  // 1: #9be9a8 / #0e4429
  // 2: #40c463 / #006d32
  // 3: #30a14e / #26a641
  // 4: #216e39 / #39d353

  const getThemeColor = (count: number, originalColor: string) => {
    if (count === 0) return "rgba(255, 255, 255, 0.05)";
    if (!themeColor) return originalColor; // Fallback to original if no theme color

    let opacity = 0.2;
    if (count >= 13) opacity = 1;
    else if (count >= 7) opacity = 0.8;
    else if (count >= 3) opacity = 0.6;
    else if (count >= 1) opacity = 0.4;

    // Convert hex to rgb for opacity if needed, or simple string replace if rgba
    // Assuming themeColor is hex #RRGGBB
    if (themeColor.startsWith("#")) {
      const r = parseInt(themeColor.slice(1, 3), 16);
      const g = parseInt(themeColor.slice(3, 5), 16);
      const b = parseInt(themeColor.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return themeColor;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "2px",
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "12px",
        }}
      >
        <span
          style={{
            fontSize: type === "small" ? "9px" : "12px",
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginRight: type === "small" ? "14px" : "36px",
          }}
        >
          Contributions
        </span>
        <span
          style={{
            fontSize: type === "small" ? "9px" : "12px",
            color: "#64748b",
          }}
        >
          Last 10 Weeks
        </span>
      </div>

      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}
      >
        {weeks.map((week, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: type === "small" ? "3px" : "5px",
            }}
          >
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                style={{
                  width: type === "small" ? "5px" : "12px",
                  height: type === "small" ? "5px" : "12px",
                  borderRadius: type === "small" ? "20px" : "2px",
                  backgroundColor: getThemeColor(
                    day.contributionCount,
                    day.color,
                  ),
                  // Removed explicit opacity to let RGBA handle it
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
