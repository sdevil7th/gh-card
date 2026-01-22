import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { fetchGithubData } from "@/lib/github/client";
import {
  CardData,
  ProcessedUserData,
  ContributionWeek,
} from "@/lib/github/types";

// Force Node.js runtime to avoid Edge issues with env vars
// export const runtime = "edge";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype|woff)'\)/,
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}

// Fixed font loading with error handling
const loadFonts = async () => {
  try {
    const [interRegular, interBold, orbitronBold] = await Promise.all([
      fetch(
        "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
      ).then((res) => res.arrayBuffer()),
      fetch(
        "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
      ).then((res) => res.arrayBuffer()),
      fetch(
        "https://cdn.jsdelivr.net/fontsource/fonts/orbitron@latest/latin-700-normal.woff",
      ).then((res) => res.arrayBuffer()),
    ]);
    return { interRegular, interBold, orbitronBold };
  } catch (e) {
    console.error("Font loading failure:", e);
    // Fallback or re-throw
    throw e;
  }
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const size = searchParams.get("size") === "small" ? "small" : "large";

  // Dimensions
  const width = size === "small" ? 500 : 1200;
  const height = size === "small" ? 280 : 630;

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN missing");
    return new Response("GITHUB_TOKEN is missing", { status: 500 });
  }

  try {
    const data = await fetchGithubData(username);
    const fontsData = await loadFonts();

    const fonts = [
      {
        name: "Inter",
        data: fontsData.interRegular,
        style: "normal" as const,
        weight: 400 as const,
      },
      {
        name: "Inter",
        data: fontsData.interBold,
        style: "normal" as const,
        weight: 700 as const,
      },
      {
        name: "Orbitron",
        data: fontsData.orbitronBold,
        style: "normal" as const,
        weight: 700 as const,
      },
    ];

    return new ImageResponse(
      <Wrapper size={size} width={width} height={height}>
        {size === "small" ? (
          <SmallCard data={data} />
        ) : (
          <LargeCard data={data} />
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
    return new Response(`Failed: ${e.message}`, {
      status: 500,
    });
  }
}

// --- Layouts ---

function Wrapper({
  children,
  size,
  width,
  height,
}: {
  children: React.ReactNode;
  size: "small" | "large";
  width: number;
  height: number;
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
        background: "#0f172a", // Slate 950 to match preview
        color: "white",
        fontFamily: '"Inter"',
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
          width: size === "small" ? "400px" : "1000px",
          height: size === "small" ? "300px" : "700px",
          // Satori safe radial gradient
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.4), transparent 70%)",
          display: "flex",
        }}
      />
      {children}
    </div>
  );
}

function LargeCard({ data }: { data: CardData }) {
  const isRepo = data.type === "repo";

  return (
    <GlassContainer width="100%" height="100%" padding="40px">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            width: "100%",
            marginBottom: "24px",
            flexShrink: 0,
          }}
        >
          <HeaderContent data={data} size="large" />
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "16px",
            marginBottom: "24px",
            flexShrink: 0,
          }}
        >
          <StatsRow data={data} size="large" />
        </div>

        {/* Language Bar - Fixed Height */}
        <div style={{ flexShrink: 0 }}>
          <LanguageBar languages={data.languages} />
        </div>

        {/* Contributions (Users Only) - Flex Grow to fill space but check overflow */}
        {!isRepo && "contributions" in data && (
          <div style={{ marginTop: "auto", width: "100%" }}>
            <ContributionGraph days={data.contributions.calendar} />
          </div>
        )}

        {/* Spacer if no contributions */}
        {(isRepo || !("contributions" in data)) && <div style={{ flex: 1 }} />}

        {/* Footer */}
        <div style={{ flexShrink: 0, marginTop: "24px" }}>
          <Footer />
        </div>
      </div>
    </GlassContainer>
  );
}

