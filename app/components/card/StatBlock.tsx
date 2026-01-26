import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { formatNumber } from "@/lib/utils/format";
import { ReactNode } from "react";

interface StatBlockProps {
  label: string;
  value: number;
  icon: ReactNode;
  delay?: number;
  size?: "small" | "large";
}

export function StatBlock({
  label,
  value,
  icon,
  delay = 0,
  size = "large",
}: StatBlockProps) {
  const isLarge = size === "large";

  return (
    <GlassPanel
      intensity="low"
      className={`flex flex-col items-center justify-center flex-1 w-0 hover:bg-white/10 transition-colors ${
        isLarge ? "p-6" : "p-3"
      }`}
    >
      <span className={`${isLarge ? "mb-2" : "mb-1"}`}>{icon}</span>
      <span
        className={`font-bold text-white tracking-tight ${isLarge ? "text-2xl" : "text-lg"}`}
      >
        {formatNumber(value)}
      </span>
      <span
        className={`text-slate-400 font-medium uppercase tracking-wider ${isLarge ? "text-sm" : "text-[10px]"}`}
      >
        {label}
      </span>
    </GlassPanel>
  );
}
