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
  },
};

export const themeList = Object.values(themes);

export const defaultTheme = themes["neon-purple"];