function SmallCard({ data }: { data: CardData }) {
  return (
    <GlassContainer width="100%" height="100%" padding="24px">
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
          <HeaderContent data={data} size="small" />
        </div>

        {/* Middle: Stats */}
        <div
          style={{
            display: "flex",
            width: "100%",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <StatsRow data={data} size="small" />
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
          <LanguageBar
            languages={data.languages}
            height="8px"
            showLegend={false}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "12px",
              fontSize: "10px",
              color: "#64748b",
            }}
          >
            <span>
              {data.languages
                .slice(0, 3)
                .map((l) => l.name)
                .join(" • ")}
            </span>
            <span>gh-card.dev</span>
          </div>
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
}: {
  children: React.ReactNode;
  width: string;
  height: string;
  padding?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: width,
        height: height,
        // Satori-safe background (No complex linear-gradient angles if failing, but standard angles usually work)
        // Trying simpler gradient to be safe
        background:
          "linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02))",

        // Borders - Solid lines are safest
        borderTop: "2px solid rgba(255, 255, 255, 0.4)",
        borderLeft: "2px solid rgba(255, 255, 255, 0.25)",
        borderRight: "2px solid rgba(255, 255, 255, 0.15)",
        borderBottom: "2px solid rgba(255, 255, 255, 0.1)",

        borderRadius: "0px",

        padding: padding,
        position: "relative",
        overflow: "hidden",

        // REMOVING INSET SHADOW - This often causes 500 in Satori if too complex or unsupported
        // boxShadow: "inset 0 0 40px rgba(255, 255, 255, 0.05)",
      }}
    >
      {/* Sheen Effect - Simple Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "45%",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.05), transparent)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
}

function HeaderContent({
  data,
  size,
}: {
  data: CardData;
  size: "small" | "large";
}) {
  const isRepo = data.type === "repo";
  const name = isRepo ? data.name : data.name || data.username;
  const subtext = isRepo ? `${data.owner}/${data.name}` : `@${data.username}`;
  const desc =
    "description" in data ? data.description : "bio" in data ? data.bio : null;

  const imgSize = size === "small" ? "48" : "96";
  const nameSize = size === "small" ? "20px" : "36px";
  const subtextSize = size === "small" ? "12px" : "20px";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: size === "small" ? "12px" : "24px",
      }}
    >
      {/* Avatar */}
      <div style={{ display: "flex", position: "relative" }}>
        <img
          src={data.avatarUrl}
          width={imgSize}
          height={imgSize}
          style={{
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.2)",
            position: "relative",
          }}
        />
        {/* Simple Ring Overlay */}
        <div
          style={{
            position: "absolute",
            top: "-2px",
            left: "-2px",
            right: "-2px",
            bottom: "-2px",
            borderRadius: "50%",
            border: "2px solid rgba(139, 92, 246, 0.5)", // fallback ring
            opacity: 0.8,
            display: "flex",
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
            maxWidth: size === "small" ? "260px" : "600px",
            fontFamily: '"Orbitron"',
            letterSpacing: "0.05em",
          }}
        >
          {name}
        </span>
        <span
          style={{ fontSize: subtextSize, color: "#a5b4fc", marginTop: "2px" }}
        >
          {subtext}
        </span>
        {/* Bio/Desc for Large Card */}
        {size === "large" && desc && (
          <span
            style={{
              fontSize: "16px",
              color: "#cbd5e1",
              marginTop: "12px",
              lineHeight: "1.5",
              maxWidth: "600px",
              display: "-webkit-box",
              overflow: "hidden",
              textOverflow: "ellipsis",
              // lineClamp only works with -webkit-box and vertical orient in satori sometimes
              maxHeight: "48px",
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

function StatsRow({ data, size }: { data: CardData; size: "small" | "large" }) {
  const isRepo = data.type === "repo";
  const isOrg = data.type === "organization";

  let stats: { label: string; value: number; icon: string }[] = [];

  if (isRepo) {
    stats = [
      { label: "Stars", value: data.stars, icon: "⭐" },
      { label: "Forks", value: data.forks, icon: "🍴" },
    ];
    if (size === "large")
      stats.push({ label: "Watchers", value: data.watchers, icon: "👀" });
  } else if (isOrg) {
    stats = [
      { label: "Stars", value: data.totalStars, icon: "⭐" },
      { label: "Repos", value: data.totalRepos, icon: "📦" },
    ];
    if (size === "large")
      stats.push({ label: "Forks", value: data.totalForks, icon: "🍴" });
  } else {
    // User
    stats = [
      {
        label: "Stars",
        value: (data as ProcessedUserData).totalStars,
        icon: "⭐",
      },
    ];
    if (size !== "small")
      stats.push({
        label: "Commits",
        value: (data as ProcessedUserData).totalCommits,
        icon: "🔥",
      });
    stats.push({
      label: "Repos",
      value: (data as ProcessedUserData).totalRepos,
      icon: "📦",
    });
    stats.push({
      label: "Followers",
      value: (data as ProcessedUserData).followers,
      icon: "👥",
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

  const padding = size === "small" ? "10px 12px" : "20px 16px";
  const iconSize = size === "small" ? "16px" : "28px";
  const valSize = size === "small" ? "18px" : "28px";
  const labelSize = size === "small" ? "10px" : "14px";

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
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        borderRadius: "16px",
        padding: padding,
      }}
    >
      <span style={{ fontSize: iconSize, marginBottom: "8px" }}>{icon}</span>
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
}: {
  languages: Array<{
    name: string;
    color: string;
    percentage: number;
  }>;
  height?: string;
  showLegend?: boolean;
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
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: lang.color,
                }}
              />
              <span
                style={{ fontSize: "14px", fontWeight: 500, color: "#cbd5e1" }}
              >
                {lang.name}
              </span>
              <span style={{ fontSize: "14px", color: "#64748b" }}>
                {lang.percentage}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ContributionGraph({ days }: { days: ContributionWeek[] }) {
  const weeks = days;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "24px",
        width: "100%",
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
            fontSize: "14px",
            fontWeight: 600,
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Contributions
        </span>
        <span style={{ fontSize: "14px", color: "#64748b" }}>
          Last 10 Weeks
        </span>
      </div>

      <div
        style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}
      >
        {weeks.map((week, i) => (
          <div
            key={i}
            style={{ display: "flex", flexDirection: "column", gap: "5px" }}
          >
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "2px",
                  backgroundColor:
                    day.contributionCount > 0
                      ? day.color
                      : "rgba(255, 255, 255, 0.05)",
                  opacity: day.contributionCount > 0 ? 0.8 : 1,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        paddingTop: "16px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        fontSize: "14px",
        color: "#94a3b8", // slate-400
      }}
    >
      <span>Generated by gh-card.dev</span>
      <span>{new Date().toLocaleDateString()}</span>
    </div>
  );
}
