import { GlassPanel } from "@/app/components/ui/GlassPanel";
import { formatNumber } from "@/lib/utils/format";

interface StatBlockProps {
  label: string;
  value: number;
  icon: string;
  delay?: number;
}

export function StatBlock({ label, value, icon, delay = 0 }: StatBlockProps) {
  return (
    <GlassPanel
      intensity="low"
      className="flex flex-col items-center justify-center p-6 flex-1 hover:bg-white/10 transition-colors"
    >
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-2xl font-bold text-white tracking-tight">
        {formatNumber(value)}
      </span>
      <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">
        {label}
      </span>
    </GlassPanel>
  );
}
