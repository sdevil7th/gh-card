"use client";

import Tilt from "react-parallax-tilt";
import { CardContent } from "./CardContent";
import { CardData } from "@/lib/github/types";
import { ThemeId, themes } from "@/lib/themes";

import { FontId, fonts } from "../generator/FontSelector";

interface CardPreviewProps {
  data: CardData;
  theme: ThemeId;
  size: "small" | "large";
  font: FontId;
}

export function CardPreview({ data, theme, size, font }: CardPreviewProps) {
  if (!data) return null;

  const themeConfig = themes[theme];
  const fontConfig = fonts.find((f) => f.id === font);

  return (
    <div className="relative flex items-center justify-center p-20">
      {/* Background Glow for effect - dynamic based on theme */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[100px] rounded-full pointer-events-none"
        style={{ backgroundColor: themeConfig.glow }}
      />

      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.1}
        glareColor="#ffffff"
        glarePosition="all"
        glareBorderRadius="24px"
        scale={1.02}
        transitionSpeed={1500}
        className="z-10"
        style={{
          width: size === "small" ? "480px" : "800px", // Scaled down for preview (1280 -> 800)
          aspectRatio: size === "small" ? "480/270" : "1280/720",
          fontFamily: fontConfig?.family,
        }}
      >
        <CardContent data={data} theme={theme} size={size} />
      </Tilt>
    </div>
  );
}
