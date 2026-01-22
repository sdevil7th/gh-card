export const themes = {
  dark: {
    name: "Midnight",
    bg: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    glass: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.1)",
    text: "#f8fafc",
    textMuted: "#94a3b8",
  },
  ocean: {
    name: "Ocean",
    bg: "linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)",
    glass: "rgba(255, 255, 255, 0.1)",
    border: "rgba(255, 255, 255, 0.2)",
    text: "#f0f9ff",
    textMuted: "#bae6fd",
  },
  sunset: {
    name: "Sunset",
    bg: "linear-gradient(135deg, #ff512f 0%, #dd2476 100%)",
    glass: "rgba(255, 255, 255, 0.1)",
    border: "rgba(255, 255, 255, 0.2)",
    text: "#fff1f2",
    textMuted: "#fecdd3",
  },
};

export type ThemeKey = keyof typeof themes;
