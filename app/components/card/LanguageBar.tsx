interface Language {
  name: string;
  color: string;
  percentage: number;
  textPercentage: number;
  size?: number;
}

export function LanguageBar({
  languages,
  height = "12px",
  showLegend = true,
  type = "large",
}: {
  languages: Language[];
  height?: string;
  showLegend?: boolean;
  type?: "small" | "large";
}) {
  if (!languages.length) return null;

  const isSmall = type === "small";

  return (
    <div className={`w-full ${!isSmall ? "mt-4" : "mt-2"}`}>
      <div
        className="flex w-full overflow-hidden rounded-full bg-slate-800/50 ring-1 ring-white/10"
        style={{ height }}
      >
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

      {showLegend && (
        <div
          className={`mt-3 flex flex-wrap justify-center ${
            isSmall ? "gap-2" : "gap-4"
          }`}
        >
          {languages.map((lang) => (
            <div
              key={lang.name}
              className={`flex items-center ${isSmall ? "gap-1" : "gap-2"}`}
            >
              <span
                className={`rounded-full ${isSmall ? "h-1 w-1" : "h-2 w-2"}`}
                style={{ backgroundColor: lang.color }}
              />
              <span
                className={`font-medium text-slate-300 ${
                  isSmall ? "text-[8px]" : "text-sm"
                }`}
              >
                {lang.name}
              </span>
              <span
                className={`text-slate-500 ${
                  isSmall ? "text-[8px]" : "text-sm"
                }`}
              >
                {lang.textPercentage}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
