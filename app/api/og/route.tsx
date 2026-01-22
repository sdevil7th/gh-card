import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";
import { fetchGithubData } from "@/lib/github/client";
import { CardData, ProcessedUserData } from "@/lib/github/types";
import satori from "satori";

export const runtime = "edge";

// Load fonts from Google Fonts repository
// Load fonts from jsDelivr CDN (reliable)
const interRegular = fetch(
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff",
).then((res) => res.arrayBuffer());

const interBold = fetch(
  "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff",
).then((res) => res.arrayBuffer());

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");
  const format = searchParams.get("format") || "png";

  if (!username) {
    return new Response("Username is required", { status: 400 });
  }

  try {
    const data = await fetchGithubData(username);
    const [regularData, boldData] = await Promise.all([
      interRegular,
      interBold,
    ]);

    const fonts = [
      {
        name: "Inter",
        data: regularData,
        style: "normal" as const,
        weight: 400 as const,
      },
      {
        name: "Inter",
        data: boldData,
        style: "normal" as const,
        weight: 700 as const,
      },
    ];

    if (format === "svg") {
      const svg = await satori(<CardTemplate data={data} />, {
        width: 1200,
        height: 630,
        fonts: fonts,
      });

      return new Response(svg, {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Default to PNG via ImageResponse
    return new ImageResponse(<CardTemplate data={data} />, {
      width: 1200,
      height: 630,
      fonts: fonts,
    });
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}

// Optimized Card Template for Satori (Inline Styles)
function CardTemplate({ data }: { data: CardData }) {
  const isRepo = data.type === "repo";
  const isOrg = data.type === "organization";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        fontFamily: '"Inter"',
        color: "white",
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 2%, transparent 0%)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Glass Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "36px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "28px",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          width: "900px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <img
            src={data.avatarUrl}
            width="100"
            height="100"
            style={{
              borderRadius: "50%",
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontSize: "40px", fontWeight: 700, color: "#f8fafc" }}
            >
              {isRepo ? data.name : data.name || data.username}
            </span>
            <span style={{ fontSize: "20px", color: "#94a3b8" }}>
              {isRepo ? `${data.owner}/${data.name}` : `@${data.username}`}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "flex", gap: "16px", marginTop: "36px" }}>
          {isRepo ? (
            <>
              <StatBox icon="⭐" label="Stars" value={data.stars} />
              <StatBox icon="🍴" label="Forks" value={data.forks} />
              <StatBox icon="👀" label="Watchers" value={data.watchers} />
            </>
          ) : isOrg ? (
            <>
              <StatBox icon="⭐" label="Stars" value={data.totalStars} />
              <StatBox icon="📦" label="Repos" value={data.totalRepos} />
              <StatBox icon="🍴" label="Forks" value={data.totalForks} />
            </>
          ) : (
            <>
              <StatBox icon="⭐" label="Stars" value={data.totalStars} />
              <StatBox icon="📦" label="Repos" value={data.totalRepos} />
              <StatBox icon="🔥" label="Commits" value={data.totalCommits} />
              <StatBox icon="👥" label="Followers" value={data.followers} />
            </>
          )}
        </div>

        {/* Language Bar */}
        <div
          style={{
            marginTop: "36px",
            display: "flex",
            height: "16px",
            borderRadius: "8px",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {data.languages.map((lang) => (
            <div
              key={lang.name}
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
                height: "100%",
              }}
            />
          ))}
        </div>

        <div style={{ marginTop: "16px", display: "flex", gap: "16px" }}>
          {data.languages.map((lang) => (
            <div
              key={lang.name}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: lang.color,
                }}
              />
              <span style={{ fontSize: "16px", color: "#cbd5e1" }}>
                {lang.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  // Simple check for K/M formatting
  const formattedValue =
    value >= 1000 ? (value / 1000).toFixed(1) + "k" : value.toString();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "rgba(255, 255, 255, 0.05)",
        padding: "18px 24px",
        borderRadius: "20px",
        flex: 1,
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <span style={{ fontSize: "26px" }}>{icon}</span>
      <span
        style={{
          fontSize: "36px",
          fontWeight: 700,
          color: "#f8fafc",
          marginTop: "8px",
        }}
      >
        {formattedValue}
      </span>
      <span
        style={{
          fontSize: "18px",
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {label}
      </span>
    </div>
  );
}
