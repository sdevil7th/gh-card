"use client";

import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { ThemeId, themes } from "@/lib/themes";
import { Button } from "@/app/components/ui/Button";

export type FontId = "orbitron" | "inter" | "roboto" | "didot" | "garamond";

interface FontSelectorProps {
  selectedFont: FontId;
  onFontChange: (font: FontId) => void;
  theme: ThemeId;
}

export const fonts: { id: FontId; name: string; family: string }[] = [
  { id: "orbitron", name: "Orbitron (Tech)", family: "Orbitron" },
  { id: "inter", name: "Inter (Formal)", family: "Inter" },
  { id: "roboto", name: "Roboto (Clean)", family: "Roboto" },
  { id: "didot", name: "Didot (Classic)", family: '"GFS Didot"' },
  { id: "garamond", name: "Garamond (Elegant)", family: '"EB Garamond"' },
];

export function FontSelector({
  selectedFont,
  onFontChange,
  theme,
}: FontSelectorProps) {
  const activeTheme = themes[theme];

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Font Style
      </span>
      <div className="flex bg-black/20 p-1 rounded-lg w-full max-w-2xl flex-wrap justify-around">
        {fonts.map((font) => (
          <Button
            key={font.id}
            onClick={() => onFontChange(font.id)}
            variant="ghost"
            style={
              selectedFont === font.id
                ? {
                    backgroundColor: activeTheme.primary,
                    boxShadow: `0 0 15px ${activeTheme.glow}`,
                    color: "white",
                  }
                : undefined
            }
            className={`flex-1 min-w-[80px] py-1.5 px-2 rounded-md text-xs font-medium whitespace-nowrap ${
              selectedFont === font.id
                ? "shadow-md"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {font.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
