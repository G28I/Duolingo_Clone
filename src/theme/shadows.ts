/**
 * Lingua Design System - Shadows & Elevation Tokens
 */

export const shadows = {
  sm: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: "#0D132B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  // Playful 3D button depth tokens (Duolingo signature bottom border)
  button3D: {
    borderBottomWidth: 4,
  },
} as const;

export type Shadows = typeof shadows;
