/**
 * Lingua Design System
 * Unified theme tokens
 */

import { colors } from "./colors";
import { typeScale, fontFamilies } from "./typography";
import { spacing } from "./spacing";
import { radii } from "./radii";
import { shadows } from "./shadows";

export const theme = {
  colors,
  typography: {
    scale: typeScale,
    fonts: fontFamilies,
  },
  spacing,
  radii,
  shadows,
} as const;

export * from "./colors";
export * from "./typography";
export * from "./spacing";
export * from "./radii";
export * from "./shadows";

export type Theme = typeof theme;
