"use client";

import { ThemeId, themeList } from "@/lib/themes";
import { Button } from "@/app/components/ui/Button";

interface ThemeSelectorProps {
  selectedTheme: ThemeId;
  onThemeChange: (theme: ThemeId) => void;
}

export function ThemeSelector({
  selectedTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Color Theme
      </span>
      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {themeList.map((theme) => (
          <Button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            variant="ghost"
            className={`w-8 h-8 p-0 rounded-full transition-all duration-200 ring-2 ${
              selectedTheme === theme.id
                ? "ring-offset-2 ring-offset-slate-950 ring-white scale-110"
                : "ring-transparent opacity-70 hover:opacity-100 hover:scale-105"
            }`}
            style={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
              boxShadow:
                selectedTheme === theme.id
                  ? `0 0 20px ${theme.glow}`
                  : undefined,
            }}
            title={theme.name}
            aria-label={`Select ${theme.name} theme`}
          />
        ))}
      </div>
    </div>
  );
}
