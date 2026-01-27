import { useState, useRef, useEffect } from "react";
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
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!data) return null;

  const themeConfig = themes[theme];
  const fontConfig = fonts.find((f) => f.id === font);

  // Base width for the card logic
  const baseWidth = size === "small" ? 480 : 800;

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.offsetWidth;
        // Add some margin on mobile so it doesn't touch edges (e.g. 16px each side = 32px)
        // On desktop (md:p-20), the parent has padding, but here we are measuring the container which is full width?
        // Wait, on desktop the container has padding `md:p-20`.
        // If we want consistent margin logic, we can just subtract a safe area.
        const margin = 32;
        const availableWidth = parentWidth - margin;

        // Limit scale to max 1 to prevent upscaling, but allow downscaling
        const newScale = Math.min(availableWidth / baseWidth, 1);
        setScale(newScale);
      }
    };

    // Initial calculation
    updateScale();

    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Also listen to window resize as backup/refinement
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [baseWidth]);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full max-w-full overflow-hidden min-h-[300px] md:min-h-[600px] py-10 md:p-20 transition-all"
    >
      {/* Background Glow for effect - dynamic based on theme */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[100px] rounded-full pointer-events-none transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: themeConfig.glow,
          transform: `translate(-50%, -50%) scale(${scale})`, // Also scale the glow
        }}
      />

      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          width: baseWidth, // Hardcode width so layout inside works
          height: size === "small" ? 270 : 450, // Hardcode height relative to width (16:9)
        }}
        className="relative z-10 flex-shrink-0 transition-all duration-700 ease-in-out"
      >
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
          className="w-full h-full"
          style={{
            fontFamily: fontConfig?.family,
          }}
        >
          <CardContent data={data} theme={theme} size={size} />
        </Tilt>
      </div>
    </div>
  );
}
