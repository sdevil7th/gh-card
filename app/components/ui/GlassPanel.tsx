import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GlassPanelProps extends HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
}

export function GlassPanel({
  className,
  intensity = "medium",
  children,
  ...props
}: GlassPanelProps) {
  const intensityMap = {
    low: "bg-white/5 border-white/5 backdrop-blur-sm",
    medium: "bg-white/10 border-white/10 backdrop-blur-md shadow-xl",
    high: "bg-white/20 border-white/20 backdrop-blur-lg shadow-2xl",
  };

  return (
    <div
      className={cn("rounded-3xl border", intensityMap[intensity], className)}
      {...props}
    >
      {children}
    </div>
  );
}
