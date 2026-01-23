"use client";

import { ThemeId, themeList } from "@/lib/themes";

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
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
              selectedTheme === theme.id
                ? "ring-2 ring-offset-2 ring-offset-slate-950 ring-white scale-110"
                : "hover:scale-105 opacity-70 hover:opacity-100"
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
