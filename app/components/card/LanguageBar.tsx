interface Language {
  name: string;
  color: string;
  percentage: number;
  size?: number;
}

export function LanguageBar({ languages }: { languages: Language[] }) {
  if (!languages.length) return null;

  return (
    <div className="w-full mt-6">
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800/50 ring-1 ring-white/10">
        {languages.map((lang) => (
          <div
            key={lang.name}
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
            }}
            className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-1000 ease-out"
          />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-4 justify-center">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-xs font-medium text-slate-300">
              {lang.name}
            </span>
            <span className="text-xs text-slate-500">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
