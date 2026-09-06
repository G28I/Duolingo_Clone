/**
 * Lingua Design System - Color Tokens
 * Source: 01-design-system.png
 */

export const colors = {
  // Brand / Primary
  primary: {
    purple: "#6C4EF5", // LINGUA PURPLE
    deepPurple: "#5B3BF6", // LINGUA DEEP PURPLE
    blue: "#4D8BFF", // LINGUA BLUE
    green: "#21C16B", // LINGUA GREEN
  },

  // Semantic
  semantic: {
    success: "#21C16B",
    warning: "#FFC800",
    streak: "#FF8A00",
    error: "#FF4D4F",
    info: "#4D8BFF",
  },

  // Neutrals
  neutrals: {
    textPrimary: "#0D132B",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    surface: "#F6F7FB",
    background: "#FFFFFF",
  },

  // Flat aliases for quick access
  brand: {
    purple: "#6C4EF5",
    deepPurple: "#5B3BF6",
    blue: "#4D8BFF",
    green: "#21C16B",
  },
} as const;

export type Colors = typeof colors;
