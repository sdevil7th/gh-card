// Theme configuration for Fancy GitHub Cards
// Each theme defines primary, accent colors and gradient configurations

export type ThemeId =
  | "neon-purple"
  | "cyber-blue"
  | "emerald-green"
  | "sunset-orange"
  | "hot-magenta"
  | "electric-yellow"
  | "aqua-cyan"
  | "monochrome";

export interface Theme {
  id: ThemeId;
  name: string;
  primary: string;
  accent: string;
  // Border colors (top to bottom gradient)
  borderTop: string;
  borderLeft: string;
  borderRight: string;
  borderBottom: string;
  // Glow color for background and shadows
  glow: string;
  // Background tint color
  backgroundTint: string;
  // Distinct palette for charts/languages (5 colors)
  palette: string[];
}

export const themes: Record<ThemeId, Theme> = {
  "neon-purple": {
    id: "neon-purple",
    name: "Neon Purple",
    primary: "#8B5CF6",
    accent: "#A78BFA",
    borderTop: "rgba(167, 139, 250, 0.8)",
    borderLeft: "rgba(139, 92, 246, 0.6)",
    borderRight: "rgba(99, 102, 241, 0.4)",
    borderBottom: "rgba(79, 70, 229, 0.3)",
    glow: "rgba(139, 92, 246, 0.3)",
    backgroundTint: "rgba(30, 20, 50, 0.95)",
    // Purple, Pink, Cyan, White, Deep Purple
    palette: ["#8B5CF6", "#F472B6", "#22D3EE", "#FFFFFF", "#4C1D95"],
  },
  "cyber-blue": {
    id: "cyber-blue",
    name: "Cyber Blue",
    primary: "#3B82F6",
    accent: "#60A5FA",
    borderTop: "rgba(96, 165, 250, 0.8)",
    borderLeft: "rgba(59, 130, 246, 0.6)",
    borderRight: "rgba(37, 99, 235, 0.4)",
    borderBottom: "rgba(29, 78, 216, 0.3)",
    glow: "rgba(59, 130, 246, 0.3)",
    backgroundTint: "rgba(20, 30, 50, 0.95)",
    // Blue, Teal, Sky, Navy, White
    palette: ["#3B82F6", "#2DD4BF", "#38BDF8", "#1E3A8A", "#FFFFFF"],
  },
  "emerald-green": {
    id: "emerald-green",
    name: "Emerald Green",
    primary: "#10B981",
    accent: "#34D399",
    borderTop: "rgba(52, 211, 153, 0.8)",
    borderLeft: "rgba(16, 185, 129, 0.6)",
    borderRight: "rgba(5, 150, 105, 0.4)",
    borderBottom: "rgba(4, 120, 87, 0.3)",
    glow: "rgba(16, 185, 129, 0.3)",
    backgroundTint: "rgba(20, 40, 35, 0.95)",
    // Green, Lime, Teal, White, Dark Green
    palette: ["#10B981", "#A3E635", "#14B8A6", "#FFFFFF", "#064E3B"],
  },
  "sunset-orange": {
    id: "sunset-orange",
    name: "Sunset Orange",
    primary: "#F97316",
    accent: "#FB923C",
    borderTop: "rgba(251, 146, 60, 0.8)",
    borderLeft: "rgba(249, 115, 22, 0.6)",
    borderRight: "rgba(234, 88, 12, 0.4)",
    borderBottom: "rgba(194, 65, 12, 0.3)",
    glow: "rgba(249, 115, 22, 0.3)",
    backgroundTint: "rgba(45, 25, 20, 0.95)",
    // Orange, Yellow, Red, White, Burnt Orange
    palette: ["#F97316", "#FACC15", "#EF4444", "#FFFFFF", "#7C2D12"],
  },
  "hot-magenta": {
    id: "hot-magenta",
    name: "Hot Magenta",
    primary: "#EC4899",
    accent: "#F472B6",
    borderTop: "rgba(244, 114, 182, 0.8)",
    borderLeft: "rgba(236, 72, 153, 0.6)",
    borderRight: "rgba(219, 39, 119, 0.4)",
    borderBottom: "rgba(190, 24, 93, 0.3)",
    glow: "rgba(236, 72, 153, 0.3)",
    backgroundTint: "rgba(45, 20, 35, 0.95)",
    // Pink, Purple, Rose, White, Burgundy
    palette: ["#EC4899", "#A855F7", "#FB7185", "#FFFFFF", "#831843"],
  },
  "electric-yellow": {
    id: "electric-yellow",
    name: "Electric Yellow",
    primary: "#EAB308",
    accent: "#FDE047",
    borderTop: "rgba(253, 224, 71, 0.8)",
    borderLeft: "rgba(234, 179, 8, 0.6)",
    borderRight: "rgba(202, 138, 4, 0.4)",
    borderBottom: "rgba(161, 98, 7, 0.3)",
    glow: "rgba(234, 179, 8, 0.3)",
    backgroundTint: "rgba(40, 35, 20, 0.95)",
    // Yellow, Amber, Lime, White, Brown
    palette: ["#EAB308", "#F59E0B", "#84CC16", "#FFFFFF", "#713F12"],
  },
  "aqua-cyan": {
    id: "aqua-cyan",
    name: "Aqua Cyan",
    primary: "#06B6D4",
    accent: "#22D3EE",
    borderTop: "rgba(34, 211, 238, 0.8)",
    borderLeft: "rgba(6, 182, 212, 0.6)",
    borderRight: "rgba(8, 145, 178, 0.4)",
    borderBottom: "rgba(14, 116, 144, 0.3)",
    glow: "rgba(6, 182, 212, 0.3)",
    backgroundTint: "rgba(20, 35, 40, 0.95)",
    // Cyan, White, Dark Slate, Teal, Sky Blue - Higher Contrast
    palette: ["#22D3EE", "#FFFFFF", "#164E63", "#4ADE80", "#60A5FA"],
  },
  monochrome: {
    id: "monochrome",
    name: "Monochrome",
    primary: "#FFFFFF",
    accent: "#A1A1AA",
    borderTop: "rgba(255, 255, 255, 0.6)",
    borderLeft: "rgba(161, 161, 170, 0.4)",
    borderRight: "rgba(113, 113, 122, 0.3)",
    borderBottom: "rgba(82, 82, 91, 0.2)",
    glow: "rgba(161, 161, 170, 0.2)",
    backgroundTint: "rgba(30, 30, 32, 0.95)",
    // White, Gray, Slate, Zinc, Black
    palette: ["#FFFFFF", "#9CA3AF", "#4B5563", "#D4D4D8", "#000000"],
  },
};

export const themeList = Object.values(themes);

export const defaultTheme = themes["neon-purple"];

export function getThemePalette(theme: Theme): string[] {
  return theme.palette;
}
